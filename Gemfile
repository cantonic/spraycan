source :rubygems
 
gemspec

#stuff needed for dummy app
group :test do
  gem 'sqlite3'
  gem 'jquery-rails'
  gem 'capybara'#, :git => 'git://github.com/jnicklas/capybara.git'
  gem 'launchy'
  gem 'factory_girl_rails'
end

group :assets do
  gem 'sass-rails',   '~> 3.1.4'
  gem 'coffee-rails', '~> 3.1.1'
  gem 'uglifier', '>= 1.0.3'
  gem 'compass-rails'
end

#keeps db cleaner happy to be outside :test group
gem 'database_cleaner'


#only required for preferences - can drop when preferences are extracted
#will need to add rails requirement for test app
gem 'spree', :path => '../spree'
