# Elm tooling action

> Warning: do not use this if you have a JavaScript `package.json` already.
> In such cases, follow instead the default npm-based CI setup as described here:
> https://elm-tooling.github.io/elm-tooling-cli/ci/

This action lets you install tools supported by elm-tooling,
such as elm, elm-format, elm-json and elm-test-rs in your GitHub CI,
without the need of npm and `package.json`.

It will also cache your home Elm directory,
as defined by the `ELM_HOME` environment variable,
for more efficient builds! You can use this action as follows.

```yaml
      - name: Install elm, elm-format and cache the ELM_HOME directory
        uses: mpizenberg/elm-tooling-action@v1.2
        with:
          cache-key: elm-home-${{ hashFiles('elm-tooling.json', 'elm.json') }}

      - name: Making sure the installation worked
        run: elm --version
```

Where your `elm-tooling.json` file states your elm and tools versions
as specified in the [elm-tooling.json][spec].
It should look like follows.

```json
{
  "tools": {
    "elm": "0.19.1",
    "elm-format": "0.8.5"
  }
}
```

[spec]: https://elm-tooling.github.io/elm-tooling-cli/spec/

## Advanced usage

There are two additional keys providing more flexibility for some use cases.

1. `cache-restore-key`: A key for restoring the cache if no cache hit occurred for cache-key.
2. `elm-tooling-dir`: The directory containing the `elm-tooling.json` file. If not provided, it defaults to the project root.

```yaml
      - uses: mpizenberg/elm-tooling-action@v1.2
        with:
          cache-key: elm-home-${{ hashFiles('elm-tooling.json', 'elm.json') }}
          cache-restore-key: elm-home
          elm-tooling-dir: some/sub/directory
```

## Caching effectively

For security reasons, GitHub actions only have access to caches created
in the current branch, a parent branch or the main branch.
So if you want cache hits in the first push of your PR branches,
a matching cache (primary or restoration key) must have been created
in the main branch before.
So I'd suggest running your CI both on PR and on a push to the main branch.

More info regarding cache restriction is available on [GitHub docs][cache].

[cache]: https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows#restrictions-for-accessing-a-cache

## Notes

Internally, what this does is calling `elm-tooling install`
from the `elm-tooling-dir` directory or the root directory
if that is not defined.
This means it will install the tools somewhere in `ELM_HOME/elm-tooling/`,
add links to those tools in `elm-tooling-dir/node_modules/.bin/`,
and then we add `elm-tooling-dir/node_modules/.bin` to the `PATH`
so that the executables become available to you.
