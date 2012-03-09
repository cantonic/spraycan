module Spraycan
  class Pack < ActiveRecord::Base
    has_and_belongs_to_many :themes, :join_table => 'spraycan_packs_themes'
    validates :guid, :presence => true, :uniqueness => true

    before_validation :set_guid
    before_save :check_active

    before_destroy { themes.clear }

    def update_from_running
      self.themes.clear
      Theme.active.each { |t| self.themes << t }

      if palette = Spraycan::Palette.where(:active => true).first
        self.palette_guid = palette.guid
      end

      self.preference_hash = Spraycan::Config.preferences.to_json
      self.save
    end

    def self.import_from_running(name='Current')
      pack = Pack.create(:name => name)
      pack.update_from_running
      pack
    end

    def theme_guids
      self.themes.map(&:guid)
    end

    def palette
      Palette.where(:guid => self.palette_guid).first
    end

    def background_image
      Spraycan::File.where(:guid => self.preferences['background_file_guid']).first
    end

    def logo_image
      Spraycan::File.where(:guid => self.preferences['logo_file_guid']).first
    end

    def preferences
      self.preference_hash.present? ? JSON.parse(self.preference_hash) : {}
    end

    def export
      self.to_json(:methods => [:theme_guids, :preferences], :only => [:name, :guid, :palette_guid, :active])
    end

    private
      def check_active
        if self.changed.include?('active') && self.active?
          Pack.update_all(:active => false)

          self.preferences.each { |pref, value| Spraycan::Config.send "preferred_#{pref}=".to_sym, value }

          if palette = Palette.where(:guid => self.palette_guid).first
            palette.active = true
            palette.save
          end

          self.themes.each do |theme|
            theme.active = true
            theme.save
          end

          CompileDigest.update_stylesheet_digest()
        end
      end

      def set_guid
        self.guid ||= Guid.new.to_s
      end
  end
end
