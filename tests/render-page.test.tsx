import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RenderPage } from '../src/render-page';
import { registry } from '../src/registry';

describe('RenderPage', () => {
  it('renders a simple spec with a registered component', () => {
    const spec = {
      root: 'header-1',
      elements: {
        'header-1': { type: 'PageHeader', props: { title: 'Test Page' }, children: [] },
      },
    };

    render(<RenderPage spec={spec} />);
    expect(screen.getByText('Test Page')).toBeDefined();
  });

  it('renders nested children correctly', () => {
    const spec = {
      root: 'card-1',
      elements: {
        'card-1': { type: 'GlassCard', props: {}, children: ['stat-1'] },
        'stat-1': { type: 'StatCard', props: { label: 'Users', value: '1,234' }, children: [] },
      },
    };

    render(<RenderPage spec={spec} />);
    expect(screen.getByText('Users')).toBeDefined();
    expect(screen.getByText('1,234')).toBeDefined();
  });

  it('accepts custom initial state', () => {
    const spec = {
      root: 'spin-1',
      elements: {
        'spin-1': { type: 'Spinner', props: { size: 'lg' }, children: [] },
      },
    };

    expect(() => render(
      <RenderPage spec={spec} initialState={{ loading: true }} />
    )).not.toThrow();
  });

  it('default registry contains expected component types', () => {
    const expectedTypes = [
      'PageHeader',
      'Spinner',
      'GlassCard',
      'FeatureCard',
      'StatCard',
      'TestimonialCard',
      'PricingCard',
      'ImageCard',
      'EmptyState',
      'CountUp',
      'FadeIn',
    ];

    for (const type of expectedTypes) {
      expect(registry).toHaveProperty(type);
    }
  });

  it('accepts a custom registry override', () => {
    const spec = {
      root: 'header-1',
      elements: {
        'header-1': { type: 'PageHeader', props: { title: 'Custom Registry' }, children: [] },
      },
    };

    expect(() => render(
      <RenderPage spec={spec} registry={registry} />
    )).not.toThrow();
  });

  it('renders an EmptyState with description', () => {
    const spec = {
      root: 'empty-1',
      elements: {
        'empty-1': {
          type: 'EmptyState',
          props: { title: 'Nothing here', description: 'Try adding some items' },
          children: [],
        },
      },
    };

    render(<RenderPage spec={spec} />);
    expect(screen.getByText('Nothing here')).toBeDefined();
    expect(screen.getByText('Try adding some items')).toBeDefined();
  });
});
