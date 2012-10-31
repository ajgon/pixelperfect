#!/usr/bin/env rake
begin
  require 'bundler/setup'
rescue LoadError
  puts 'You must `gem install bundler` and `bundle install` to run rake tasks'
end
require 'rake'
require 'rubygems'

def closure js
  "(function() {\n#{js}\n}())"
end

def build production = true
  require 'sprockets'
  require 'uglifier'
  require 'yui/compressor'
  require 'base64'
  sprockets = Sprockets::Environment.new(File.dirname(__FILE__))
  sprockets.append_path 'src/'

  # Build CSS
  css = sprockets.find_asset('pixelperfect.css.scss').to_s
  css = YUI::CssCompressor.new.compress( css )

  # Build JS
  js = closure sprockets.find_asset('pixelperfect.js').to_s.sub('##CSS_BASE64##', Base64.strict_encode64(css))
  js = Uglifier.compile(js) if production

  File.open('dist/pixelperfect.js', 'w') do |f|
    f.write(js)
  end

end

desc "Build pixelperfect"
task :build do
  build
end

desc "Build pixelperfect but don't uglify JavaScript"
task :build_dev do
  build false
end

task :default => :build
