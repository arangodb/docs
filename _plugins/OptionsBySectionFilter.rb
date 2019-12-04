module OptionsBySectionFilter
    SECTION_NAMES = {
        'arangosearch' => 'ArangoSearch',
        'http' => 'HTTP',
        'javascript' => 'JavaScript',
        'ldap' => 'LDAP',
        'rocksdb' => 'RocksDB',
        'ssl' => 'SSL',
        'tcp' => 'TCP',
        'ttl' => 'TTL',
        'vst' => 'VST',
        'wal' => 'WAL'
    }
    def capitalize_section(input)
        name = SECTION_NAMES[input]
        return name if name != nil
        return nil if !input.is_a? String
        input.capitalize
    end

    def options_by_section(input)
        return nil if input == nil
        # grrr ruby....there is for sure a better conversion strategy..
        by_section = Hash.new
        input.each {|k, v|
            section = v["section"]
            by_section[section] = Hash.new if !by_section[section]
            by_section[section][k] = v
        }
        by_section.sort.map {|k, v| [k == "" ? "global" : k, v] }.to_h
    end
end
  
Liquid::Template.register_filter(OptionsBySectionFilter)