# Changelog









## 0.1.10

No user-facing changes.

## 0.1.9

No user-facing changes.

## 0.1.8

### Added

- `createOlwibaComponents({ resolveIcon })` — the supported way to turn a JSON `icon: "Bell"` string into a React component. A JSON spec can only carry strings, so previously a consumer wanting icons had to replace the whole `FeatureCard` registry entry, re-deriving whatever this package does with it and silently diverging when that changed.
- `IconResolver` type export: `(name: string) => React.ComponentType<{ className?: string }> | undefined`.

### Changed

- Icon resolution applies to every catalog component whose `icon` prop arrived as a string, not `FeatureCard` alone — several components take an icon, and special-casing one is how the next one gets replaced wholesale.
- An unresolved icon name drops the prop instead of passing the string through, so the component's own default icon applies rather than React rendering a tag literally called `Bell`. Returning `undefined` from `resolveIcon` is a normal answer — content is where typos live.
- `olwibaComponents` is unchanged and still exported; existing usage is unaffected.

## 0.1.7

### Added

- Add JSON page pattern adapters

### Changed

- Report package releases to OPS_WEBHOOK_RELEASES
- Rename DISCORD_WEBHOOK_URL to OPS_WEBHOOK_DEPLOYS
- Fix createProRegistry example to not import nonexistent ui-pro exports
- Gate installs behind 7-day minimum release age
- Bump @olwiba/docs to 0.1.31; regenerate standalone bun.lock
- Resolve dev port via @olwiba/dx resolveDevPort

### Fixed

- Authenticate GitHub Packages publish

## 0.1.6

### Fixed

- **CI:** Replaced `workspace:*` protocol references in `package.json` with pinned npm versions (`@olwiba/cn`, `@olwiba/docs`, `@olwiba/ui`, `@olwiba/dx`). `bun --frozen-lockfile` was rejecting workspace refs during CI install outside the monorepo workspace tree.

## 0.1.5

### Changed

- **Breaking:** `@olwiba/render/pro` no longer exports `proCatalog`, `proRegistry`, `proComponentDefinitions`, or `proComponents`. Those were empty stubs with no Pro components bundled.
- Replaced with `createProRegistry(proComponentDefs, proComps)` — a helper that merges the base olwibaUI registry with your Pro components from `@olwiba/ui-pro`. Pro component definitions stay entirely in `@olwiba/ui-pro`; nothing Pro-specific ships in this package.

### Migration

## 0.1.4

No user-facing changes.

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
