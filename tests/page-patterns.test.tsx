import * as React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import {
  useStateStore,
  useStateValue,
  type BaseComponentProps,
} from '@json-render/react';
import { z } from 'zod';
import { describe, expect, it, vi } from 'vitest';
import { registry } from '../src/registry';
import { createProRegistry } from '../src/pro';
import {
  PAGE_PATTERN_NAMES,
  PagePatternDefinitionError,
  createPagePatternRenderer,
  parsePagePatternDefinition,
  type PagePatternComponents,
  type PagePatternName,
} from '../src/page-patterns';

const slotsByPattern = {
  ContentPage: ['content', 'actions'],
  SettingsPage: ['content', 'navigation', 'actions', 'footer'],
  CollectionPage: ['content', 'toolbar', 'actions', 'footer'],
  DetailPage: ['content', 'navigation', 'status', 'actions', 'metadata'],
  DashboardPage: ['content', 'summary', 'actions'],
  FocusPage: ['content', 'actions', 'footer'],
  FlowPage: ['content', 'progress', 'actions', 'aside'],
} as const satisfies Record<PagePatternName, readonly string[]>;

function createPatternStub(pattern: PagePatternName) {
  const PatternStub = (props: Record<string, React.ReactNode>) => (
    <section data-testid={pattern}>
      <h1>{props.title}</h1>
      {slotsByPattern[pattern].map((slot) => (
        <div key={slot} data-testid={`${pattern}-${slot}`}>
          {slot === 'content' ? props.children : props[slot]}
        </div>
      ))}
    </section>
  );

  PatternStub.displayName = `${pattern}Stub`;
  return PatternStub;
}

const pagePatternComponents = Object.fromEntries(
  PAGE_PATTERN_NAMES.map((pattern) => [pattern, createPatternStub(pattern)]),
) as PagePatternComponents;

const PagePatternRenderer = createPagePatternRenderer(pagePatternComponents);

function makeDefinition(pattern: PagePatternName) {
  const slots = Object.fromEntries(
    slotsByPattern[pattern].map((slot) => [slot, `${slot}-root`]),
  );
  const elements = Object.fromEntries(
    slotsByPattern[pattern].map((slot) => [
      `${slot}-root`,
      {
        type: 'EmptyState',
        props: { title: `${pattern}-${slot}-content` },
        children: [],
      },
    ]),
  );

  return {
    schemaVersion: 1,
    pattern,
    props: {
      title: `${pattern} title`,
      ...(pattern === 'FlowPage' ? { layout: 'split' } : {}),
    },
    slots,
    elements,
  };
}

describe('Page Pattern definition schema', () => {
  it.each(PAGE_PATTERN_NAMES)('accepts %s with its sanctioned slots', (pattern) => {
    expect(() => parsePagePatternDefinition(makeDefinition(pattern), registry)).not.toThrow();
  });

  it.each([
    ['unknown schema version', { ...makeDefinition('ContentPage'), schemaVersion: 2 }],
    ['unknown pattern', { ...makeDefinition('ContentPage'), pattern: 'WorkspacePage' }],
    [
      'unknown pattern prop',
      {
        ...makeDefinition('ContentPage'),
        props: { title: 'Title', className: 'p-12' },
      },
    ],
    [
      'unknown semantic slot',
      {
        ...makeDefinition('ContentPage'),
        slots: { content: 'content-root', sidebar: 'actions-root' },
      },
    ],
    [
      'missing slot root',
      {
        ...makeDefinition('ContentPage'),
        slots: { content: 'missing-root' },
      },
    ],
    [
      'missing child root',
      {
        ...makeDefinition('ContentPage'),
        elements: {
          'content-root': {
            type: 'EmptyState',
            props: { title: 'Content' },
            children: ['missing-child'],
          },
        },
        slots: { content: 'content-root' },
      },
    ],
    [
      'aside on a centered flow',
      {
        ...makeDefinition('FlowPage'),
        props: { title: 'Flow', layout: 'centered' },
      },
    ],
  ])('rejects %s', (_name, definition) => {
    expect(() => parsePagePatternDefinition(definition)).toThrow(PagePatternDefinitionError);
  });

  it('rejects element component types missing from the supplied registry', () => {
    const definition = makeDefinition('ContentPage');
    definition.elements['content-root'].type = 'UnknownBlock';

    expect(() => parsePagePatternDefinition(definition, registry)).toThrow(
      'unknown component type "UnknownBlock"',
    );
  });
});

describe('Page Pattern renderer', () => {
  it.each(PAGE_PATTERN_NAMES)('maps every %s root into its canonical slot', (pattern) => {
    render(<PagePatternRenderer definition={makeDefinition(pattern)} />);

    expect(screen.getByRole('heading', { name: `${pattern} title` })).toBeDefined();
    for (const slot of slotsByPattern[pattern]) {
      expect(
        within(screen.getByTestId(`${pattern}-${slot}`)).getByText(
          `${pattern}-${slot}-content`,
        ),
      ).toBeDefined();
    }
  });

  it('fails clearly when the consumer does not inject all seven patterns', () => {
    expect(() => createPagePatternRenderer({ ContentPage: createPatternStub('ContentPage') })).toThrow(
      'Missing injected Page Pattern components',
    );
  });

  it('shares one state provider across semantic slots', () => {
    const stateRegistry = createProRegistry(
      {
        StateReader: {
          props: z.object({ path: z.string() }),
          description: 'Read a test state value',
        },
        StateIncrement: {
          props: z.object({ path: z.string() }),
          description: 'Increment a test state value',
        },
      },
      {
        StateReader: ({ props }: BaseComponentProps<{ path: string }>) => {
          const value = useStateValue<number>(props.path);
          return <output>{value}</output>;
        },
        StateIncrement: ({ props }: BaseComponentProps<{ path: string }>) => {
          const state = useStateStore();
          return (
            <button
              type="button"
              onClick={() => state.set(props.path, Number(state.get(props.path) ?? 0) + 1)}
            >
              Increment
            </button>
          );
        },
      },
    );

    const definition = {
      schemaVersion: 1,
      pattern: 'ContentPage',
      props: { title: 'Shared state' },
      slots: { content: 'reader', actions: 'increment' },
      elements: {
        reader: { type: 'StateReader', props: { path: '/count' }, children: [] },
        increment: { type: 'StateIncrement', props: { path: '/count' }, children: [] },
      },
    };

    render(
      <PagePatternRenderer
        definition={definition}
        registry={stateRegistry}
        initialState={{ count: 0 }}
      />,
    );

    expect(screen.getByText('0')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByText('1')).toBeDefined();
  });

  it('shares one action provider across semantic slots', async () => {
    const actionRegistry = createProRegistry(
      {
        ActionButton: {
          props: z.object({ label: z.string() }),
          description: 'Emit a test action',
        },
      },
      {
        ActionButton: ({ props, emit }: BaseComponentProps<{ label: string }>) => (
          <button type="button" onClick={() => emit('press')}>
            {props.label}
          </button>
        ),
      },
    );
    const onRecord = vi.fn();
    const definition = {
      schemaVersion: 1,
      pattern: 'ContentPage',
      props: { title: 'Shared actions' },
      slots: { content: 'body', actions: 'action' },
      elements: {
        body: { type: 'EmptyState', props: { title: 'Body' }, children: [] },
        action: {
          type: 'ActionButton',
          props: { label: 'Run action' },
          children: [],
          on: { press: { action: 'record', params: { source: 'actions-slot' } } },
        },
      },
    };

    render(
      <PagePatternRenderer
        definition={definition}
        registry={actionRegistry}
        onAction={{ record: onRecord }}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Run action' }));
    });
    expect(onRecord).toHaveBeenCalledWith({ source: 'actions-slot' });
  });
});

describe('base entry point', () => {
  it('remains importable without loading the optional Pro adapter', async () => {
    const base = await import('../src/index');
    expect(base.RenderPage).toBeDefined();
    expect(base).not.toHaveProperty('createPagePatternRenderer');
  });
});
