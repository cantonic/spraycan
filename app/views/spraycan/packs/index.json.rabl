collection @packs

attributes :id, :name, :guid

node(:logo_url) { |pack| pack.logo_image.try(:url) }
node(:background_url) { |pack| pack.background_image.try(:url) }
node(:background_color) { |pack| pack.palette.preferred_layout_background_color }
