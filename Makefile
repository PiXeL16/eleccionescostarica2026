# ABOUTME: Makefile for version management and releases
# ABOUTME: Handles versioning, tagging, and deployment workflows

.PHONY: help version-patch version-minor version-major release check-clean check-main

# Default target
help:
	@echo "Elecciones Costa Rica 2026 - Release Management"
	@echo ""
	@echo "Version Bumping:"
	@echo "  make version-patch    Bump patch version (1.2.0 -> 1.2.1)"
	@echo "  make version-minor    Bump minor version (1.2.0 -> 1.3.0)"
	@echo "  make version-major    Bump major version (1.2.0 -> 2.0.0)"
	@echo ""
	@echo "Release:"
	@echo "  make release          Create git tag and push (after version bump)"
	@echo ""
	@echo "Utilities:"
	@echo "  make current-version  Show current version"
	@echo "  make check-clean      Check if working directory is clean"
	@echo "  make check-main       Check if on main branch"
	@echo ""
	@echo "Example workflow:"
	@echo "  make version-minor    # Bumps to 1.3.0, commits"
	@echo "  make release          # Tags v1.3.0 and pushes"

# Get current version from package.json
CURRENT_VERSION := $(shell node -p "require('./web/package.json').version")

# Show current version
current-version:
	@echo "Current version: $(CURRENT_VERSION)"

# Check if working directory is clean
check-clean:
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "Error: Working directory is not clean. Commit or stash changes first."; \
		git status --short; \
		exit 1; \
	fi
	@echo "✓ Working directory is clean"

# Check if on main branch
check-main:
	@BRANCH=$$(git rev-parse --abbrev-ref HEAD); \
	if [ "$$BRANCH" != "main" ]; then \
		echo "Error: Not on main branch (currently on $$BRANCH)"; \
		echo "Switch to main branch first: git checkout main"; \
		exit 1; \
	fi
	@echo "✓ On main branch"

# Bump patch version (1.2.0 -> 1.2.1)
version-patch: check-clean check-main
	@echo "Bumping patch version..."
	@cd web && npm version patch --no-git-tag-version
	@NEW_VERSION=$$(node -p "require('./web/package.json').version"); \
	echo "Version bumped to $$NEW_VERSION"; \
	git add web/package.json; \
	git commit -m "chore: bump version to v$$NEW_VERSION"; \
	echo "✓ Committed version bump to v$$NEW_VERSION"

# Bump minor version (1.2.0 -> 1.3.0)
version-minor: check-clean check-main
	@echo "Bumping minor version..."
	@cd web && npm version minor --no-git-tag-version
	@NEW_VERSION=$$(node -p "require('./web/package.json').version"); \
	echo "Version bumped to $$NEW_VERSION"; \
	git add web/package.json; \
	git commit -m "chore: bump version to v$$NEW_VERSION"; \
	echo "✓ Committed version bump to v$$NEW_VERSION"

# Bump major version (1.2.0 -> 2.0.0)
version-major: check-clean check-main
	@echo "Bumping major version..."
	@cd web && npm version major --no-git-tag-version
	@NEW_VERSION=$$(node -p "require('./web/package.json').version"); \
	echo "Version bumped to $$NEW_VERSION"; \
	git add web/package.json; \
	git commit -m "chore: bump version to v$$NEW_VERSION"; \
	echo "✓ Committed version bump to v$$NEW_VERSION"

# Create release tag and push
release: check-main
	@VERSION=$$(node -p "require('./web/package.json').version"); \
	echo "Creating release for v$$VERSION..."; \
	if git rev-parse "v$$VERSION" >/dev/null 2>&1; then \
		echo "Error: Tag v$$VERSION already exists"; \
		exit 1; \
	fi; \
	git tag -a "v$$VERSION" -m "Release v$$VERSION"; \
	echo "✓ Created tag v$$VERSION"; \
	git push origin main; \
	git push origin "v$$VERSION"; \
	echo "✓ Pushed to origin"; \
	echo ""; \
	echo "🎉 Release v$$VERSION complete!"; \
	echo "View release: https://github.com/PiXeL16/eleccionescostarica2026/releases/tag/v$$VERSION"

# Full release workflow (bump + tag + push) - patch version
release-patch:
	@$(MAKE) version-patch
	@$(MAKE) release

# Full release workflow (bump + tag + push) - minor version
release-minor:
	@$(MAKE) version-minor
	@$(MAKE) release

# Full release workflow (bump + tag + push) - major version
release-major:
	@$(MAKE) version-major
	@$(MAKE) release
