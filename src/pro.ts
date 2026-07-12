import { defineCatalog } from '@json-render/core';
import type { Catalog } from '@json-render/core';
import { schema } from '@json-render/react/schema';
import { defineRegistry } from '@json-render/react';
import { olwibaComponentDefinitions } from './catalog';
import { olwibaComponents } from './registry';

/**
 * Merge base olwibaUI components with Pro components into a single registry.
 * Call this only if you have @olwiba/ui-pro installed — define catalog entries
 * and wrappers for the Pro components you use, then pass them here.
 *
 * @example
 * import { createProRegistry } from '@olwiba/render/pro'
 * import { proComponentDefinitions, proComponents } from './pro-catalog'
 * const registry = createProRegistry(proComponentDefinitions, proComponents)
 * <RenderPage spec={spec} registry={registry} />
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createProRegistry(
  proComponentDefs: Record<string, any>,
  proComps: Record<string, any>
) {
  const mergedCatalog = defineCatalog(schema, {
    components: { ...olwibaComponentDefinitions, ...proComponentDefs },
    actions: { navigate: { description: 'Navigate to a route' } },
  }) as unknown as Catalog;

  return defineRegistry(mergedCatalog, {
    components: { ...olwibaComponents, ...proComps },
    actions: { navigate: () => {} },
  }).registry;
}
