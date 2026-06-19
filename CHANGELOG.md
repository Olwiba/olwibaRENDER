# Changelog


## 0.1.3

### Added

- New `./pro` subpath export (`@olwiba/render/pro`) with `proCatalog`, `proRegistry`, and `proComponentDefinitions` — wired for `@olwiba/ui-pro` components (optional peer dependency `>=0.1.0`).

### Changed

- `@olwiba/ui-pro` added as optional peer dependency.

## 0.1.2

### Changed

- Updated ecosystem package dependencies.

## 0.1.1

### Changed

- Updated ecosystem package dependencies.
- Publish workflow accepts a `tag` input via `workflow_dispatch` for manual republish of a specific release tag.
- Switched to npm OIDC trusted publishing with provenance attestation.

## 0.1.0

### Changed

- Renamed package from `@olwiba/genesis-render` to `@olwiba/render`; primary export is now `RenderPage` instead of `GenesisRenderPage`.
