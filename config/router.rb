Merb.logger.info("Compiling routes...")
Merb::Router.prepare do

  #match('/link').to(:controller => 'link', :action => 'show').name(:link)
  resources :link do
    collection :create, :method => :post
  end

  match(/\/(.*)/).to(:controller => "application", :action => "index").name(:search)  
  #resources :languages
  #resources :users do
  #  collection :callback, :method => :post
  #  member :settings, :method => :get
  #end
  #match("/sign_out").to(:controller => "sessions", :action => "destroy").name(:sign_out) # compatibility
  #match("/login").to(:controller => "sessions", :action => "new").name(:login) # compatibility
  #match("/logout").to(:controller => "sessions", :action => "destroy").name(:logout) # compatibility
  #match("/auth/interactive/callback").to(:controller => "sessions", :action => "create")
  #match("/auth/failure").to(:controller => "sessions", :action => "failure")

end
