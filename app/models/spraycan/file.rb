require "fileutils"

class Spraycan::File < ActiveRecord::Base
  belongs_to :theme

  mount_uploader :file, GraphicUploader

  before_save :set_name

  def body
    self.file.read
  end

  def url
    self.file.url
  end

  def image?
    %w{jpg jpeg png gif}.include? name.split('.')[1]
  end

  def width
    image? ? ((`identify -format "%wx%h" #{self.file.path}`.strip.split('x').first || 0) rescue 0) : 0
  end

  def height
    image? ? ((`identify -format "%wx%h" #{self.file.path}`.strip.split('x').last || 0) rescue 0) : 0
  end

  private 
    def set_name
      self.name = file.file.filename
    end
end
