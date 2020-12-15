## About:

This action is used for determining the next version of `VisualPinball.*` projects.

It should only be used by `VisualPinball.*` projects in workflows and should not be deployed to the marketplace.

`VisualPinball.*` projects use the following versioning:


|   | package.json    | latest repo tag | new tag/publish version | notes                                                          |
|---|-----------------|-----------------|-------------------------|----------------------------------------------------------------|
| 1 | 0.0.1-preview.0 | *n/a*           | 0.0.1-preview.0         | first release                                                  |
| 2 | 0.0.1-preview.0 | 0.0.1-preview.0 | 0.0.1-preview.1         | auto-incr                                                      |
| 3 | 0.0.1-preview.0 | 0.0.1-preview.1 | 0.0.1-preview.2         | auto-incr                                                      |
| 4 | 0.0.1-preview.0 | 0.0.1-preview.2 | 0.0.1.preview.3         | auto-incr                                                      |
| 5 | 0.0.1           | 0.0.1-preview.3 | 0.0.1                   | manual bump                                                    |
| 6 | 0.1.0-preview.0 | 0.0.1           | 0.1.0-preview.0         | reset, since no previous 0.1.0-preview found                   |
| 7 | 0.2.0           | 0.1.0-preview.0 | 0.2.0                   | we noticed that we actually want to bump minor, not just patch |
| 6 | 0.2.1-preview.0 | 0.2.0           | 0.2.1-preview.0         | business as usual                                              |


This action was inspired by [latest-tag](https://github.com/EndBug/latest-tag) and was derived from [this template](https://github.com/actions/typescript-action).

## Usage:

You should use this action in a workflow immediately after checkout. The following outputs will be set:

- `version`: version from package.json
- `tags`: reverse sorted git tags in semver format
- `nextVersion`: calculated next version (see table above)

Example yml:

```
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Fetch next version
        id: nextVersion
        uses: freezy/VisualPinball.NextReleaseAction@v0.1.0
      - name: Log version and next version
        run: |
          echo "${{ steps.nextVersion.outputs.version }}"
          echo "${{ steps.nextVersion.outputs.nextVersion }}"
```           

**Note:** For this action to work properly, make sure to configure `actions/checkout@v2` with a `fetch-depth: 0`.

## Development:

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests
```bash
$ npm test

 PASS  __tests__/main.test.ts
  ✓ VPE Versioning #1 (2ms)
  ✓ VPE Versioning #2 (1ms)
  ✓ VPE Versioning #3
  ✓ VPE Versioning #4
  ✓ VPE Versioning #5 (1ms)
  ✓ VPE Versioning #6
  ✓ VPE Versioning #7
  ✓ VPE Versioning #8

...
```
