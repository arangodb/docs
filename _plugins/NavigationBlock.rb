require 'json'

class NavigationBlock < Liquid::Block
    def initialize(tag_name, input, tokens)
        super
        @prefix = input.strip
    end

    def renderTree(context, root, stack)
        if root.length == 0
            return ""
        end
        indent = "    " * stack.length

        found = false
        output = ""
        root.each.with_index { |element, index |
            localIndent = indent + "  "
            if element['subtitle']
                output += localIndent + "<li class=\"header\">" + element['subtitle'] + "</li>\n"
            elsif element['divider']
                output += localIndent + "<li><hr/></li>\n"
            else
                children = ""
                classNames = "chapter"
                if element["href"]
                    children += localIndent + "<a href=\"" + element['href'] + "\">" + element["text"] + "</a>\n"
                    if context.environments.first["page"]["url"] == @prefix + "/" + element["href"]
                        found = true
                        classNames += " selected active"
                    end
                end
                if element["children"]
                    localChildren, localFound = renderTree(context, element['children'], stack + [index])
                    children += localChildren
                    if localFound
                        found = true
                        classNames += " selected"
                    end
                end
                
                output += localIndent + "<li class=\"" + classNames + "\">\n"
                output += children
                output += localIndent + "</li>\n"
            end
        }
        classNames = ""
        if stack.length == 0
            classNames += "summary"
        else
            classNames += "articles"
        end
        output = indent + "<ul class=\"" + classNames + "\">\n" + output
        output += indent + "</ul>\n"
        return output, found
    end

    def render(context)
        rootChildren = super.strip!
        parsed = JSON.parse(rootChildren)

        output, found = renderTree(context, parsed, [])
        return output
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