# Contributing

## Development setup

```sh
yarn install
yarn test       # run tests
yarn ci         # full check: lint, type-check, tests, build
```

## Publishing a new release

### 1. Update the changelog

Add an entry at the top of `CHANGELOG.md` following the existing format:

```md
## v<version> - <date>

-   `methodName`: description of the change
```

Commit it:

```sh
git add CHANGELOG.md
git commit -m "Changelog"
```

### 2. Bump the version

Use `npm version` to bump `package.json` and create the git commit and tag in
one step:

```sh
npm version patch   # bug fixes
npm version minor   # new features, backwards-compatible changes
npm version major   # breaking changes
```

This creates a commit (e.g. `5.2.0`) and a tag (e.g. `v5.2.0`) automatically.

### 3. Push commits and tags

```sh
git push && git push --tags
```

### 4. Publish to npm

```sh
npm publish
```

The `prepublishOnly` hook runs the full CI suite (`lint`, `type-check`, `tests`,
`build`) before publishing. Fix any failures before retrying.

### 5. Create a GitHub release

```sh
gh release create v<version> --generate-notes
```

For example, for `v5.2.0`:

```sh
gh release create v5.2.0 --generate-notes
```
