require 'json'

class NavigationBlock < Liquid::Block
    def initialize(tag_name, input, tokens)
        super
    end

    def renderTree(root, stack)
        if root.length == 0
            return ""
        end
        indent = "    " * stack.length

        classNames = ""
        if stack.length == 0
            classNames += "summary"
        else
            classNames += "articles"
        end
        output = indent + "<ul class=\"" + classNames + "\">\n"
        level = "1"
        stack.each { |prev_level|
            level += "." + prev_level.to_s
        }
        root.each.with_index { |element, index |
            localIndent = indent + "  "
            output += localIndent + "<li class=\"chapter\" data-level=\"" + level + "." + (index + 1).to_s + "\">\n"
            if element['href']
                output += localIndent + "<a href=\"" + element['href'] + "\">" + element["text"] + "</a>\n"
            end
            if element['subtitle']
                output += localIndent + "<li class=\"header\">" + element['subtitle'] + "</li>\n"
            end
            if element['children']
                output += renderTree(element['children'], stack + [index])
            end
            if element['divider']
                output += localIndent + "<hr/>\n"
            end

            output += localIndent + "</li>\n"
        }
        output += indent + "</ul>\n"
        return output
    end

    def render(context)
        rootChildren = super.strip!
        parsed = JSON.parse(rootChildren)

        return renderTree(parsed, [])
        # Write the output HTML string
        #   output =  "<div style=\"margin: 0 auto; padding: .8em 0;\"><script async "
        #   output += "src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\">"
        #   output += "</script><ins class=\"adsbygoogle\" style=\"display:block\" data-ad-client=\"xxxxx\""
        #   output += "data-ad-slot=\"yyyyyy\" data-ad-format=\"auto\"></ins><script>(adsbygoogle ="
        #   output += "window.adsbygoogle || []).push({});</script></div>"

        #   # Render it on the page by returning it
        #   return output;
    end
end
Liquid::Template.register_tag('navigation', NavigationBlock)