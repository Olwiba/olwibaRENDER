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
