unless Spraycan::Palette.exists?
  Spraycan::Palette.create(:active => true)
end

if Spraycan::Theme.exists?(:applies_to => 'base')
  theme = Spraycan::Theme.where(:applies_to => 'base').first
else
  theme = Spraycan::Theme.create(:name => 'Base Theme', :applies_to => 'base')
end

Spraycan::Config.preferred_base_theme_id = theme.id
