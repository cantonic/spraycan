require 'guid'
require 'rabl'

module Spraycan
  class Engine < Rails::Engine
    isolate_namespace Spraycan
    railtie_name "spraycan"

    config.autoload_paths += %W(#{root}/lib)

    def self.activate
      if Rails.application.config.spraycan.enable_editor

        #define overrides needed for theming UI
        Rails.application.config.spraycan.editor_virtual_paths.each do |layout|
          Deface::Override.new(:virtual_path => layout,
                          :name => "_spraycan_ui",
                          :insert_bottom => "head",
                          :partial => "spraycan/shared/layout_scripts")

        end

      end

      # Rails.application.config.active_record.observers = :compile_sweeper
    end

    def self.initialize_themes
      if Rails.application.config.deface.enabled
        #clear all WIP overrides, they get reloaded below
        Deface::Override.all.each do |virtual_path, overrides|
          overrides.reject! {|name, override| override.args[:from_editor] }
        end

        #load all overrides from db
        if Spraycan::Theme.table_exists?
          Spraycan::Theme.active.includes(:view_overrides).each { |theme| theme.view_overrides.map(&:initiate) }
        end
      end

    end

    config.to_prepare &method(:activate).to_proc

    # sets up spraycan environment
    #
    initializer "spraycan.environment", :after => :load_environment_config do |app|
      #setup real env object
      app.config.spraycan = Spraycan::Environment.new

      # adds global before_filter that reloads all overrides from DB
      # this is needed in production where multiple app processes are
      # rendering so they must have the most recent overrides loaded.
      #
      # todo: consider using (a shared) Rails.cache to store overrides,
      # and re-enabling the old initialize_themes method in 
      # spraycan/base_controller
      ActiveSupport.on_load(:action_controller) do
        before_filter { Spraycan::Engine.initialize_themes }
      end
    end

  end
end

