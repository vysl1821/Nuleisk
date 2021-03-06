# Go to http://wiki.merbivore.com/pages/init-rb

# Specify your dependencies in the Gemfile but require them explicitly
require 'merb_sequel'
use_test :rspec
require 'merb-haml'
 
Merb::Config.use do |c|
  c[:use_mutex] = false
  c[:session_store] = 'cookie'  # can also be 'memory', 'memcache', 'container', 'datamapper
  
  # cookie session store configuration
  c[:session_secret_key]  = 'a3d03efc879a3b49a02cc70a429d6840eac98a1f'  # required for cookie session store
  c[:session_id_key] = '_nuleisk_session_id' # cookie session id key, defaults to "_session_id"
end
 
Merb::BootLoader.before_app_loads do
  # This will get executed after dependencies have been loaded but before your app's classes have loaded.
end
 
Merb::BootLoader.after_app_loads do
  # This will get executed after your app's classes have been loaded.
end
