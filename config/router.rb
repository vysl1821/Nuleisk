Merb.logger.info("Compiling routes...")
Merb::Router.prepare do
  match(/\/proxied_resources(.*)/).to(:controller => "proxied_resources", :action => "show").name(:proxied_resources)

  match('/').to(:controller => 'application', :action => 'index').name(:welcome)
  
  #resources :languages
  #resources :users do
  #  collection :callback, :method => :post
  #  member :settings, :method => :get
  #end
  #match('/faq').to(:controller => 'welcome', :action => 'faq').name(:faq)
  #match("/sign_out").to(:controller => "sessions", :action => "destroy").name(:sign_out) # compatibility
  #match("/login").to(:controller => "sessions", :action => "new").name(:login) # compatibility
  #match("/logout").to(:controller => "sessions", :action => "destroy").name(:logout) # compatibility
  #match("/auth/interactive/callback").to(:controller => "sessions", :action => "create")
  #match("/auth/failure").to(:controller => "sessions", :action => "failure")

end
