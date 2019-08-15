# ArangoDB Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/1df8b69b-25f8-4b73-b8f1-af8735269c35/deploy-status)](https://app.netlify.com/sites/zealous-morse-14392b/deploys)

This is the ArangoDB documentation repository containing all documentation
for all versions.

The documentation uses the static site generator [Jekyll](https://jekyllrb.com).

## Working with the documentation

To work locally on the documentation you can:
- [install Jekyll](https://jekyllrb.com/docs/installation/) and dependencies
- or use the Docker container
  [arangodb/arangodb-docs](https://hub.docker.com/r/arangodb/arangodb-docs)

Note that the Algolia plugin has a dependency which does not support Ruby 2.6+.

A full build (all versions) will take quite a while. You can use Jekyll's
watch mode to let it continuously rebuild the pages you change after an initial
build. For simple documentation changes this process normally works perfect.

However there are cases where Jekyll won't detect changes. This is especially
true when changing plugins and configuration (including the navigation YAML
when adding a new page). To be sure you have an up-to-date version remove the
`_site` directory and then abort and restart the watch mode.

### Performance

To speed up the build process you may disable certain versions from being built
by changing the `_config.yml`:

```yml
exclude:
  #- 3.5/
  #- 3.4/
  - 3.3/
  - 3.2/
  - 3.1/
  - 3.0/
  - 2.8/
```

Above example disables versions 2.8 through 3.3, so that 3.4 and 3.5 will be
built only. Do not commit these changes of the configuration!

## Building the documentation

### Jekyll

If you want to build the docs the first time, run `bundle install` to ensure
that all gems / plugins are installed.

For local development, start Jekyll in watch mode:

`bundle exec jekyll serve`

To let Jekyll build the static site without serving it or watching for file
changes use:

`bundle exec jekyll build`

### Docker container

In the docs directory execute:

`[docs]$ docker run --rm -v $(pwd):/docs -p 4000:4000 arangodb/arangodb-docs`

This will watch file changes within the documentation repo and you will be able
to see the resulting static site on http://127.0.0.1:4000/docs/.

To build the documentation without watch mode or serving the resulting site
you can execute:

`[docs]$ docker run --rm -v $(pwd):/docs arangodb/arangodb-docs bundler exec jekyll build`

After that the HTML files in `_site` are ready to be served by a webserver.

Please note that you still need to put them into a `/docs` subdirectory.

Example:

```
mkdir -p /tmp/arangodocs
cp -a _site /tmp/arangodocs/docs
cd /tmp/arangodocs
python -m http.server
```

## Documentation structure

In the root directory the directories `3.4`, `3.5` etc. represent the
individual versions and their full documentation. The content used to be
in version branches in the main repository.

The core book (Manual) of the version will be in the root e.g. `3.4/*.md`.
The sub-books (AQL, Cookbook etc.) will have their own directory in there.

The organization of documents is **flat**, namely there are no subdirectories per book
(as opposed to the old documentation system).

The other directories are:

- `_data`: data files which are used by plugins and layouts,
  including the navigation definitions
- `_includes`: templates for custom tags and layout partials
- `_layouts`: layout definitions that can be used in YAML frontmatter like
  `layout: default`
- `_plugins`: Jekyll extensions for the navigation, version switcher,
  custom tags / blocks etc.
- `_site`: default output directory (not committed)
- `assets`: files not directly related to the documentation content
  that also need to be served (e.g. the ArangoDB logo)
- `js`: JavaScript files used by the site
- `scripts`: Scripts which were used in the migration process from Gitbook
  to Jekyll (not really needed anymore)
- `styles`: CSS files for the site, including a lot of legacy from Gitbook

### Navigation

Each book has a navigation tree represented as a nested data structure in YAML.
This is being read by the NavigationTag plugin to create the navigation on the
left-hand side.

The YAML file for a book can be found here: `_data/<version>-<book>.yml`.
For example, the 3.4 AQL navigation is defined by `_data/3.4-aql.yml`.

### Adding a page

Start off by adding the page to the navigation. Assume we want to add a new
AQL keyword to the list of operations, above the FOR language construct and
the page we want to add will be `aql/operations-create.md`:

```diff
 - text: High level Operations
   href: operations.html
   children:
+    - text: CREATE
+      href: operations-create.html
     - text: FOR
       href: operations-for.html
```

Then create the Markdown document and add the following frontmatter section:

```
---
layout: default
description: A meaningful description of the page
---
```

Add the actual content below the frontmatter.

### When adding a new release

- Copy over the navs in `_data`, e.g.
  ```
  for book in aql cookbook drivers http manual; do
    cp -a "3.5-${book}.yml" "3.6-${book}.yml"
  done
  ```
- Create relative symlinks to program option JSON files in `_data`, like
  ```
  for prog in bench d dump export import inspect restore sh; do
    ln -s "../3.6/generated/arango${prog}-options.json" "3.6-program-options-arango${prog}.json"
  done
  ```
- Copy the latest devel version to a new directory i.e. `cp -a 3.5 3.6`
- Add the version to `_data/versions.yml` with the full version name
- Add all books of that version to `_data/books.yml`
- Adjust the following fields in `_config.yml` as needed:
  - `versions`
  - `algolia.files_to_exclude`
  - `exclude`
- Update `_redirects`
- Re-generate the examples, or rather add nightly build job for the new version
  to Jenkins

### Adding a new arangosh example

This process is currently more or less unchanged. However to fit it into the
Jekyll template it had to be encapsulated in a Jekyll tag.

```
{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline working_with_date_time
    @EXAMPLE_ARANGOSH_OUTPUT{working_with_date_time}
    db._create("exampleTime");
    var timestamps = ["2014-05-07T14:19:09.522","2014-05-07T21:19:09.522","2014-05-08T04:19:09.522","2014-05-08T11:19:09.522","2014-05-08T18:19:09.522"];
    for (i = 0; i < 5; i++) db.exampleTime.save({value:i, ts: timestamps[i]})
    db._query("FOR d IN exampleTime FILTER d.ts > '2014-05-07T14:19:09.522' and d.ts < '2014-05-08T18:19:09.522' RETURN d").toArray()
    ~addIgnoreCollection("example")
    ~db._drop("exampleTime")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock working_with_date_time
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
```

### Adding a new AQL example

This process is currently more or less unchanged. However to fit it into the
Jekyll template it had to be encapsulated in a Jekyll tag.

```
{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}

    @startDocuBlockInline joinTuples
    @EXAMPLE_AQL{joinTuples}
    @DATASET{joinSampleDataset}
    FOR u IN users
      FILTER u.active == true
      LIMIT 0, 4
      FOR f IN relations
        FILTER f.type == @friend && f.friendOf == u.userId
        RETURN {
          "user" : u.name,
          "friendId" : f.thisUser
        }
    @BV {
    friend: "friend"
    }
    @END_EXAMPLE_AQL
    @endDocuBlock joinTuples
{% endaqlexample %}
{% include aqlexample.html id=examplevar query=query bind=bind result=result %}
```

## Troubleshooting

- > Liquid Exception: No title found for /x.x/xxx.html. Maybe you forgot to
  > link it to the navigation? in /_layouts/default.html
  
  Jekyll points you to the wrong file. `_layouts/default.html` should be fine.
  Jekyll has no native support for navigation menus. `_plugins/NavigationTag.rb`
  is a custom plugin to generate the left-hand side navigation from
  `_data/<version>-<book>.yml`. You probably forgot to add your new page there.

## CI/Netlify

For the CI process we are currently using Netlify. This service has been built
so that you can quickly test and deploy static sites. We are only using it to
have a live preview and a CI pipeline.

There are a few files in the repo required for Netlify:

- `_redirects`

   Defines redirects for Netlify. There is only one redirect going from / to
   the docs so that the site preview doesn't start with a 404 (we are
   generating pages into /docs/). As Netlify doesn't understand symlinks we
   are linking absolutely to a version.

- `netlify.toml`

  Defines the build pipeline. Not much going on there.

- `netlify.sh`

  Special script for Netlify build. Because we cannot just use a
  Docker container we have to download htmltest every time.

For details please check out the
[Netlify documentation](https://www.netlify.com/docs/).

## LICENSE

The ArangoDB Docs are licensed under Apache2. See [LICENSE.md](LICENSE.md)
for details.

Parts not licensed under Apache2 are outlines in
[LICENSES-OTHER-COMPONENTS.md](LICENSES-OTHER-COMPONENTS.md)
