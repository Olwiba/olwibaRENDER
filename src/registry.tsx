import * as React from 'react';
import { defineRegistry } from '@json-render/react';
import type { BaseComponentProps } from '@json-render/react';
import {
  PageHeader,
  FullPageSpinner,
  GlassCard,
  FeatureCard,
  StatCard,
  TestimonialCard,
  PricingCard,
  ImageCard,
  EmptyState,
  CountUp,
  FadeIn,
  AppContent,
  AppGrid,
  AppGridCell,
  PublicPageFrame,
  Grid,
  GridItem,
  Stack,
  Section,
} from '@olwiba/ui';
import { catalog } from './catalog';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const olwibaComponents = {
  PageHeader: ({ props, children }: BaseComponentProps) => <PageHeader {...(props as any)}>{children}</PageHeader>,
  Spinner: ({ props }: BaseComponentProps) => <FullPageSpinner {...(props as any)} />,
  GlassCard: ({ props, children }: BaseComponentProps) => <GlassCard {...(props as any)}>{children}</GlassCard>,
  FeatureCard: ({ props }: BaseComponentProps) => <FeatureCard {...(props as any)} />,
  StatCard: ({ props }: BaseComponentProps) => <StatCard {...(props as any)} />,
  TestimonialCard: ({ props }: BaseComponentProps) => <TestimonialCard {...(props as any)} />,
  PricingCard: ({ props }: BaseComponentProps) => <PricingCard {...(props as any)} />,
  ImageCard: ({ props, children }: BaseComponentProps) => <ImageCard {...(props as any)}>{children}</ImageCard>,
  EmptyState: ({ props }: BaseComponentProps) => <EmptyState {...(props as any)} />,
  CountUp: ({ props }: BaseComponentProps) => <CountUp {...(props as any)} />,
  FadeIn: ({ props, children }: BaseComponentProps) => <FadeIn {...(props as any)}>{children}</FadeIn>,
  AppContent: ({ props, children }: BaseComponentProps) => <AppContent {...(props as any)}>{children}</AppContent>,
  AppGrid: ({ props, children }: BaseComponentProps) => <AppGrid {...(props as any)}>{children}</AppGrid>,
  AppGridCell: ({ props, children }: BaseComponentProps) => <AppGridCell {...(props as any)}>{children}</AppGridCell>,
  PublicPageFrame: ({ props, children }: BaseComponentProps) => <PublicPageFrame {...(props as any)}>{children}</PublicPageFrame>,
  Grid: ({ props, children }: BaseComponentProps) => <Grid {...(props as any)}>{children}</Grid>,
  GridItem: ({ props, children }: BaseComponentProps) => <GridItem {...(props as any)}>{children}</GridItem>,
  Stack: ({ props, children }: BaseComponentProps) => <Stack {...(props as any)}>{children}</Stack>,
  Section: ({ props, children }: BaseComponentProps) => <Section {...(props as any)}>{children}</Section>,
} as const;
/* eslint-enable @typescript-eslint/no-explicit-any */

export const { registry } = defineRegistry(catalog, {
  components: olwibaComponents,
  actions: {
    navigate: () => {},
  },
});

/**
 * Turns a JSON icon name into a component.
 *
 * JSON specs can only carry strings, so `icon: "Bell"` has to become a React
 * component somewhere. Returning undefined is a normal answer for a name the
 * consumer does not publish — the component falls back to its own default
 * rather than rendering nothing or throwing on a typo in content.
 */
export type IconResolver = (name: string) => React.ComponentType<{ className?: string }> | undefined;

/**
 * Applies an icon resolver to any component whose `icon` prop arrived as a
 * string.
 *
 * Applied across the whole set rather than to FeatureCard alone: several
 * catalog components take an icon, and special-casing one is how the next one
 * ends up replaced wholesale by a consumer.
 */
function withIconResolution(
  components: Record<string, (args: BaseComponentProps) => React.ReactNode>,
  resolveIcon: IconResolver,
) {
  return Object.fromEntries(
    Object.entries(components).map(([name, Component]) => [
      name,
      (args: BaseComponentProps) => {
        const props = args.props as { icon?: unknown } | undefined;
        if (!props || typeof props.icon !== 'string') return Component(args);
        const Icon = resolveIcon(props.icon);
        // Drop an unresolved name entirely so the component's own default
        // icon applies; passing the raw string through would try to render a
        // tag literally called "Bell".
        const { icon: _icon, ...rest } = props;
        return Component({ ...args, props: Icon ? { ...rest, icon: Icon } : rest });
      },
    ]),
  );
}

/**
 * The component set, optionally with icon-name resolution.
 *
 * The supported extension point for JSON-driven icons. Before it, a consumer
 * wanting `icon: "Bell"` had to replace the whole FeatureCard registry entry,
 * which meant re-deriving whatever this package does with it and silently
 * diverging the day that changed.
 */
export function createOlwibaComponents(options?: { resolveIcon?: IconResolver }) {
  return options?.resolveIcon
    ? withIconResolution(olwibaComponents, options.resolveIcon)
    : olwibaComponents;
}
