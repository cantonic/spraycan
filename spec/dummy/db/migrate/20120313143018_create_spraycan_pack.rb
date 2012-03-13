class CreateSpraycanPack < ActiveRecord::Migration
  def change
    create_table :spraycan_packs do |t|
      t.string :name
      t.boolean :active, :default => false
      t.string :guid
      t.string :palette_guid
      t.text :preference_hash
      t.timestamps
    end

    create_table :spraycan_packs_themes, :id => false do |t|
      t.integer :pack_id
      t.integer :theme_id
    end
  end
end
