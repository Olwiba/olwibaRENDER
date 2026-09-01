import * as React from "react";
import type { Spec } from "@json-render/core";
import {
  ActionProvider,
  Renderer,
  StateProvider,
  VisibilityProvider,
  type ComponentRegistry,
} from "@json-render/react";
import { z } from "zod";
import { registry as defaultRegistry } from "./registry";

export const PAGE_PATTERN_NAMES = [
  "ContentPage",
  "SettingsPage",
  "CollectionPage",
  "DetailPage",
  "DashboardPage",
  "FocusPage",
  "FlowPage",
] as const;

export type PagePatternName = (typeof PAGE_PATTERN_NAMES)[number];

const commonPropsSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    eyebrow: z.string().optional(),
  })
  .strict();

const elementSchema = z
  .object({
    type: z.string().min(1),
    props: z.record(z.unknown()),
    children: z.array(z.string().min(1)).optional(),
    visible: z.unknown().optional(),
    on: z.record(z.unknown()).optional(),
    repeat: z.unknown().optional(),
    watch: z.record(z.unknown()).optional(),
  })
  .strict();

const elementsSchema = z.record(elementSchema);

const contentSlotsSchema = z
  .object({
    content: z.string().min(1),
    actions: z.string().min(1).optional(),
  })
  .strict();

const settingsSlotsSchema = z
  .object({
    content: z.string().min(1),
    navigation: z.string().min(1).optional(),
    actions: z.string().min(1).optional(),
    footer: z.string().min(1).optional(),
  })
  .strict();

const collectionSlotsSchema = z
  .object({
    content: z.string().min(1),
    toolbar: z.string().min(1).optional(),
    actions: z.string().min(1).optional(),
    footer: z.string().min(1).optional(),
  })
  .strict();

const detailSlotsSchema = z
  .object({
    content: z.string().min(1),
    navigation: z.string().min(1).optional(),
    status: z.string().min(1).optional(),
    actions: z.string().min(1).optional(),
    metadata: z.string().min(1).optional(),
  })
  .strict();

const dashboardSlotsSchema = z
  .object({
    content: z.string().min(1),
    summary: z.string().min(1).optional(),
    actions: z.string().min(1).optional(),
  })
  .strict();

const focusSlotsSchema = z
  .object({
    content: z.string().min(1),
    actions: z.string().min(1).optional(),
    footer: z.string().min(1).optional(),
  })
  .strict();

const flowPropsSchema = commonPropsSchema.extend({
  layout: z.enum(["centered", "split"]).optional(),
});

const flowSlotsSchema = z
  .object({
    content: z.string().min(1),
    progress: z.string().min(1).optional(),
    actions: z.string().min(1).optional(),
    aside: z.string().min(1).optional(),
  })
  .strict();

function definitionSchema<
  TPattern extends PagePatternName,
  TProps extends z.ZodTypeAny,
  TSlots extends z.ZodTypeAny,
>(pattern: TPattern, props: TProps, slots: TSlots) {
  return z
    .object({
      schemaVersion: z.literal(1),
      pattern: z.literal(pattern),
      props,
      slots,
      elements: elementsSchema,
    })
    .strict();
}

const structuralPagePatternDefinitionSchema = z.discriminatedUnion("pattern", [
  definitionSchema("ContentPage", commonPropsSchema, contentSlotsSchema),
  definitionSchema("SettingsPage", commonPropsSchema, settingsSlotsSchema),
  definitionSchema("CollectionPage", commonPropsSchema, collectionSlotsSchema),
  definitionSchema("DetailPage", commonPropsSchema, detailSlotsSchema),
  definitionSchema("DashboardPage", commonPropsSchema, dashboardSlotsSchema),
  definitionSchema("FocusPage", commonPropsSchema, focusSlotsSchema),
  definitionSchema("FlowPage", flowPropsSchema, flowSlotsSchema),
]);

export const pagePatternDefinitionSchema = structuralPagePatternDefinitionSchema.superRefine(
  (definition, context) => {
    for (const [slot, root] of Object.entries(definition.slots)) {
      if (root && !definition.elements[root]) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["slots", slot],
          message: `Slot root "${root}" does not exist in elements`,
        });
      }
    }

    for (const [elementId, element] of Object.entries(definition.elements)) {
      for (const childId of element.children ?? []) {
        if (!definition.elements[childId]) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["elements", elementId, "children"],
            message: `Child "${childId}" does not exist in elements`,
          });
        }
      }
    }

    if (
      definition.pattern === "FlowPage" &&
      definition.slots.aside &&
      definition.props.layout !== "split"
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["slots", "aside"],
        message: 'FlowPage aside is only valid when layout is "split"',
      });
    }
  },
);

export type PagePatternDefinition = z.infer<typeof pagePatternDefinitionSchema>;

export type PagePatternComponents = Record<PagePatternName, React.ElementType>;

export interface PagePatternRendererProps {
  definition: unknown;
  registry?: ComponentRegistry;
  onAction?: Record<string, (params: Record<string, unknown>) => Promise<unknown> | unknown>;
  initialState?: Record<string, unknown>;
}

export class PagePatternDefinitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PagePatternDefinitionError";
  }
}

export function parsePagePatternDefinition(
  input: unknown,
  componentRegistry?: ComponentRegistry,
): PagePatternDefinition {
  const result = pagePatternDefinitionSchema.safeParse(input);

  if (!result.success) {
    throw new PagePatternDefinitionError(result.error.issues[0]?.message ?? "Invalid Page Pattern");
  }

  if (componentRegistry) {
    for (const [elementId, element] of Object.entries(result.data.elements)) {
      if (!componentRegistry[element.type]) {
        throw new PagePatternDefinitionError(
          `Element "${elementId}" uses unknown component type "${element.type}"`,
        );
      }
    }
  }

  return result.data;
}

function assertPagePatternComponents(
  components: Partial<PagePatternComponents>,
): asserts components is PagePatternComponents {
  const missing = PAGE_PATTERN_NAMES.filter((name) => !components[name]);

  if (missing.length > 0) {
    throw new PagePatternDefinitionError(
      `Missing injected Page Pattern components: ${missing.join(", ")}`,
    );
  }
}

export function createPagePatternRenderer(components: Partial<PagePatternComponents>) {
  assertPagePatternComponents(components);

  function PagePatternRenderer({
    definition: input,
    registry = defaultRegistry,
    onAction,
    initialState = {},
  }: PagePatternRendererProps) {
    const definition = parsePagePatternDefinition(input, registry);
    const PagePattern = components[definition.pattern]!;
    const specElements = definition.elements as Spec["elements"];

    const renderSlot = (slot: string): React.ReactNode => {
      const root = (definition.slots as Record<string, string | undefined>)[slot];
      if (!root) return undefined;

      return <Renderer spec={{ root, elements: specElements }} registry={registry} />;
    };

    const commonProps = {
      ...definition.props,
      actions: renderSlot("actions"),
      children: renderSlot("content"),
    };

    let patternProps: Record<string, unknown> = commonProps;

    switch (definition.pattern) {
      case "SettingsPage":
        patternProps = {
          ...commonProps,
          navigation: renderSlot("navigation"),
          footer: renderSlot("footer"),
        };
        break;
      case "CollectionPage":
        patternProps = {
          ...commonProps,
          toolbar: renderSlot("toolbar"),
          footer: renderSlot("footer"),
        };
        break;
      case "DetailPage":
        patternProps = {
          ...commonProps,
          navigation: renderSlot("navigation"),
          status: renderSlot("status"),
          metadata: renderSlot("metadata"),
        };
        break;
      case "DashboardPage":
        patternProps = { ...commonProps, summary: renderSlot("summary") };
        break;
      case "FocusPage":
        patternProps = { ...commonProps, footer: renderSlot("footer") };
        break;
      case "FlowPage":
        patternProps = {
          ...commonProps,
          progress: renderSlot("progress"),
          aside: renderSlot("aside"),
        };
        break;
    }

    return (
      <StateProvider initialState={initialState}>
        <ActionProvider handlers={onAction ?? {}}>
          <VisibilityProvider>{React.createElement(PagePattern, patternProps)}</VisibilityProvider>
        </ActionProvider>
      </StateProvider>
    );
  }

  PagePatternRenderer.displayName = "PagePatternRenderer";
  return PagePatternRenderer;
}
