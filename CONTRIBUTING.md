# Contributing

## Development setup

```sh
yarn install
yarn test       # run tests
yarn ci         # full check: lint, type-check, tests, build
```

## Conventional commits

This project uses [semantic-release](https://semantic-release.gitbook.io/) to
automate versioning and publishing. The next version number, the changelog, and
the npm release are all derived from commit messages, so commits must follow the
[Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <description>
```

Pull requests are squash-merged, and the PR title becomes the commit message
that semantic-release analyses. The `Lint PR` workflow validates that every PR
title uses one of the accepted types:

| Type     | Release | When to use                                |
| -------- | ------- | ------------------------------------------ |
| `feat`   | minor   | A new feature, backwards-compatible        |
| `fix`    | patch   | A bug fix                                  |
| `chore`  | none    | Tooling, docs, or maintenance (no release) |
| `revert` | patch   | Reverting a previous change                |

A breaking change triggers a major release. Mark it by appending `!` after the
type (for example `feat!: drop support for legacy bridge`) or by adding a
`BREAKING CHANGE:` footer in the PR description.

## Publishing a new release

Releases are fully automated; there is no manual version bump, tag, or
`npm publish` step. Publishing from a local machine is blocked by the
`prepublishOnly` hook.

To publish, run the **Release** GitHub Actions workflow
(`.github/workflows/release.yml`) via _Run workflow_:

https://github.com/Telefonica/webview-bridge/actions?query=workflow%3ARelease

semantic-release then inspects the commits merged since the last release,
determines the next version, updates `CHANGELOG.md`, publishes to npm, and
creates the matching GitHub release and git tag.
