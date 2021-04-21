---
layout: default
description: Search for strings with placeholders that stand for one or many arbitrary characters
title: Wildcard Search ArangoSearch Examples
---
# Wildcard Search with ArangoSearch

{{ page.description }}
{:class="lead"}

You can use this search technique to find strings that start with, contain or
end with a certain substring, but it can do more than that. You can place the
special characters `_` and `%` as wildcards for single or zero-or-more
characters in the search string to match multiple partial strings.

- `_`: A single arbitrary character
- `%`: Zero, one or many arbitrary characters
- `\\_`: A literal underscore
- `\\%`: A literal percent sign

{% hint 'info' %}
Literal backlashes require different amounts of escaping depending on the
context:
- `\` in bind variables (_Table_ view mode) in the Web UI (automatically
  escaped to `\\` unless the value is wrapped in double quotes and already
  escaped properly)
- `\\` in bind variables (_JSON_ view mode) and queries in the Web UI
- `\\` in bind variables in arangosh
- `\\\\` in queries in arangosh
- Double the amount compared to arangosh in shells that use backslashes for
escaping (`\\\\` in bind variables and `\\\\\\\\` in queries)
{% endhint %}

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dateset)

**View definition:**

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "title": {
          "analyzers": [
            "identity"
          ]
        }
      }
    }
  }
}
```

**AQL queries:**

Match all titles that starts with `The Matr` using `LIKE()`,
where `_` stands for a single wildcard character and `%` for an arbitrary amount:

```js
FOR doc IN imdb
  SEARCH ANALYZER(LIKE(doc.title, "The Matr%"), "identity")
  RETURN doc.title
```

You can achieve the same with the `STARTS_WITH()` function:
<!-- TODO: Is STARTS_WITH() faster? -->

```js
FOR doc IN imdb
  SEARCH ANALYZER(STARTS_WITH(doc.title, "The Matr"), "identity")
  RETURN doc.title
```

Match all titles that contain `Mat` using `LIKE()`:

```js
FOR doc IN imdb
  SEARCH ANALYZER(LIKE(doc.title, "%Mat%"), "identity")
  RETURN doc.title
```

Match all titles that end with `rix` using `LIKE()`:

```js
FOR doc IN imdb
  SEARCH ANALYZER(LIKE(doc.title, "%rix"), "identity")
  RETURN doc.title
```

Match all titles that have an `H` as first letter, followed by two arbitrary
characters, followed by `ry` and any amount of characters after that. It will
match titles starting with `Harry` and `Henry`:

```js
FOR doc IN imdb
  SEARCH ANALYZER(LIKE(doc.title, "H__ry%"), "identity")
  RETURN doc.title
```
