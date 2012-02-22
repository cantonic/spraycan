module Spraycan
  class CompilerController < BaseController
    include Sprockets::Helpers::RailsHelper
    caches_page :css, :js

    def css
      #combine all active stylesheets into a single string
      @source = Theme.active.inject("") do |src, theme|
        src << theme.stylesheets.inject("") do |s, stylesheet|
          s << stylesheet.body 
        end
      end

      #pass to erb compiler first, to have preference values included
      @template = Erubis::Eruby.new(@source)
      palette = Spraycan::Palette.where(:active => true).first

      #sass compiler second, to re-use core's themes variables
      sass_engine = Sass::Engine.new(@template.result(binding()), :syntax => :scss)

      #return
      render :text => sass_engine.render, :content_type => "text/css"
    end

    def js
      @source = Theme.active.inject("") do |src, theme|
        src << theme.javascripts.inject("") do |s, javascript|
          s << javascript.body
        end
      end

      @template = Erubis::Eruby.new(@source)
      palette = Spraycan::Palette.where(:active => true).first

      render :text => @template.result(binding()), :content_type => "text/js"
    end

    private

    def controller
      self
    end
  end
end
