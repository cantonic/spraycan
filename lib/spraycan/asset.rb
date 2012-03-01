module Spraycan
  class Asset
    def self.favicon
      if @favicon = Spraycan::File.where(:id => Spraycan::Config.favicon_file_id).first
        @favicon
      else
        OpenStruct.new(:url => '')
      end
    end

    def self.logo
      if @logo = Spraycan::File.where(:id => Spraycan::Config.logo_file_id).first
        @logo
      else
        OpenStruct.new(:url => '', :height => 0, :width => 0)
      end
    end

    def self.background
      if @background = Spraycan::File.where(:id => Spraycan::Config.background_file_id).first
        @background
      else
        OpenStruct.new(:url => '', :height => 0, :width => 0)
      end
    end
  end
end
