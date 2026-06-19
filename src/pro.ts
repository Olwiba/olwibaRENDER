import { defineCatalog } from '@json-render/core';
import type { Catalog } from '@json-render/core';
import { schema } from '@json-render/react/schema';
import { defineRegistry } from '@json-render/react';

// Pro component zod definitions — populated as @olwiba/ui-pro ships components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const proComponentDefinitions: Record<string, any> = {};

export const proCatalog: Catalog = defineCatalog(schema, {
  components: proComponentDefinitions,
  actions: {},
}) as unknown as Catalog;

// Pro React wrappers — import from @olwiba/ui-pro and wire here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const proComponents: Record<string, any> = {};

export const { registry: proRegistry } = defineRegistry(proCatalog, {
  components: proComponents,
  actions: {},
});
