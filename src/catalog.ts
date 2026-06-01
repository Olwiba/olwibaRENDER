import { defineCatalog } from '@json-render/core';
import type { Catalog } from '@json-render/core';
import { schema } from '@json-render/react/schema';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const olwibaComponentDefinitions: Record<string, any> = {
  PageHeader: {
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Page title with optional description',
    slots: ['default'],
  },
  Spinner: {
    props: z.object({
      className: z.string().optional(),
      size: z.enum(['sm', 'md', 'lg']).optional(),
    }),
    description: 'Loading spinner',
  },
  GlassCard: {
    props: z.object({
      blur: z.enum(['sm', 'md', 'lg']).optional(),
      className: z.string().optional(),
    }),
    description: 'Frosted glass card container',
    slots: ['default'],
  },
  FeatureCard: {
    props: z.object({
      title: z.string(),
      description: z.string(),
      href: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Feature highlight card with icon and optional link',
  },
  StatCard: {
    props: z.object({
      value: z.string(),
      label: z.string(),
      delta: z.string().optional(),
      trend: z.enum(['up', 'down', 'neutral']).optional(),
      description: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Stat metric card with optional trend indicator',
  },
  TestimonialCard: {
    props: z.object({
      quote: z.string(),
      name: z.string(),
      role: z.string(),
      company: z.string().optional(),
      avatar: z.string().optional(),
      initials: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Testimonial quote with author attribution',
  },
  PricingCard: {
    props: z.object({
      name: z.string(),
      price: z.string(),
      period: z.string().optional(),
      description: z.string(),
      features: z.array(z.object({ label: z.string(), included: z.boolean() })),
      cta: z.string(),
      highlighted: z.boolean().optional(),
      badge: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Pricing tier card with feature list and CTA',
  },
  ImageCard: {
    props: z.object({
      src: z.string(),
      alt: z.string().optional(),
      overlay: z.enum(['none', 'subtle', 'strong']).optional(),
      aspectRatio: z.enum(['video', 'square', 'portrait', 'auto']).optional(),
      className: z.string().optional(),
    }),
    description: 'Image card with optional overlay',
    slots: ['default'],
  },
  EmptyState: {
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Empty state placeholder with title and description',
  },
  CountUp: {
    props: z.object({
      from: z.number().optional(),
      to: z.number(),
      duration: z.number().optional(),
      decimals: z.number().optional(),
      prefix: z.string().optional(),
      suffix: z.string().optional(),
      once: z.boolean().optional(),
      className: z.string().optional(),
    }),
    description: 'Animated number counter',
  },
  FadeIn: {
    props: z.object({
      delay: z.number().optional(),
      duration: z.number().optional(),
      direction: z.enum(['up', 'down', 'left', 'right', 'none']).optional(),
      once: z.boolean().optional(),
      className: z.string().optional(),
    }),
    description: 'Fade-in animation wrapper',
    slots: ['default'],
  },
  AppContent: {
    props: z.object({
      spacing: z.enum(['sm', 'md', 'lg']).optional(),
      maxWidth: z.enum(['none', 'screen-lg', 'screen-xl', 'screen-2xl']).optional(),
      className: z.string().optional(),
    }),
    description: 'App page content wrapper for content rendered inside AppShell.',
    slots: ['default'],
  },
  AppGrid: {
    props: z.object({
      columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
      gap: z.enum(['sm', 'md', 'lg']).optional(),
      className: z.string().optional(),
    }),
    description: 'Responsive app content grid. Use for dashboard cards, settings panels, and billing cards.',
    slots: ['default'],
  },
  AppGridCell: {
    props: z.object({
      span: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal('full')]).optional(),
      className: z.string().optional(),
    }),
    description: 'Optional app grid cell wrapper for cards that need custom column spans.',
    slots: ['default'],
  },
  PublicPageFrame: {
    props: z.object({
      surface: z.enum(['default', 'muted']).optional(),
      spacing: z.enum(['sm', 'md', 'lg']).optional(),
      maxWidth: z.enum(['none', 'screen-xl', 'screen-2xl']).optional(),
      className: z.string().optional(),
    }),
    description: 'Public page frame for marketing, content, blog, changelog, docs, and contact pages.',
    slots: ['default'],
  },
  Grid: {
    props: z.object({
      columns: z.union([
        z.literal(1), z.literal(2), z.literal(3), z.literal(4),
        z.literal(5), z.literal(6), z.literal(12),
      ]).optional(),
      gap: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl']).optional(),
      className: z.string().optional(),
    }),
    description: 'CSS grid container. Wrap children in GridItem to control column spans.',
    slots: ['default'],
  },
  GridItem: {
    props: z.object({
      span: z.union([
        z.literal(1), z.literal(2), z.literal(3), z.literal(4),
        z.literal(5), z.literal(6), z.literal(7), z.literal(8),
        z.literal(9), z.literal(10), z.literal(11), z.literal(12),
      ]).optional(),
      rowSpan: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
      className: z.string().optional(),
    }),
    description: 'Grid cell wrapper. Controls how many columns a child block occupies.',
    slots: ['default'],
  },
  Stack: {
    props: z.object({
      direction: z.enum(['col', 'row']).optional(),
      gap: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl']).optional(),
      align: z.enum(['start', 'center', 'end', 'stretch']).optional(),
      justify: z.enum(['start', 'center', 'end', 'between', 'around']).optional(),
      wrap: z.boolean().optional(),
      className: z.string().optional(),
    }),
    description: 'Flex container for stacking blocks vertically or horizontally.',
    slots: ['default'],
  },
  Section: {
    props: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      padding: z.enum(['none', 'sm', 'md', 'lg']).optional(),
      className: z.string().optional(),
    }),
    description: 'Page section wrapper with optional heading and description. Use as root container for a page region.',
    slots: ['default'],
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const catalog: Catalog = defineCatalog(schema, {
  components: olwibaComponentDefinitions,
  actions: {
    navigate: { description: 'Navigate to a route' },
  },
}) as unknown as Catalog;
