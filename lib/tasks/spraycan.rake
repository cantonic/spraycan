namespace :spraycan do
  desc 'Import Theme from engine'
  task :import_railtie_assets, [:name] => [:environment] do |t, args|
    railtie = Rails.application.railties.all.detect {|r| r.railtie_name == args[:name] }
    if railtie.nil?
      puts "Railtie named '#{args[:name]}' is not loaded."
    else
      Spraycan::Import.execute(railtie)
    end
  end

  desc 'Export Theme to engine'
  task :export_railtie_assets, [:name] => [:environment] do |t, args|
    railtie = Rails.application.railties.all.detect {|r| r.railtie_name == args[:name] }
    if railtie.nil?
      puts "Railtie named '#{args[:name]}' is not loaded."
    else
      Spraycan::Export.new.execute(railtie)
    end

  end

  desc 'Dump all themes and palettes to a single file'
  task :dump => :environment do
    output = { :themes => [], :palettes => [], :preferences => {:spraycan => {} } }

    Spraycan::Theme.all.each do |theme|
      output[:themes] << JSON.parse(theme.export)
    end

    Spraycan::Palette.all.each do |palette|
      output[:palettes] << JSON.parse(palette.export)
    end

    output[:preferences][:spraycan] = Spraycan::Config.preferences

    path = File.join(Dir.pwd, 'spraycan.json')

    File.open(path, 'w') {|f| f.write(output.to_json) }

    puts "All theme(s), palette(s) and preferences exported to: #{path}"
  end

  desc 'Batch import multiple themes and palettes from a single file'
  task :load => :environment do

    path = File.join(Dir.pwd, 'spraycan.json')

    if File.exists? path
      data = JSON.parse(File.open(path).read)

      data['themes'].each do |theme|
        Spraycan::Theme.import_from_json(theme)
      end

      data['palettes'].each do |palette|
        palette = palette["palette"] if palette.keys.include? "palette"
        prefs = palette.delete 'preferences'

        p = Spraycan::Palette.create(palette) 
        prefs.each { |pref, value| p.send "preferred_#{pref}=".to_sym, value }
      end

      data['preferences']['spraycan'].each { |pref, value| Spraycan::Config.send "preferred_#{pref}=".to_sym, value }


      puts "Imported theme(s), palette(s) and preferences from #{path}"
    else
      puts "Could not find import at #{path}"
    end
  end
end
