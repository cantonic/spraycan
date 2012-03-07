module Spraycan
  class Asset
    def self.favicon
      if @favicon = Spraycan::File.where(:guid => Spraycan::Config.favicon_file_guid).first
        @favicon
      else
        OpenStruct.new(:url => '')
      end
    end

    def self.logo
      if @logo = Spraycan::File.where(:guid => Spraycan::Config.logo_file_guid).first
        @logo
      else
        OpenStruct.new(:url => '', :height => 0, :width => 0)
      end
    end

    def self.background
      if @background = Spraycan::File.where(:guid => Spraycan::Config.background_file_guid).first
        @background
      else
        OpenStruct.new(:url => '', :height => 0, :width => 0)
      end
    end
  end
end
