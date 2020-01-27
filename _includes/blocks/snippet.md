# Snippet

This tests the include tag, whether the frontmatter is added as well.

## Markdown

This is **bold**, _italic_, ***both***, a [link](https://www.google.com){:target="_blank"}.
Inline `code`.

[Relative HTML link](aql/graphs.html) vs
[Jekyll link]({% link {{ include.version }}/aql/graphs.md %})

- Foo
- Bar
- Baz

```js
for (let i = 1; i < 3; i++) {
    console.log(i); // highlighted JavaScript code
}
```

## HTML

This is <strong>bold</strong>, <em>italic</em>, <strong><em>both</em></strong>,
a <a href="https://www.google.com" target="_blank">link</a>.
Inline <code>code</code>.

<ul>
<li>Foo</li>
<li>Bar</li>
<li>Baz</li>
</ul>

<pre><code>for (let i = 1; i < 3; i++) {
    console.log(i); // JavaScript code in pre + code tags
}</code></pre>
