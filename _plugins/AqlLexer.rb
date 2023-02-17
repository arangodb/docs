Jekyll::Hooks.register :site, :pre_render do |site|
  require "rouge"

  class AqlLexer < Rouge::RegexLexer
    title 'AQL'
    desc 'ArangoDB Query Language (AQL) lexer'
    tag 'aql'
    filenames '*.aql'
    mimetypes 'application/x-aql'

    aqlBindVariablePattern = '@(?:_+[a-zA-Z0-9]+[a-zA-Z0-9_]*|[a-zA-Z0-9][a-zA-Z0-9_]*)'
    aqlBuiltinFunctionsPattern = "(?:" +
      "to_bool|to_number|to_string|to_array|to_list|is_null|is_bool|is_number|is_string|is_array|is_list|is_object|is_document|is_datestring|" +
      "typename|json_stringify|json_parse|concat|concat_separator|char_length|lower|upper|substring|left|right|trim|reverse|contains|" +
      "log|log2|log10|exp|exp2|sin|cos|tan|asin|acos|atan|atan2|radians|degrees|pi|regex_test|regex_replace|" +
      "like|floor|ceil|round|abs|rand|sqrt|pow|length|count|min|max|average|avg|sum|product|median|variance_population|variance_sample|variance|" +
      "bit_and|bit_or|bit_xor|bit_negate|bit_test|bit_popcount|bit_shift_left|bit_shift_right|bit_construct|bit_deconstruct|bit_to_string|bit_from_string|" +
      "first|last|unique|outersection|interleave|in_range|jaccard|matches|merge|merge_recursive|has|attributes|values|unset|unset_recursive|keep|keep_recursive|" +
      "near|within|within_rectangle|is_in_polygon|distance|fulltext|stddev_sample|stddev_population|stddev|" +
      "slice|nth|position|contains_array|translate|zip|call|apply|push|append|pop|shift|unshift|remove_value|remove_values|" +
      "remove_nth|replace_nth|date_now|date_timestamp|date_iso8601|date_dayofweek|date_year|date_month|date_day|date_hour|" +
      "date_minute|date_second|date_millisecond|date_dayofyear|date_isoweek|date_leapyear|date_quarter|date_days_in_month|date_trunc|date_round|" +
      "date_add|date_subtract|date_diff|date_compare|date_format|date_utctolocal|date_localtoutc|date_timezone|date_timezones|" +
      "fail|passthru|v8|sleep|schema_get|schema_validate|call_greenspun|version|noopt|noeval|not_null|" +
      "first_list|first_document|parse_identifier|current_user|current_database|collection_count|pregel_result|" +
      "collections|document|decode_rev|range|union|union_distinct|minus|intersection|flatten|is_same_collection|check_document|" +
      "ltrim|rtrim|find_first|find_last|split|substitute|ipv4_to_number|ipv4_from_number|is_ipv4|md5|sha1|sha512|crc32|fnv64|hash|random_token|to_base64|" +
      "to_hex|encode_uri_component|soundex|assert|warn|is_key|sorted|sorted_unique|count_distinct|count_unique|" +
      "levenshtein_distance|levenshtein_match|regex_matches|regex_split|ngram_match|ngram_similarity|ngram_positional_similarity|uuid|" +
      "tokens|exists|starts_with|phrase|min_match|boost|analyzer|" +
      "geo_point|geo_multipoint|geo_polygon|geo_multipolygon|geo_linestring|geo_multilinestring|geo_contains|geo_intersects|" +
      "geo_equals|geo_distance|geo_area|geo_in_range" +
      ")(?=\\s*\\()" # Will not recognize function if comment between name and opening parenthesis

    state :commentsandwhitespace do
      rule %r(\s+), Text
      rule %r(//.*), Comment::Single
      rule %r(/\*) do
        token Comment::Multiline
        push :multiline_comment
      end
    end

    state :multiline_comment do
      rule %r([^*]+), Comment::Multiline
      rule %r(\*/), Comment::Multiline, :pop!
      rule %r(\*), Comment::Multiline
    end

    state :double_quote do
      rule %r(\\.)m, Str::Double
      rule %r([^"\\]+), Str::Double
      rule %r("), Str::Double, :pop!
    end

    state :single_quote do
      rule %r(\\.)m, Str::Single
      rule %r([^'\\]+), Str::Single
      rule %r('), Str::Single, :pop!
    end

    state :backtick do
      rule %r(\\.)m, Name
      rule %r([^`\\]+), Name
      rule %r(`), Name, :pop!
    end

    state :forwardtick do
      rule %r(\\.)m, Name
      rule %r([^´\\]+), Name
      rule %r(´), Name, :pop!
    end

    state :identifier do
      rule %r((?:$?|_+)[a-zA-Z]+[_a-zA-Z0-9]*), Name
      rule %r(`) do
        token Name
        push :backtick
      end
      rule %r(´) do
        token Name
        push :forwardtick
      end
    end

    state :root do
      mixin :commentsandwhitespace
      rule %r(0[bB][01]+), Num::Bin
      rule %r(0[xX][0-9a-fA-F]+), Num::Hex
      rule %r((?:(?:0|[1-9][0-9]*)(?:\.[0-9]+)?|\.[0-9]+)(?:[eE][\-\+]?[0-9]+)?), Num::Float
      rule %r(0|[1-9][0-9]*), Num::Integer
      rule Regexp.new('@' + aqlBindVariablePattern), Name::Variable::Global
      rule Regexp.new(aqlBindVariablePattern), Name::Variable
      rule %r(=~|!~|[=!<>]=?|[%?:/*+-]|\.\.|&&|\|\|), Operator
      rule %r([.,(){}\[\]]), Punctuation
      rule %r([a-zA-Z0-9][a-zA-Z0-9_]*(?:::[a-zA-Z0-9_]+)+(?=\s*\()), Name::Function
      rule %r((WITH)(\s+)(COUNT)(\s+)(INTO)\b) do
        groups Keyword::Reserved, Text, Keyword::Pseudo, Text, Keyword::Reserved
      end
      rule %r((?:KEEP|PRUNE|SEARCH|TO)\b), Keyword::Pseudo
      rule %r(OPTIONS\s*\{)i, Keyword::Pseudo
      rule %r((?:AGGREGATE|ALL|AND|ANY|ASC|COLLECT|DESC|DISTINCT|FILTER|FOR|GRAPH|IN|INBOUND|INSERT|INTO|K_PATHS|K_SHORTEST_PATHS|LIKE|LIMIT|NONE|NOT|OR|OUTBOUND|REMOVE|REPLACE|RETURN|SHORTEST_PATH|SORT|UPDATE|UPSERT|WITH|WINDOW)\b)i, Keyword::Reserved
      rule %r(LET\b), Keyword::Declaration
      rule %r((?:true|false|null)\b)i, Keyword::Constant
      rule %r((?:CURRENT|NEW|OLD)\b), Name::Builtin::Pseudo
      rule Regexp.new(aqlBuiltinFunctionsPattern, 'i'), Name::Function
      rule %r(") do
        token Str::Double
        push :double_quote
      end
      rule %r(') do
        token Str::Single
        push :single_quote
      end
      mixin :identifier
    end
  end
end
