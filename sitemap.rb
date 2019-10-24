# Generate sitemap.xml from all HTML files of stable version
#
# This is a temporary way to build a sitemap with canonical links only.
# The jekyll-sitemap plugin does not work with our symlinked folders.

require 'yaml'

config = YAML.load_file('_config.yml')
version = config['versions']['stable']
baseurl = config['url'] + config['baseurl']
dir = "_site/#{version}"

if not Dir.exist?(dir)
    raise IOError, "Source directory does not exist: #{dir}"
end

f = File.open('_site/sitemap.xml', 'w')

f.write('<?xml version="1.0" encoding="UTF-8"?>' + "\n")
f.write('<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "\n")

Dir.glob("#{dir}/**/*.html").sort_by{ |name| name }.each do |file|
    next if File.size(file) < 2048 # Redirect pages are ~1KB, others >16KB
    path = file.gsub(Regexp.new("^#{Regexp.quote(dir)}"), 'stable')
    f.write("<url><loc>#{baseurl}/#{path}</loc></url>\n")
end

f.write('</urlset>')
f.close()
