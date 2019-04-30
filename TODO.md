# TODO

- make version selector in _includes/topnav.html dynamic
- create a proper swagger json tag:

    ```
    {% swagger method="post_api_cursor"%}
    ```

    This should not access the allComments json but parse the swagger json (maybe using some lib) and produce nice and clean output immediately.

    After that it should be verified if there are still docublocks left. maybe %{ docublock %} can die then
- create a jekyll subcommand that outputs all examples in a **STRUCTURED** way

    ```
    $ bundler exec jekyll find-examples # see algolia plugin
    $ head examples.json
    {"example1": "db._collections()\nprin(\"OK\")"}

    this should then feed a new thing that generates the examples via the CI

- rethink the {% tag %}{% include %} thing...namely first one thing that parses something and then outputs variables that then include a template. feels wrong...