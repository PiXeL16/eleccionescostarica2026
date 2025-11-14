# Release Process

This document describes how to create a new release for Elecciones Costa Rica 2026.

## Prerequisites

- Be on the `main` branch
- Have a clean working directory (all changes committed)
- Have push access to the repository

## Quick Release

For most releases, use one of these commands:

```bash
# Patch release (bug fixes): 1.2.0 -> 1.2.1
make release-patch

# Minor release (new features): 1.2.0 -> 1.3.0
make release-minor

# Major release (breaking changes): 1.2.0 -> 2.0.0
make release-major
```

These commands will:
1. Bump the version in `web/package.json`
2. Commit the version change
3. Create a git tag (e.g., `v1.3.0`)
4. Push the commit and tag to GitHub

## Step-by-Step Release

If you prefer more control, you can do the steps separately:

### 1. Check Current Version

```bash
make current-version
```

### 2. Bump Version

Choose the appropriate version bump:

```bash
# Patch version (1.2.0 -> 1.2.1)
make version-patch

# Minor version (1.2.0 -> 1.3.0)
make version-minor

# Major version (1.2.0 -> 2.0.0)
make version-major
```

This will:
- Update `web/package.json`
- Create a commit with message: `chore: bump version to vX.Y.Z`

### 3. Create Release Tag

```bash
make release
```

This will:
- Create an annotated git tag (`v1.3.0`)
- Push both the commit and tag to GitHub
- Display the GitHub release URL

## Semantic Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Patch** (1.2.0 -> 1.2.1): Bug fixes, minor tweaks, no new features
- **Minor** (1.2.0 -> 1.3.0): New features, backwards-compatible changes
- **Major** (1.2.0 -> 2.0.0): Breaking changes, major redesigns

## Examples

### Bug Fix Release

```bash
# Fixed a typo in the FAQ page
make release-patch
# Creates v1.2.1
```

### Feature Release

```bash
# Added AI transparency with page citations
make release-minor
# Creates v1.3.0
```

### Breaking Change Release

```bash
# Complete UI redesign, changed data structure
make release-major
# Creates v2.0.0
```

## What Happens After Release?

1. **GitHub Tag**: A new tag is created at `https://github.com/PiXeL16/eleccionescostarica2026/releases/tag/vX.Y.Z`
2. **Footer Version**: The version number in the website footer updates automatically (reads from `package.json`)
3. **GitHub Release**: You can manually create a GitHub Release from the tag with release notes

## Troubleshooting

### "Working directory is not clean"

Commit or stash your changes:
```bash
git status
git add .
git commit -m "your commit message"
```

### "Not on main branch"

Switch to main:
```bash
git checkout main
git pull
```

### "Tag already exists"

The version you're trying to release already has a tag. Bump to the next version instead.

## Manual Process (if Makefile fails)

If the Makefile doesn't work for some reason:

```bash
# 1. Update version manually
cd web
npm version patch  # or minor, or major
cd ..

# 2. Commit
git add web/package.json
git commit -m "chore: bump version to vX.Y.Z"

# 3. Tag
git tag -a "vX.Y.Z" -m "Release vX.Y.Z"

# 4. Push
git push origin main
git push origin "vX.Y.Z"
```

## Available Make Commands

Run `make help` to see all available commands:

```bash
make help              # Show all commands
make current-version   # Show current version
make check-clean       # Check if working directory is clean
make check-main        # Check if on main branch
make version-patch     # Bump patch version
make version-minor     # Bump minor version
make version-major     # Bump major version
make release           # Create tag and push
make release-patch     # Full patch release workflow
make release-minor     # Full minor release workflow
make release-major     # Full major release workflow
```
