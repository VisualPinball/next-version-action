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

- `version` - version in package.json
- `tags` - git tags in semver format
- `nextVersion` - computed next version (see table above)
- `nextTag` - computed next version, prefixed (see below)
- `isBump` - true if computed next version differs from version in package.json, false otherwise
- `isPrerelease` - true if pre-release, false otherwise

For inputs, the following options are available:

- `path` - path to folder containing package.json (leave blank for root folder).
- `tagPrefix` - adds a string to the `nextTag` (default: '').

Example yml:

```yaml
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Fetch next version
        id: nextVersion
        uses: VisualPinball/next-version-action@v0.1.7
        with:
          tagPrefix: 'v'
      - name: Log next version outputs
        run: |
          echo "${{ steps.nextVersion.outputs.version }}"
          echo "${{ steps.nextVersion.outputs.nextVersion }}"
          echo "${{ steps.nextVersion.outputs.nextTag }}"
          echo "${{ steps.nextVersion.outputs.isBump }}"
          echo "${{ steps.nextVersion.outputs.isPrerelease }}"
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
  √ should use version from package.json if no tag is available (2ms)
  √ should bump version if same tag is available
  √ should bump version if same tag is available but prefixed
  √ should bump version if same tag is available but not prefixed (1ms)
  √ should use bump latest pre-release tag if multiple tags are available
  √ should use bump latest tag if multiple tags are available sorted the other way around
  √ should use bump latest tag if one tag was skipped (1ms)
  √ should use major version from major package.json if no tag matched
  √ should use pre-release version from pre-release package.json if no tag matched
  √ should bump final version if tag already exists and ends with 0
  √ should throw an error for wrong versions (2ms)
```
