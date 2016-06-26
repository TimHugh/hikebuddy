require 'bundler'
Bundler.require

module HikeBuddy
  class Application < Sinatra::Base
    configure do
      set :root, File.dirname(__FILE__)
      set :public_folder, 'public/app'
    end

    get '/' do
      File.read('public/app/index.html')
    end
  end
end
