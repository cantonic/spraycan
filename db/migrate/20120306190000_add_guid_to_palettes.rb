class AddGuidToPalettes < ActiveRecord::Migration
  def change
    add_column :spraycan_palettes, :guid, :string

    Spraycan::Palette.reset_column_information

    Spraycan::Palette.all.each {|f| f.save }
  end
end
