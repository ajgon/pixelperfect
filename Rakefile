#!/usr/bin/env rake
begin
  require 'bundler/setup'
rescue LoadError
  puts 'You must `gem install bundler` and `bundle install` to run rake tasks'
end
require 'rake'
require 'rubygems'
require 'yaml'

def closure js
  "(function() {\n    \"use strict\";\n#{js}\n}());"
end

def get_html file, translations
  html = File.read(File.join(File.dirname(__FILE__), 'src', file)).gsub(/>\s+</, '><').strip
  translations.each_pair do |key, translation|
    html.gsub!('##' + key.upcase + '##', translation)
  end
  html
end

def jslint
  jslint_config = YAML.load_file('jslint.yml')
  js_files = Dir.glob(jslint_config['jslint']['paths']).to_a - jslint_config['jslint']['exclude_paths'].to_a

  Bundler.setup
  puts "Running JSLint:\n\n"
  errors = 0
  js_files.each do |js|
    print "checking #{js}... "
    output = `jslint #{js}`
    if $? == 0
      puts "OK"
    else
      print "\n"
      print output
      errors += output.scan(/Lint at/).size
    end
  end

  if errors > 0
    puts "Found #{errors} error#{errors > 1 ? 's' : ''}.\nJSLint test failed."
    false
  else
    puts "No JS errors found."
    true
  end

end

def build type = :production, lang = nil
  require 'sprockets'
  require 'uglifier'
  require 'yui/compressor'
  require 'base64'
  require 'yaml'
  sprockets = Sprockets::Environment.new(File.dirname(__FILE__))
  sprockets.append_path 'src/'
  lang = lang.nil? ? 'en' : lang
  begin
    translations = YAML.load_file(File.join(File.dirname(__FILE__), 'src', 'lang', lang.to_s.downcase + '.yml'))
  rescue
    puts "Language '#{lang}' does not exists!"
    return
  end

  # Build CSS
  css = sprockets.find_asset('pixelperfect.css.scss').to_s
  css = YUI::CssCompressor.new.compress( css )

  # Build JS
  js = closure sprockets.find_asset('pixelperfect.js').to_s
  js = js.gsub(/\/\*jslint.*?[^e]\*\//, '').gsub(/\/\*(global|properties).*?\*\//m, '').gsub(/\/\/.*?\n/, '') if type == :lint

  js.sub!('##CSS_BASE64##', Base64.strict_encode64(css))
  js.sub!('##HTML##', get_html('pixelperfect.html', translations))

  js = Uglifier.compile(js) if type == :production

  js = "/*jslint vars: true, white: true, browser: true */\n/*global $, PixelPerfect */\n" + js if type == :lint

  File.open('dist/pixelperfect.js', 'w') do |f|
    f.write(js)
  end

end

desc "Build pixelperfect"
task :build do
  jslint_ok = jslint
  if jslint_ok
    build :lint, ENV['LANG']
    print "Running JSLint on built non-uglified file... "
    output = `jslint dist/pixelperfect.js`
    if $? == 0
      puts "OK"
      puts "Building uglified file, ready for production"
      build :production, ENV['LANG']
    else
      puts "FAILED"
      puts output
    end
  end
end

desc "Build pixelperfect but don't uglify JavaScript"
task :build_dev do
  build :development, ENV['LANG']
end

desc "Test all javascript files with jslint"
task :jslint do
  jslint
end

task :default => :build
