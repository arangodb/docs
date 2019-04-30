# ArangoDB Documentation

This is the ArangoDB documentation repository containing all documentation for all versions.

## Building the documentation

The documentation uses the static site generator `jekyll`.

To build the documentation you can use the included docker container:

`[docs]$ docker run --rm -v $(pwd):/docs arangodb-docs bundler exec jekyll build`

Alternatively you can install jekyll locally on your computer. See https://jekyllrb.com/docs/installation/

## Working with the documentation

Without specifying anything when running the docker container it will serve the documentation.

To work locally on the documentation you can also use the container:

`[docs]$ docker run -d -v $(pwd):/docs -p 4000:4000 --name arangodb-jekyll arangodb-docs`

This will watch file changes within the documentation repo and you will be able to see the
resulting HTML files on http://127.0.0.1:4000/docs

For simple documentation changes this process normally works perfect.

However there are cases where jekyll won't detect changes. This is especially true
when changing plugins and configuration.

To be sure you have an up-to-date version remove the `_site` directory and then
restart the docker container:

`docker restart arangodb-jekyll`

### Documentation structure

In the root directory the directories represent the individual versions and their full documentation.

The core manual of the version will be in the root e.g. `3.4/*.md`. The submanuals (AQL, Cookbook etc.)
will have their own directory in there.

The organisation of documents is **flat**, namely there are no subdirectories per manual
(as opposed to the old manual).

### Navigation

Each manual has a nav tree represented as a tree in JSON. This is being read by the NavigationTag plugin to
create the navigation on the left hand side.

The JSON file for a manual can be found here: `_data/<version>-<manual>.json`.
So the 3.4 aql navigation will be `_data/3.4-aql.json`

### Adding a page

Start off by adding the page to the Navigation.

Then create a markdown document and add the following frontmatter section:

```
---
layout: default
---
```

Then go ahead and edit you markdown.

### When adding a new release

- Copy over the navs in `_data` and copy the latest devel version to a new directory i.e. `cp -a 3.5 3.6`.
- Add the version to `_data/versions.yml` with the full version name.
- Add all books of that version to `_data/books.yml`
- Adjust `_config.yml` and modify `versions` if appropriate
- Adjust `_includes/topnav.html` to add the version (and make it read versions instead so that this bulletpoint can go away ;) )

## Performance

The default setup will always create the full documentation.
An easy way to improve performance is to just add versions you don't need to the `exclude`
setting in the jekyll `_config.yml`.