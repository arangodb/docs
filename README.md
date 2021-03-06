# ArangoDB Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/1df8b69b-25f8-4b73-b8f1-af8735269c35/deploy-status)](https://app.netlify.com/sites/zealous-morse-14392b/deploys)

This is the ArangoDB documentation repository containing all documentation
for all versions as published on [arangodb.com/docs](https://www.arangodb.com/docs).

The documentation uses the static site generator [Jekyll](https://jekyllrb.com).

View the latest successful [preview build](https://main--zealous-morse-14392b.netlify.app/)
of the `main` branch.

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

```yaml
exclude:
# - 3.9/
# - 3.8/
  - 3.7/
  - 3.6/
  - 3.5/
  - 3.4/
  - 3.3/
```

Above example disables versions 3.3 through 3.7, so that 3.8 and 3.9 will be
built only. Do not commit these changes of the configuration!

Note that building may fail if you disable required versions as defined by:

```yaml
versions:
  stable: "3.8"
  devel: "3.9"
```

## Building the documentation

### Jekyll

If you want to build the docs the first time, run `bundle install` to ensure
that all gems / plugins are installed.

For local development, start Jekyll in watch mode:

`bundle exec jekyll serve`

To let Jekyll build the static site without serving it or watching for file
changes use:

`bundle exec jekyll build`

To serve the content from a previous build without watching for changes use:

`bundle exec jekyll serve --skip-initial-build --no-watch`

You can then browse the docs in a browser at http://127.0.0.1:4000/docs/.
Note that it has to be `/docs/`. Both `/` and `/docs` do not work
(_404 Page not found_) because of the configured baseurl.

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

```bash
mkdir -p /tmp/arangodocs
cp -a _site /tmp/arangodocs/docs
cd /tmp/arangodocs
python -m http.server
```

## Documentation structure

In the root directory, the directories `3.8`, `3.9` etc. represent the
individual ArangoDB versions and their full documentation. The content used
to be in version branches in the `arangodb/arangodb` repository, but now all
documentation versions live in the `main` branch of this repository. This has
the advantage that all versions can be built at once, but the drawback of Git
cherry-picking not being available and therefore requiring to manually apply
changes to different versions as necessary.

The documentation is split into different parts, called "books" for historical
reasons. The core book (Manual) of a version does not have an own folder for its
content, but the files are found in the version directory, e.g. `3.8/*.md`.
Other books (AQL, HTTP) have subfolders in the version folder, e.g. `3.8/aql/`.
There are also books (Drivers, Oasis) that are not directly couple to ArangoDB
versions, that have their files in an own folders in the root directory, e.g.
`oasis/*.md`. These folders are symlinked in multiple version folders. Some
files, like release notes, are also symlinked to reduce maintenance costs.

The organization of documents is **flat**, namely there are no subdirectories
per book (as opposed to the previous documentation system).

Other directories:

| Name        | Description
|:------------|:-----------
| `_data`     | data files which are used by plugins and layouts, including the navigation definitions
| `_includes` | templates for custom tags and layout partials
| `_layouts`  | layout definitions that can be used in YAML frontmatter like `layout: default`
| `_plugins`  | Jekyll extensions for the navigation, version switcher, custom tags / blocks etc.
| `_site`     | default output directory (not committed)
| `assets`    | files not directly related to the documentation content that also need to be served (e.g. the ArangoDB logo)
| `js`        | JavaScript files used by the site
| `scripts`   | Scripts which were used in the migration process from Gitbook to Jekyll (not really needed anymore)
| `styles`    | CSS files for the site, including a lot of legacy from Gitbook

### Adding links

The official way to cross-reference other pages within the documentation would be
to use Jekyll's `link` tag (`{% link path/to/file.md %}`). This mechanism is not
used, however. We use plain Markdown links, but this has the drawback of having
to change the file extension from `.md` to `.html` so that it will work once the
documentation is built.

```markdown
This is an [internal link](aql/functions-numeric.html#max).
```

Note that internal links should be relative, i.e. not include a version number,
unless it is supposed to point to a different version of the documentation on
purpose. To point from one book to another, you may need to use `..` to refer
to the parent folder of a file. You can also link to headlines within a page
like `[label](#anchor-id)`.

For external links, please add `{:target="_blank"}` so that they open in a new
tab when clicked:

```markdown
This is an [external link](https://www.arangodb.com/){:target="_blank"}
```

### Navigation

Each book has a navigation tree represented as a nested data structure in YAML.
This is being read by the NavigationTag plugin to create the navigation on the
left-hand side.

The YAML file for a book can be found here: `_data/<version>-<book>.yml`.
For example, the 3.8 AQL navigation is defined by `_data/3.8-aql.yml`.

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
title: Short title
---
```

Add the actual content below the frontmatter.

### Renaming a page

The URL of a page is derived from the file name. If you rename a file, e.g.
from `old-name.md` to `new-name.md`, make sure to add a redirect for the
old URL by adding the following to the frontmatter:

```diff
 ---
 layout: default
 description: ...
 title: ...
 ---
+redirect_from:
+  - old-name.html # 3.8 -> 3.9
```

The URL should be relative and the comment (`#`) indicate the versions it was
renamed in (can also be the same version twice, e.g. `# 3.8 -> 3.8`).

### When adding a new release

- Run below commands in Bash under Linux. Do not use Git Bash on Windows,
  it dereferences symlinks (copies the referenced files)!
- Copy the latest devel version to a new directory i.e. `cp -a 3.9 4.0`
- Create the necessary navigation definition files in `_data` by copying, e.g.
  ```
  cd _data
  for book in aql drivers http manual oasis; do
    cp -a "3.9-${book}.yml" "4.0-${book}.yml"
  done
  cd ..
  ```
- Create relative symlinks to program option JSON files and the metrics YAML
  file in `_data`, like
  ```
  cd _data
  for prog in backup bench d dump export import inspect restore sh vpack; do
    ln -s "../4.0/generated/arango${prog}-options.json" "4.0-program-options-arango${prog}.json"
  done
  ln -s "../4.0/generated/allMetrics.yaml" "4.0-allMetrics.yaml"
  cd ..
  ```
- Adjust the version numbers in `redirect_from` URLs in the frontmatter
  to match the new version folder, e.g.
  ```diff
   redirect_from:
  -  - /3.9/path/to/file.html # 3.4 -> 3.5
  +  - /4.0/path/to/file.html # 3.4 -> 3.5
  ```
  This is only necessary for absolute redirects. Relative redirects are
  preferred, e.g. `- old.html` in `new.html` (may also include `..`).
  If pages were removed, then you may want to use absolute redirects to point
  to older versions or redirect to completely different pages.
- Create release note pages for the new version (here: `4.0` / `40`)
  and add them to the navigation (`4.0-manual.yml`):
  ```diff
   - text: Release Notes
     href: release-notes.html
     children:
  +    - text: Version 4.0
  +      href: release-notes-40.html
  +      children:
  +        - text: What's New in 4.0
  +          href: release-notes-new-features40.html
  +        - text: Known Issues in 4.0
  +          href: release-notes-known-issues40.html
  +        - text: Incompatible changes in 4.0
  +          href: release-notes-upgrading-changes40.html
  +        - text: API changes in 4.0
  +          href: release-notes-api-changes40.html
  ```
- Add the relevant links to the release notes overview page
  `4.0/release-notes.html`
- Delete the release note pages of the previous version (here: `3.9`) in the
  folder of the new version (here: `4.0`) and symlink the files instead:
  ```
  cd 4.0
  rm release-notes-39.md
  rm release-notes-new-features39.md
  rm release-notes-known-issues39.md
  rm release-notes-upgrading-changes39.md
  rm release-notes-api-changes39.md
  ln -s ../3.9/release-notes-39.md release-notes-39.md
  ln -s ../3.9/release-notes-new-features39.md release-notes-new-features39.md
  ln -s ../3.9/release-notes-known-issues39.md release-notes-known-issues39.md
  ln -s ../3.9/release-notes-upgrading-changes39.md release-notes-upgrading-changes39.md
  ln -s ../3.9/release-notes-api-changes39.md release-notes-api-changes39.md
  cd ..
  ```
- Check if any links to version-specific pages such as the release notes need
  to be updated, e.g.
  ```diff
  -See [Known Issues](release-notes-known-issues39.html).
  +See [Known Issues](release-notes-known-issues40.html).
  ```
- Add a section _Version 4.0_ to `4.0/highlights.html` including a link to
  _What's New in 4.0_
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
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}
```

## Guidelines

- Use American English.
- Wrap text at 80 characters. This helps tremendously in version control.
- Put Markdown links on a single line `[link label](target.html#hash)`,
  even if it violates the guideline of 80 characters per line.
- Append `{:target="_blank"}` to Markdown links which point to external sites.

## Troubleshooting

- ```
  Liquid Exception: No title found for /x.x/xxx.html.
  Maybe you forgot to link it to the navigation? in /_layouts/default.html
  ```
  
  Jekyll points you to the wrong file. `_layouts/default.html` should be fine.
  Jekyll has no native support for navigation menus. `_plugins/NavigationTag.rb`
  is a custom plugin to generate the left-hand side navigation from
  `_data/<version>-<book>.yml`. You probably forgot to add your new page there.

- ```
  docs/page.html
    target does not exist --- docs/page.html --> target.md
  ```
  
  If you see this error and the target ends with an `.md` extension then change
  it to `.html`. The resulting page has to be referenced, not the source file!

- ```
  docs/page1.html
    target does not exist --- docs/page1.html --> target.html
  docs/page2.html
    target does not exist --- docs/page2.html --> target.html
  ...
  ```
  or
  ```
  docs/page.html
    target is a directory, no index --- docs/page.html --> /docs/newfolder/
  ```

  If you get dozens of these errors for the same target, then you likely forgot
  to add a frontmatter to that page (`docs/target.md`):
  
  ```yaml
  ---
  layout: default
  description: ...
  ---
  ```

  The error is issued once per page of the same book because the target page is
  linked in the navigation.

  Another reason can be a faulty reference in the navigation file (e.g.
  `_data/3.5-manual.yml`). The file name or directory might simply be wrong,
  or the file extension could be wrong or incomplete in the `href` attribute:

  ```
  - text: Missing L in .html
    href: page.htm
  ```

- ```
  docs/page.html
    hash does not exist --- docs/page.html --> target.html#hash
  ```
  ```
  docs/page.html
    target does not exist --- docs/page.html --> target.html
  ```
  
  Check if the target file exists and if the anchor is correct (if applicable).
  Look at the generated `.html` file if in doubt. A `redirect_from` frontmatter
  might be bad (e.g. wrong version number in path) and accidentally overwrite
  a page, removing the original content and links.

- ```
  Configuration file: none
              Source: /path/to/docs/3.5
         Destination: /path/to/docs/3.5/_site
   Incremental build: disabled. Enable with --incremental
        Generating...
       Build Warning: Layout 'default' requested in subfolder/page.md does not exist.
       Build Warning: Layout 'default' requested in other.md does not exist.
    Liquid Exception: Liquid syntax error (line 11): Unknown tag 'docublock' in
  ```

  Warnings and exceptions like above show if you try to run Jekyll from a
  subfolder. Change your working directory to the root folder of the working
  copy (`/path/to/docs`).

- ```
  Liquid Exception: undefined method `captures' for nil:NilClass
  ```

  This error can be raised by the `navvar` method in `_plugins/ExtraFilters.rb`
  (run Jekyll with `--trace` to verify). Check that the working copy is clean.
  Stray folders with untracked Markdown files may cause this problem, e.g. the
  output of `oasisctl generate-docs`. Either remove the files or add the folder
  to the list of excludes in `_config.yml`.

- ```
  Please append `--trace` to the `build` command
  for any additional information or backtrace.
  ```
  
  This is a generic error message which requires the inspection of the
  stack trace to figure out the root cause of the problem.
  
  - ```
    …lib/jekyll/utils.rb:141:in `initialize': No such file or directory @ rb_sysopen - /path/to/file
    ```
    
    Jekyll can't open the specified file. A possible reason is that it is a
    binary file which is not supposed to be in the source tree in the first
    place or which should be excluded via `_config.yml`
    
  - ```
    …lib/safe_yaml/load.rb:143:in `parse': (/path/to/docs/_data/3.x-manual.yml):
    mapping values are not allowed in this context at line 274 column 15 (Psych::SyntaxError)
    ```
    
    The specified navigation definition file is not valid YAML. Check if the
    indention is correct and that you use `children:` if the following entries
    are child pages.

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

The ArangoDB documentation is licensed under Apache-2.0.
See [LICENSE](LICENSE) for details.

Parts not licensed under Apache-2.0 are outlined in
[LICENSES-OTHER-COMPONENTS.md](LICENSES-OTHER-COMPONENTS.md)
