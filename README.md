# ArangoDB Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/1df8b69b-25f8-4b73-b8f1-af8735269c35/deploy-status)](https://app.netlify.com/sites/zealous-morse-14392b/deploys)

This is the ArangoDB documentation repository containing all documentation
for all versions as published on [arangodb.com/docs/](https://www.arangodb.com/docs/).

The documentation uses the static site generator [Jekyll](https://jekyllrb.com).

View the latest successful [preview build](https://main--zealous-morse-14392b.netlify.app/)
of the `main` branch.

## Contributing

To suggest a concrete change to the documentation, you may
[edit files directly on GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files).
It will fork the repository automatically if necessary. Commit the changes to a
new branch, give it a succinct name, and open a pull request (PR).

To add more changes to a PR, click on the branch name below the headline
of the PR (the latter link of "&lt;User&gt; wants to merge &lt;n&gt; commits
into `main` from `branch-name`"). Then locate and edit the next file.
Commit the changes directly to your PR branch.

For general suggestions, feel free to
[create an issue](https://github.com/arangodb/docs/issues/new).

### Automatic Previews

In every pull request, there is a number of so-called checks (above the text
field for entering a comment). The **last entry** should be
`netlify/zealous-morse-14392b/deploy-preview` with a **Details** link. Whenever
you push a change to the PR branch, Netlify will build a preview. While it is
doing that or if it fails building the docs, then the _Details_ link will get
you to the build log. If it succeeded, then it gets you to the hosted preview
of that PR. If no checks show up at all, then Netlify is probably busy with
another build (or down). The checks should eventually appear, however.

### Contributor License Agreement

To accept external contributions, we need you to fill out and sign our
Contributor License Agreement (CLA). We use an Apache 2 CLA for ArangoDB,
which can be found here: <https://www.arangodb.com/documents/cla.pdf>
You can scan and email the CLA PDF file to <cla@arangodb.com> or send it via
fax to +49-221-2722999-88.

## Building the Documentation

The following section describes how you can build the documentation locally.
This is not strictly necessary when contributing. You can also rely on
[automatic previews](#automatic-previews).

### Symlink Support Required

Make sure that symlink support is enabled before you clone the repository with
Git. It is turned off by default in Git for Windows. Start a terminal as
administrator and run:

```
git config --system core.symlinks true
```

### Options for Building

To work locally on the documentation you can:
- [install Jekyll](https://jekyllrb.com/docs/installation/) and dependencies
- or use the Docker container
  [arangodb/arangodb-docs](https://hub.docker.com/r/arangodb/arangodb-docs)

Docker is generally easier, but may also be slower (at least under Windows).

Note that the Algolia plugin has a dependency which does not support Ruby 2.6+.

### Jekyll

If you want to build the docs the first time, run `bundle install` to ensure
that all dependencies (gems / plugins) are installed.

For local development, start Jekyll in watch mode:

`bundle exec jekyll serve`

This will build the documentation, rebuild it if you change files, and serve
the documentation site locally using Jekyll's built-in web server.

You can then browse the docs in a browser at <http://127.0.0.1:4000/docs/stable/>.
Note that it has to be `/docs/stable/` (or another version than `stable`).
Both paths `/` and `/docs` do not work (_404 Page not found_) because of the
configured `baseurl` in `_config.yml`, and `/docs/` redirects you to the online
version of the documentation.

To let Jekyll build the static site without serving it or watching for file
changes, use:

`bundle exec jekyll build`

The generated content will be stored in the `_site/` folder.

To serve the content from a previous build without watching for changes, use:

`bundle exec jekyll serve --skip-initial-build --no-watch`

### Docker Container

In the docs directory execute:

`docker run --rm -v $(pwd):/docs -p 4000:4000 arangodb/arangodb-docs`

This will watch file changes within the documentation repo and you will be able
to see the resulting static site on <http://127.0.0.1:4000/docs/stable/>.

To build the documentation without watch mode or serving the resulting site
you can execute:

`docker run --rm -v $(pwd):/docs arangodb/arangodb-docs bundler exec jekyll build`

After that the HTML files in `_site/` are ready to be served by a webserver.

Please note that you still need to put them into a `/docs` subdirectory if you
want to serve the documentation with another web server (only relevant for
hosting the documentation). Example:

```bash
mkdir -p /tmp/arangodocs
cp -a _site /tmp/arangodocs/docs
cd /tmp/arangodocs
python -m http.server
```

### Performance

A full build (all versions) will take quite a while. You can use Jekyll's
watch mode to let it continuously rebuild the pages you change after an initial
build. For simple documentation changes this process normally works perfect.

However there are cases where Jekyll won't detect changes. This is especially
true when changing plugins and configuration (including the navigation YAML
when adding a new page). To be sure you have an up-to-date version remove the
`_site` directory and then abort and restart the watch mode.

To speed up the build process you may disable certain versions from being built
by changing the `_config.yml`:

```yaml
exclude:
# - 3.9/
# - 3.8/
# - 3.7/
  - 3.6/
  - 3.5/
  - 3.4/
  - 3.3/
```

Above example disables versions 3.3 through 3.6, so that 3.7, 3.8, and 3.9 will be
built only. Do not commit these changes of the configuration!

Note that building may fail if you disable certain versions that contain the files
that other versions refer to with symlinks, or required versions as defined in
`_config.yml`:

```yaml
versions:
  stable: "3.8"
  devel: "3.9"
```

## Documentation Structure

### Versions

In the root directory, the directories `3.8`, `3.9` etc. represent the
individual ArangoDB versions and their documentation. We only maintain one
version of the documentation for every minor and major version (3.9, 4.0, etc.)
but not for every patch release (e.g. 3.8.2).

The content for different documentation versions used to be in version branches
(`2.7`, `devel`, etc.) in the `arangodb/arangodb` repository, but now all
documentation versions live in the `main` branch of this repository. This has
the advantage that all versions can be built at once, but the drawback of Git
cherry-picking not being available and therefore requiring to manually apply
changes to different versions as necessary (copy-pasting text or files).

### Books (Parts)

The documentation is split into different parts, called "books" for historical
reasons. The core book (Manual) of a version does not have an own folder for its
content, but the files are found in the version directory, e.g. `3.8/*.md`.
Other books (AQL, HTTP) have subfolders in the version folder, e.g. `3.8/aql/`.

There are also books (Drivers, Oasis) that are not directly couple to ArangoDB
versions, that have their files in an own folders in the root directory, e.g.
`oasis/*.md`. These folders are symlinked in multiple version folders. Some
files, like release notes, are also symlinked to reduce maintenance costs.

The organization of documents is **flat**, namely there are no subdirectories
per book (as opposed to the previous documentation system). For example, all
files of the AQL part are in the `aql/` folder. It does not have any subfolders
like `aql/examples/`. Instead, the file name reflects which files belong
together, e.g. `aql/examples-counting.md`.

### Special Folders

Content folders aside, there are the following other directories:

| Name        | Description
|:------------|:-----------
| `_data`     | data files which are used by plugins and layouts, including the navigation definitions
| `_includes` | templates for custom tags and layout partials
| `_layouts`  | layout definitions that can be used in YAML frontmatter like `layout: default`
| `_plugins`  | Jekyll extensions for the navigation, version switcher, custom tags / blocks etc.
| `_site`     | default output directory (not committed)
| `assets`    | files not directly related to the documentation content that also need to be served (e.g. the ArangoDB logo)
| `js`        | JavaScript files used by the documentation site
| `scripts`   | Scripts which were used in the migration process from Gitbook to Jekyll (not really needed anymore)
| `styles`    | CSS files for the site, including a lot of legacy from Gitbook

## Working with the Documentation Content

### Markup Overview

The documentation is written in the light-weight markup language
[Markdown](https://daringfireball.net/projects/markdown/). There are different
flavors of Markdown and it is further extended by
[Liquid](https://jekyllrb.com/docs/liquid/), Jekyll's templating language, as
well as our own customization.

Below is a list of the most commonly used markup, and an approximation of how
it gets rendered:

<table>
<thead>
<tr>
<th align="left">Element</th>
<th align="left">Markdown</th>
<th align="left">Preview</th>
<th align="left">HTML</th>
</tr>
</thead>
<tbody>
<tr>
<td>Text line</td>
<td><pre><code>A single line
of text</code></pre></td>
<td>A single line of text</td>
<td><code>A single line of text</code></td>
</tr>
<tr>
<td>Paragraph</td>
<td><pre><code>A single
paragraph.
<br>
Another paragraph.</code></pre></td>
<td><p>A single paragraph.</p><p>Another paragraph.</p></td>
<td><pre><code>&lt;p&gt;A single paragraph.&lt;/p&gt;
&lt;p&gt;Another paragraph.&lt;/p&gt;</code></pre></td>
</tr>
<tr>
<td>Heading 1</td>
<td><code># Level 1</code></td>
<td><h1>Level 1</h1></td>
<td><code>&lt;h1&gt;Level 1&lt;/h1&gt;</code></td>
</tr>
<tr>
<td>Heading 1 (Variant)</td>
<td><pre><code>Level 1
=======</code></pre></td>
<td><h1>Level 1</h1></td>
<td><code>&lt;h1&gt;Level 1&lt;/h1&gt;</code></td>
</tr>
<tr>
<td>Headling 2</td>
<td><code>## Level 2</code></td>
<td><h2>Level 2</h2></td>
<td><code>&lt;h2&gt;Level 2&lt;/h2&gt;</code></td>
</tr>
<tr>
<td>Headling 2 (Variant)</td>
<td><pre><code>Level 2
-------</code></pre></td>
<td><h2>Level 2</h2></td>
<td><code>&lt;h2&gt;Level 2&lt;/h2&gt;</code></td>
</tr>
<tr>
<td>Headling 3</td>
<td><code>### Level 3</code></td>
<td><h3>Level 3</h3></td>
<td><code>&lt;h3&gt;Level 3&lt;/h3&gt;</code></td>
</tr>
<tr>
<td>Headling 4</td>
<td><code>#### Level 4</code></td>
<td><h4>Level 4</h4></td>
<td><code>&lt;h4&gt;Level 4&lt;/h4&gt;</code></td>
</tr>
<tr>
<td>Headling 5</td>
<td><code>##### Level 5</code></td>
<td><h5>Level 5</h5></td>
<td><code>&lt;h5&gt;Level 5&lt;/h5&gt;</code></td>
</tr>
<tr>
<td>Headling 6</td>
<td><code>###### Level 6</code></td>
<td><h6>Level 6</h6></td>
<td><code>&lt;h6&gt;Level 6&lt;/h6&gt;</code></td>
</tr>
<tr>
<td>Italic</td>
<td><code>*italic*</code></td>
<td><em>italic</em></td>
<td><code>&lt;em&gt;italic&lt;/em&gt;</code></td>
</tr>
<tr>
<td>Italic</td>
<td><code>_italic_</code></td>
<td><em>italic</em></td>
<td><code>&lt;em&gt;italic&lt;/em&gt;</code></td>
</tr>
<tr>
<td>Bold</td>
<td><code>**bold**</code></td>
<td><strong>bold</strong></td>
<td><code>&lt;strong&gt;bold&lt;/strong&gt;</code></td>
</tr>
<tr>
<td>Bold</td>
<td><code>__bold__</code></td>
<td><strong>bold</strong></td>
<td><code>&lt;strong&gt;bold&lt;/strong&gt;</code></td>
</tr>
<tr>
<td>Bold &amp; Italic</td>
<td><code>***bold &amp; italic***</code></td>
<td><strong><em>bold &amp; italic</em></strong></td>
<td><code>&lt;strong&gt;&lt;em&gt;bold &amp; italic&lt;/em&gt;&lt;/strong&gt;</code></td>
</tr>
<tr>
<td>Bold &amp; Italic</td>
<td><code>___bold &amp; italic__</code></td>
<td><strong><em>bold &amp; italic</em></strong></td>
<td><code>&lt;strong&gt;&lt;em&gt;bold &amp; italic&lt;/em&gt;&lt;/strong&gt;</code></td>
</tr>
<tr>
<td>Superscript</td>
<td><code>2&lt;sup&gt;32&lt;/sup&gt;</code></td>
<td>2<sup>32</sup></td>
<td><code>2&lt;sup&gt;32&lt;/sup&gt;</code></td>
</tr>
<tr>
<td>Subscript</td>
<td><code>2&lt;sub&gt;32&lt;/sub&gt;</code></td>
<td>H<sub>2</sub>O</td>
<td><code>H&lt;sub&gt;2&lt;/sub&gt;O</code></td>
</tr>
<tr>
<td>Blockquote</td>
<td><code>&gt; quote</code></td>
<td><blockquote>quote</blockquote></td>
<td><code>&lt;blockquote&gt;quote&lt;/blockquote&gt;</code></td>
</tr>
<tr>
<td>Ordered List</td>
<td><pre><code>1. First
2. Second
3. Third</code></pre></td>
<td><ol><li>First</li><li>Second</li><li>Third</li></ol></td>
<td><pre><code>&lt;ol&gt;
  &lt;li&gt;First&lt;/li&gt;
  &lt;li&gt;Second&lt;/li&gt;
  &lt;li&gt;Third&lt;/li&gt;
&lt;/ol&gt;</code></pre></td>
</tr>
<tr>
<td>Unordered List</td>
<td><pre><code>- First
- Second
- Third</code></pre></td>
<td><ul><li>First</li><li>Second</li><li>Third</li></ul></td>
<td><pre><code>&lt;ul&gt;
  &lt;li&gt;First&lt;/li&gt;
  &lt;li&gt;Second&lt;/li&gt;
  &lt;li&gt;Third&lt;/li&gt;
&lt;/ul&gt;</code></pre></td>
</tr>
<tr>
<td>Unordered List</td>
<td><pre><code>* First
* Second
* Third</code></pre></td>
<td><ul><li>First</li><li>Second</li><li>Third</li></ul></td>
<td><pre><code>&lt;ul&gt;
  &lt;li&gt;First&lt;/li&gt;
  &lt;li&gt;Second&lt;/li&gt;
  &lt;li&gt;Third&lt;/li&gt;
&lt;/ul&gt;</code></pre></td>
</tr>
<tr>
<td>Inline Code</td>
<td><code>`code value`</code></td>
<td><code>code value</code></td>
<td><code>&lt;code&gt;code value&lt;/code&gt;</code></td>
</tr>
<tr>
<td>Fenced Code</td>
<td><pre><code>```js
new Date(); // JavaScript
```</code></pre></td>
<td><pre><code>new Date(); // JavaScript</code></pre></td>
<td><code>&lt;pre&gt;&lt;code&gt;new Date(); // JavaScript&lt;/code&gt;&lt;/pre&gt;</code></td>
</tr>
<tr>
<td>Code Block</td>
<td><pre><code>    shell&gt; pwd
    /home/alice</code></pre></td>
<td><pre><code>shell&gt; pwd
/home/alice</code></pre></td>
<td><pre><code>&lt;pre&gt;&lt;code&gt;shell&amp;gt; pwd
/home/alice&lt;/code&gt;&lt;/pre&gt;</code></pre></td>
</tr>
<tr>
<td>Horizontal Rule</td>
<td><code>---</code></td>
<td><hr /></td>
<td><code>&lt;hr /&gt;</code></td>
</tr>
<tr>
<td>Link (Internal)</td>
<td><code>[label](book/file.html)</code></td>
<td><a href="book/file.html">label</a></td>
<td><code>&lt;a href="book/file.html"&gt;label&lt;/a&gt;</code></td>
</tr>
<tr>
<td>Link (Anchor)</td>
<td><code>[label](#element-id)</code></td>
<td><a id="element-id" href="#element-id">label</a></td>
<td><code>&lt;a href="#element-id"&gt;label&lt;/a&gt;</code></td>
</tr>
<tr>
<td>Link (External)</td>
<td><code>[label](https://www.arangodb.com/){:target="_blank"}</code></td>
<td><a href="https://www.arangodb.com/" target="_blank">label</a></td>
<td><code>&lt;a href="https://www.arangodb.com" target="_blank"&gt;label&lt;/a&gt;</code></td>
</tr>
<tr>
<td>Link (External)</td>
<td><code>&lt;https://www.arangodb.com/&gt;{:target="_blank"}</code></td>
<td><a href="https://www.arangodb.com/" target="_blank">https://www.arangodb.com/</a></td>
<td><code>&lt;a href="https://www.arangodb.com" target="_blank"&gt;https://www.arangodb.com/&lt;/a&gt;</code></td>
</tr>
<tr>
<td>Image</td>
<td><code>![ArangoDB Logo](assets/arangodb_logo_small_2016.png)</code></td>
<td><img src="assets/arangodb_logo_small_2016.png" alt="ArangoDB Logo"></td>
<td><code>&lt;img src="assets/arangodb_logo_small_2016.png" alt="ArangoDB Logo"&gt;</code></td>
</tr>
<tr>
<td>Table</td>
<td><pre><code>| A  | B  | C  |
|----|----|----|
| A1 | B1 | C1 |
| A2 | B2 | C2 |</code></pre></td>
<td><table><thead><tr><th>A</th><th>B</th><th>C</th></tr></thead><tbody><tr><td>A1</td><td>B1</td><td>C1</td></tr><tr><td>A2</td><td>B2</td><td>C2</td></tr></tbody></table></td>
<td><pre><code>&lt;table&gt;
  &lt;thead&gt;
    &lt;tr&gt;
      &lt;th&gt;A&lt;/th&gt;
      &lt;th&gt;B&lt;/th&gt;
      &lt;th&gt;C&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;
      &lt;td&gt;A1&lt;/td&gt;
      &lt;td&gt;B1&lt;/td&gt;
      &lt;td&gt;C1&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;A2&lt;/td&gt;
      &lt;td&gt;B2&lt;/td&gt;
      &lt;td&gt;C2&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</code></pre></td>
</tr>
<tr>
<td>Frontmatter</td>
<td><pre><code>---
layout: default
description: Page about X
title: Feature X
---</code></pre></td>
<td></td>
<td><pre><code>&lt;title&gt;Feature X | ArangoDB Documentation&lt;/title&gt;
&lt;meta itemprop="description" name="description" content="Page about X" /&gt;</code></pre></td>
</tr>
<tr>
<td>Danger</td>
<td><pre><code>{% hint 'danger' %}
Unrecoverable fault
{% endhint %}</code></pre></td>
<td><blockquote>❌ Unrecoverable fault</blockquote></td>
<td><pre><code>&lt;div class="alert alert-danger" …&gt;
Unrecoverable fault
&lt;/div&gt;</code></pre></td>
</tr>
<tr>
<td>Warning</td>
<td><pre><code>{% hint 'warning' %}
Common pitfall
{% endhint %}</code></pre></td>
<td><blockquote>⚠ Common pitfall</blockquote></td>
<td><pre><code>&lt;div class="alert alert-warning" …&gt;
Common pitfall
&lt;/div&gt;</code></pre></td>
</tr>
<tr>
<td>Security</td>
<td><pre><code>{% hint 'security' %}
Security warning
{% endhint %}</code></pre></td>
<td><blockquote>🛡 Security warning</blockquote></td>
<td><pre><code>&lt;div class="alert alert-warning" …&gt;
Security warning
&lt;/div&gt;</code></pre></td>
</tr>
<tr>
<td>Info</td>
<td><pre><code>{% hint 'info' %}
Informative note
{% endhint %}</code></pre></td>
<td><blockquote>ℹ Informative note</blockquote></td>
<td><pre><code>&lt;div class="alert alert-info" …&gt;
Informative note
&lt;/div&gt;</code></pre></td>
</tr>
<tr>
<td>Tip</td>
<td><pre><code>{% hint 'tip' %}
Useful hint
{% endhint %}</code></pre></td>
<td><blockquote>✔ Useful hint</blockquote></td>
<td><pre><code>&lt;div class="alert alert-success" …&gt;
Useful hint
&lt;/div&gt;</code></pre></td>
</tr>
<tr>
<td>Include</td>
<td><code>{% include hint-ee.md feature="SmartGraphs" plural=true %}</code></td>
<td><blockquote>ℹ SmartGraphs are only available in the <a href="https://www.arangodb.com/enterprise-server/" target="_blank">Enterprise Edition</a>.</blockquote></td>
<td><pre><code>&lt;div class="alert alert-info" …&gt;
SmartGraphs are only available in the
&lt;a href="https://www.arangodb.com/enterprise-server/" target="_blank"&gt;Enterprise Edition&lt;/a&gt;.
&lt;/div&gt;</code></pre></td>
</tr>
<tr>
<td>Version (full)</td>
<td><code>{{ site.data.versions[page.version.name] }}</code></td>
<td>v3.9.0-devel</td>
<td><code>v3.9.0-devel</code></td>
</tr>
<tr>
<td>Version (major.minor)</td>
<td><code>{{ page.version.version }}</code></td>
<td>3.9</td>
<td><code>3.9</code></td>
</tr>
<tr>
<td>Version Condition</td>
<td><pre><code>{%- assign ver = "3.8" | version: "&gt;=" %}
{%- if ver %}
Current version is greater than 3.8
{%- else %}
Current version is less than or equal to 3.8
{%- endif %}</code></pre></td>
<td>Current version is greater than 3.8</td>
<td><code>Current version is greater than 3.8</code></td>
</tr>
<tr>
<td>Version Remark</td>
<td><code>&lt;small&gt;Introduced in: v3.8.2&lt;/small&gt;</code></td>
<td><sub>Introduced in: v3.8.2</sub></td>
<td><code>&lt;small&gt;Introduced in: v3.8.2&lt;/small&gt;</code></td>
</tr>
</tbody>
</table>

### Content Guidelines

- Use American English spelling, e.g. _behavior_ instead of _behaviour_.

- Use inclusive language, e.g. _work-hours_ instead of _man-hours_.

- Get to point quickly on every page. [Add a Lead Paragraph](#adding-a-lead-paragraph)
  that summarizes what the page is about.

- Target end-users and focus on the outcome. It should be about solutions, not
  features.

- Do not use jargon or technical abbreviations in headlines or the navigation.
  Define the meaning if you use it in the content.

- Do not add too many hint boxes or everything ends up being a highlight.

### Syntax Guidelines

- Wrap text at 80 characters where possible. This helps tremendously in version
  control. Pre-wrap lines if necessary.

- Put Markdown links on a single line `[link label](target.html#hash)`,
  even if it violates the guideline of 80 characters per line.

- Avoid breaking lines of code blocks and where Markdown does not allow line
  breaks, e.g. in Markdown table rows (you can use `<br>` if really necessary).

- Avoid using `here` as link label. Describe what the link points to instead.

- Avoid overly long link labels, such as entire sentences.

- Use relative links for cross-references to other documentation pages, e.g.
  `../drivers/js.html` instead of `/docs/stable/drivers/js.html` or
  `https://www.arangodb.com/docs/stable/drivers/js.html`.

- Append `{:target="_blank"}` to Markdown links which point to external sites,
  e.g. `[external link](https://www.github.com/){:target="_blank"}`.

- Avoid `**bold**` and `_italic_` markup in headlines. Inline `` `code` `` is
  acceptable for code values, nonetheless.

- `-` is preferred for bullet points in unordered lists over `*`

- Use `#` and `##` for level 1 and 2 headlines for new content over `===` and
  `---` underlines.

- There should be a blank line above and below fenced code blocks and headlines
  (except if it is at the top of the document, right after the end of the
  frontmatter `---`).

- Use `js` as language in fenced code blocks for highlighting AQL queries.
  We do not have a highlighter for AQL, but JavaScript code highlighting works
  reasonably well.

      ```js
      FOR i IN 1..3 RETURN CONCAT("a", i)
      ```

- Use the exact spelling of Enterprise Edition and its features, as well as for
  all other terms coined by ArangoDB:
  - _SmartGraphs_
  - _SmartJoins_
  - _OneShard_
  - _Community Edition_
  - _Enterprise Edition_
  - _DB-Server_, not dbserver, db-server, DBserver (unless it is a code value)
  - _Coordinator_ (uppercase C)
  - _Agent_, _Agency_ (uppercase A)
  - _Active Failover_
  - _Datacenter to Datacenter Replication_, _DC2DC_
  - _Oasis_, _ArangoDB Oasis_ (_… the ArangoDB cloud_, but do not use
    _ArangoDB Cloud_)

- Do not capitalize the names of executables or code values, e.g. write
  _arangosh_ instead of _Arangosh_.

- Do not write TODOs right into the content. Use an HTML comment
  `<!-- An HTML comment -->` if it is okay that the comment will be visible in
  the page source of the generated files. Otherwise use
  `{% comment %}...{% endcomment %}`.

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
to the parent folder of a file.

| From | To | Markdown |
|:-----|:---|:---------|
| `3.9/tutorials.md` | `3.9/graphs.md` | `[Graphs](graphs.html)` |
| `3.9/tutorials.md` | `3.9/aql/operators.md` | `[AQL Operators](aql/operators.html)` |
| `3.9/aql/operators.md` | `3.9/tutorials.md` | `[Tutorials](../tutorials.html)` |
| `3.9/aql/operators.md` | `3.9/http/pregel.md` | `[Pregel HTTP API](../http/pregel.html)` |
| `3.9/tutorials.md` | `3.7/architecture.md` | `[Architecture v3.7](../3.7/architecture.html)` |
| `3.9/aql/operators.md` | `3.7/tutorials.md` | `[Tutorials v3.7](../../3.7/tutorials.html)` |

You can also link to headlines within a page like `[label](#anchor-id)`.
The anchor ID is the headline text but with the characters converted to Latin
base characters, all lower-case, spaces and other special characters replaced
by hypens `-`. Underscores remain, however. Some examples:

| Headline | Anchor |
|:---------|:-------|
| Some Text | `#some-text` |
| Ümläuté | `#umlaute` |
| Insert / Save | `#insert--save` |
| TO_HEX() | `#to_hex` |
| `norm` Analyzer | `#norm-analyzer` |

For external links, please add `{:target="_blank"}` so that they open in a new
tab when clicked:

```markdown
This is an [external link](https://www.arangodb.com/){:target="_blank"}
```

### Adding a Lead Paragraph

A lead paragraph is the opening paragraph of a written work that summarizes its
main ideas. Only few pages have one so far, but new content should be written
with such a brief description. It is supposed to clarify the scope of the
article so that the reader can quickly assess whether the following information
is of relevance, but also acts as an introduction.

```markdown
# Using Feature X

You can do this and that with X, and it is ideal to solve problem Y
{:class="lead"}
```

The lead paragraph needs to be placed between the top-level headline and the
first content paragraph. It should end without a period, contain no links and
usually avoid other markup as well (bold, italic). This also enables the use
of the lead paragraph as metadata for the page:

```markdown
---
layout: default
description: >-
  You can do this and that with X, and it is ideal to solve problem Y
title: Feature X
---
# Using Feature X

{{ page.description }}
{:class="lead"}
```

The generated metadata looks like this:

```html
<meta property="og:title" content="Feature X | ArangoDB Documentation" />
<meta property="og:description" content="You can do this and that with X, and it is ideal to solve problem Y" />
```

### Adding a page

Start off by finding a file name. It should be:

- All lower-case
- Use hyphen-minus `-` instead of spaces
- Be very short but descriptive
- Follow the patterns of existing files

Note that the file name is independent of what will show in the navigation or
what will be used as headline for that page. The file name will be used as
part of the final URL, however. For example, `3.8/aql/examples.md` will become
`http://www.arangodb.com/docs/3.8/aql/examples.html`.

Create a new file with the file name and a `.md` file extension. Open the file
in a text editor (Visual Studio Code is recommended). Add the following
frontmatter:

```yaml
---
layout: default
description: A meaningful description of the page
title: Short title
---
```

Add the actual content formatted in Markdown syntax below the frontmatter.

Then add the page to the navigation. Each book has a navigation tree represented
as a nested data structure in YAML syntax. The _NavigationTag_ plugin creates
the navigation on the left-hand side from it. The YAML file for a book can be
found here: `_data/<version>-<book>.yml`.

Open the respective navigation definition file, e.g. `_data/3.8-aql.yml` if the
page should be added to the AQL book of version 3.8. Let us assume the file is
`aql/operations-create.md` and the page is supposed to show above the `FOR`
language construct in the navigation. Locate where that other page is added and
insert a new pair of lines for the new page:

```diff
 - text: High level Operations
   href: operations.html
   children:
+    - text: CREATE
+      href: operations-create.html
     - text: FOR
       href: operations-for.html
```

`text` will be used as label in the navigation. `href` is the name of the file,
relative to the current book. Note that the file extension needs to be `.html`,
not `.md`!

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

### Setting anchor IDs

Headlines are assigned automatically generated identifiers based on their text.
In some cases you may want to set an ID explicitly:

```markdown
### A headline {: #custom-id }
```

### Disable or limit table of contents

The table of contents (ToC) on the right-hand side at the top of a page lists
the headlines if there at least three on the page. It can be disabled for
individual pages with the following frontmatter:

```yaml
---
layout: default
page-toc:
  disable: true
---
```

It can also be restricted to a maximum headline level to omit the deeper nested
headlines for less clutter:

```yaml
---
layout: default
page-toc:
  max-headline-level: 3
---
```

A setting of `3` means that `<h1>`, `<h2>`, and `<h3>` headlines will be listed
in the ToC, whereas `<h4>`, `<h5>`, and `<h6>` will be ignored.

### Updating version numbers

#### Version number schema

The version number schema is `vMajor.Minor.Patch`, e.g. `v3.7.14`. Patch releases
contain bugfixes only. Minor releases often add new features and come with some
breaking changes. Major releases add new features and may contain substantial
breaking changes.

Non-stable versions can have a suffix. The `devel` version usually ends with
`-devel`, e.g. `v3.9.0-devel`. Preview releases can also have suffixes like
`-alpha.1`, `beta.2`, `-rc.3`.

#### Patch releases

When a new patch release is published, the respective version number in
`_data/versions.yml` needs to be incremented:

```diff
-"3.8": "v3.8.1"
+"3.8": "v3.8.2"
```

The examples should be re-generated to ensure that they match the actual server
behavior of the new version.

#### Major and minor releases

When a new major or minor version is released to the public, the new stable
version needs to be made the default version for the documentation. It will be
available under the `stable` alias at <https://www.arangodb.com/docs/stable/>.
At the same time, the in-development version needs to be updated as well.
It will be available under the `devel` alias at
<https://www.arangodb.com/docs/devel/>.

The `stable` and `devel` versions can be adjusted in the `_config.yml` under the
`versions` key:

```diff
 versions:
-  stable: "3.8"
-  devel: "3.9"
+  stable: "3.9"
+  devel: "3.10"
```

Additionally, the version numbers in `_data/versions.yml` may need to be
adjusted for the release.

Also update `_redirects` to the latest stable version.

Do not forget to re-generate the examples before publishing.

### Deprecating a version

When an ArangoDB version reaches [End-of-Life](https://www.arangodb.com/subscriptions/end-of-life-notice/),
its documentation needs to be marked as such. The respective version needs to
be added to the `_data/deprecations.yml` file for that:

```diff
 - "3.4"
 - "3.5"
 - "3.6"
+- "3.7"
```

It makes a warning show at the top of every page for that version.

### Adding a new version

- Run below commands in Bash. If you use Git Bash on Windows, it will
  dereference symlinks by default (copies the referenced files)!
  To avoid that, start Git Bash **as administrator** and run
  `export MSYS=winsymlinks:nativestrict` before you continue.
- Copy the latest devel version to a new directory i.e. `cp -a 3.9 4.0`
- Create the necessary navigation definition files in `_data` by copying, e.g.
  ```bash
  cd _data
  for book in aql drivers http manual oasis; do
    cp -a "3.9-${book}.yml" "4.0-${book}.yml"
  done
  cd ..
  ```
- Create relative symlinks to program option JSON files and the metrics YAML
  file in `_data`, like
  ```bash
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
  ```bash
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
- Add entries for the new version in `_config.yml` to the `algolia` and
  `exclude` keys:
  ```diff
   algolia:
     files_to_exclude:
  +    - 4.0/**/*
       - 3.9/**/*
  ```
  ```diff
   exclude:
     - ...
  +  - 4.0/generated
     - 3.9/generated
     - ...
  +# - 4.0/
   # - 3.9/
  ```

### Adding a new arangosh example

A complete example with the preferred indentation:

```
    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline ensureUniquePersistentSingle
    @EXAMPLE_ARANGOSH_OUTPUT{ensureUniquePersistentSingle}
    ~ db._create("ids");
      db.ids.ensureIndex({ type: "persistent", fields: [ "myId" ], unique: true });
      db.ids.save({ "myId": 123 });
    | db.ids.save({ 
    |   "myId": 123
      }); // xpError(ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED)
    ~ db._drop("ids");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock ensureUniquePersistentSingle
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}
```

Jekyll requires the example code to be encapsulated by an `arangoshexample`
block, followed by an `include` tag to embed the example:

```
{% arangoshexample examplevar="examplevar" script="script" result="result" %}
...
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
```

Inside the block, two more wrappers are needed. The outer one marks the
beginning and end of a so-called DocuBlock and gives it a unique name that will
be used as file name for the example transcript (e.g.
`3.9/generated/Examples/name_of_docublock.generated`). The inner one indicates
that it is an arangosh example and not a curl example and repeats the DocuBlock
name:

```
@startDocuBlockInline name_of_docublock
@EXAMPLE_ARANGOSH_OUTPUT{name_of_docublock}
...
@END_EXAMPLE_ARANGOSH_OUTPUT
@endDocuBlock name_of_docublock
```

Groups of examples should have the same name prefix. If an example needs to be
run against an ArangoDB cluster instead of a single server (default), then give
the name a suffix of `_cluster`.

Inside the wrappers, you can write the JavaScript code for arangosh:

```js
db._create("collection");
db.collection.save({ _key: "foo", value: 123 });
db._query(`FOR doc IN collection RETURN doc.value`).toArray();
db._drop("collection");
```

Each statement needs to be either on a single line, or indicate that line
continuation is required for statements spanning multiple lines. A leading 
pipe character `|` is required for all lines except the last line of a
multi-line statement:

```js
  db._create("collection");
| db.collection.save([
|   { multiple: true },
|   { lines: true }
  ]);
| for (var i = 0; i < 3; i++) {
|   db.collection.save({ _key: "k" + i });
  }
  db._drop("collection");
```

The statements as well as the results will be visible in the example transcript.
To hide certain statements from the output, e.g. for setup/teardown that is not
relevant for the example, you can use a leading tilde `~` to suppress individual
lines:

```js
~ db._create("collection");
  db.collection.save({ _key: "foo" });
~ db._drop("collection");
```

If a statement is expected to fail (e.g. to demonstrate the error case), then
this has to be indicated with a special JavaScript comment:

```js
db._document("collection/does_not_exist"); // xpError(ERROR_ARANGO_DOCUMENT_NOT_FOUND)
```

This will make the example generation continue despite the error. See
[Error codes and meanings](https://www.arangodb.com/docs/stable/appendix-error-codes.html)
for a list of all error codes and their names. If a unexpected error is raised,
then the example generation will abort with an error.

### Adding a new AQL example

Complete example with the preferred indentation:

```
    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline joinTuples
    @EXAMPLE_AQL{joinTuples}
    @DATASET{joinSampleDataset}
    @EXPLAIN{TRUE}
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

Similar to arangosh examples, several wrappers are required. The `aqlexample`
block encapsulates the example for Jekyll, and the `include` tag embeds it:

```
{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
...
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}
```

Inside the block, there is a DocuBlock wrapper and a wrapper to indicate that
this is an AQL example:

```
@startDocuBlockInline name_of_docublock
@EXAMPLE_AQL{name_of_docublock}
...
@END_EXAMPLE_AQL
@endDocuBlock name_of_docublock
```

The example can optionally specify a dataset that will be loaded before the
query is run:

```
@DATASET{name_of_dataset}
```

See <https://github.com/arangodb/arangodb/blob/devel/js/common/modules/@arangodb/examples/examples.js>
for the available datasets.

To get the query explain output including the execution plan instead of the
actual query result, you can optionally specify:

```
@EXPLAIN{TRUE}
```

Then the actual AQL query follows, e.g.

```
FOR i IN 1..3
  RETURN i
```

The query can optionally use bind parameters that can be passed like this:

```
FOR elem IN @arr
  RETURN elem
@BV {
  arr: ["foo", "bar"]
}
```

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
  /opt/build/repo/_plugins/versions/version.rb:45:in `<=>': undefined method `version' for nil:NilClass (NoMethodError)
  ```

  This error occurs sporadically in the Netlify preview builds. The cause is
  unclear. So far it was sufficient to trigger another build, e.g. by pushing
  an empty commit, and it succeeded.

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

For the CI process we currently use Netlify. This service has been built
so that you can quickly test and deploy static sites. We only use it to
have a live preview and a CI pipeline, not for hosting the actual documentation
site.

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

### License

The ArangoDB documentation is licensed under Apache-2.0.
See [LICENSE](LICENSE) for details.

Parts not licensed under Apache-2.0 are outlined in
[LICENSES-OTHER-COMPONENTS.md](LICENSES-OTHER-COMPONENTS.md)
