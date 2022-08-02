module JekyllVersions
  class Version
    REGEX = /^[0-9]+\.[0-9]+$/

    include Comparable

    attr_reader :version

    def self.from_path(config, path)
      if (v = Pathname.new(path).each_filename.first) =~ REGEX
        Version.new(config, v)
      else
        puts "\033[31mVersion method from_path called with invalid path '#{path}'\033[0m"
      end
    end

    def initialize(config, v)
      @config = config
      @version = v
    end

    def name
      # if @config.release_info[version] && (name = @config.release_info[version]['name'])
      #   name
      # else
        version
      # end
    end

    def tag
      @config.versions.key(version)
    end

    def slug
      tag || version
    end

    def stable?
      tag == 'stable'
    end

    def to_liquid
      { 'name' => name, 'version' => version, 'tag' => tag, 'stable' => stable? }
    end

    def <=>(other)
      if other
        Gem::Version.new(version) <=> Gem::Version.new(other.version)
      else
        puts "\033[31mVersion method <=> called with falsy other, class '#{other.class}', inspect '#{other.inspect}', version '#{version}'\033[0m"
        for c in caller_locations
          puts c
        end
        1 # HACK: Does this help as a fallback?
      end
    end

    alias_method :eql?, :==

    def hash
      version.hash
    end
  end
end
