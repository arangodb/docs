# ArangoDB Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/1df8b69b-25f8-4b73-b8f1-af8735269c35/deploy-status)](https://app.netlify.com/sites/zealous-morse-14392b/deploys)

This is the ArangoDB documentation repository containing all documentation for all versions.

The documentation uses the static site generator `jekyll`.

## Working with the documentation

To work locally on the documentation you can also use the provided container:

`[docs]$ docker run -d -v $(pwd):/docs -p 4000:4000 --name arangodb-jekyll arangodb/arangodb-docs`

This will watch file changes within the documentation repo and you will be able to see the
resulting HTML files on http://127.0.0.1:4000/docs/.

Please note that after starting the first build will take quite a while. Follow its process by opening a terminal
and entering:

`docker logs -f arangodb-jekyll`

For simple documentation changes this process normally works perfect.

However there are cases where jekyll won't detect changes. This is especially true
when changing plugins and configuration (including the navigation JSON when adding a new page).

To be sure you have an up-to-date version remove the `_site` directory and then
restart the docker container:

`docker restart arangodb-jekyll`

## Building the documentation

To build the documentation you can use the included docker container:

`[docs]$ docker run --rm -v $(pwd):/docs arangodb/arangodb-docs bundler exec jekyll build`

After that the html files in `_site` are ready to be served by a webserver.

Please note that you still need to put them into a `/docs` subdirectory.

Example:

```
mkdir -p /tmp/arangodocs
cp -a _site /tmp/arangodocs/docs
cd /tmp/arangodocs
python -m http.server
```

## Documentation structure

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

### Adding a new arangosh example

This process is currently more or less unchanged. However to fit it into the jekyll template
it had to be encapsulated in a jekyll tag.

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

This process is currently more or less unchanged. However to fit it into the jekyll template
it had to be encapsulated in a jekyll tag.

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

## Performance

The default setup will always create the full documentation.
An easy way to improve performance is to just add versions you don't need to the `exclude`
setting in the jekyll `_config.yml`.

## LICENSE

The ArangoDB Docs are licensed under Apache2. See LICENSE.md for details

Parts not licensed under Apache2 are outlines in LICENSES-OTHER-COMPONENTS.md
