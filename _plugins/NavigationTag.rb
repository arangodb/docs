require 'json'

class NavigationTag < Liquid::Tag
    def initialize(tag_name, input, tokens)
        @variable_name_expr = Liquid::Expression.parse(input.strip!)
        super
    end

    def renderTree(context, root, stack)
        if !root
            return "", false
        end
        if root.length == 0
            return "", false
        end
        indent = "    " * stack.length

        found = false
        output = ""
        root.each.with_index { |element, index |
            localIndent = indent + "  "
            if element['subtitle']
                output += localIndent + "<li class=\"header\">" + element['subtitle'] + "</li>\n"
            elsif element['divider']
                output += localIndent + "<li><hr></li>\n"
            else
                children = ""
                classNames = "chapter"
                if element["href"]
                    if element["href"].start_with?("http://", "https://")
                        children += localIndent + "<a href=\"" + element['href'] + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + element["text"] + " <i class=\"fa fa-external-link\"></i></a>\n"
                    else
                        children += localIndent + "<a href=\"" + element['href'] + "\">" + element["text"] + "</a>\n"
                        fileurl = context.environments.first["page"]["url"]
                        if fileurl.end_with?("/")
                            fileurl += "index.html"
                        end
                        if fileurl == context.environments.first["page"]["dir"] + element["href"]
                            found = true
                            classNames += " selected active"
                        end
                    end
                end
                if element["children"]
                    localChildren, localFound = renderTree(context, element['children'], stack + [index])
                    children += localChildren
                    if localFound
                        found = true
                        classNames += " selected"
                    end
                    if element["expand"]
                        classNames += " expanded"
                        if not localFound
                            classNames += " selected"
                        end
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
        var = context.evaluate(@variable_name_expr)
        parsed = context["site"]["data"][var]

        output, found = renderTree(context, parsed, [])
        return output
    end
end
Liquid::Template.register_tag('navigation', NavigationTag)