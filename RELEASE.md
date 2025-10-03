# Release Guide

Manual release process for AutowareLichtblickPlugins.

## Prerequisites

```bash
yarn lint
yarn build
```

## Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md` (manually add new version entry)
3. Commit changes
4. Create tag
5. Push code and tag
6. Create GitHub Release

## Versioning

**PATCH (0.1.1 → 0.1.2)**: Bug fixes, docs, refactoring
**MINOR (0.1.1 → 0.2.0)**: New features, panels, layouts
**MAJOR (0.1.1 → 1.0.0)**: Breaking changes

## Example: Release 0.1.1

```bash
# 1. Update package.json: "version": "0.1.1"
# 2. Update CHANGELOG.md with 0.1.1 entry

# 3. Commit
git add . && git commit -m "chore: prepare release 0.1.1"

# 4. Tag
git tag -a 0.1.1 -m "Release 0.1.1"

# 5. Push
git push origin main && git push origin 0.1.1

# 6. Create GitHub Release at:
# https://github.com/tier4/AutowareLichtblickPlugins/releases
```

## Files

- `package.json` - Version number
- `CHANGELOG.md` - Changelog
