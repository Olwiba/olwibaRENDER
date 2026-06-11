import { Renderer, StateProvider, ActionProvider, VisibilityProvider } from '@json-render/react';
import { registry as defaultRegistry } from './registry';

export interface RenderPageProps {
  spec: any;
  registry?: typeof defaultRegistry;
  onAction?: Record<string, (params?: any) => void>;
  initialState?: Record<string, unknown>;
}

export function RenderPage({ spec, registry, onAction, initialState = {} }: RenderPageProps) {
  const mergedRegistry = registry ?? defaultRegistry;
  return (
    <StateProvider initialState={initialState}>
      <ActionProvider handlers={onAction ?? {}}>
        <VisibilityProvider>
          <Renderer spec={spec} registry={mergedRegistry} />
        </VisibilityProvider>
      </ActionProvider>
    </StateProvider>
  );
}
