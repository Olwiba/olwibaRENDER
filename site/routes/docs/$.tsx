import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { source } from '~/lib/source';
import browserCollections from 'fumadocs-mdx:collections/browser';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import * as React from 'react';
import { Suspense } from 'react';
import {
  mdxComponents,
  DocsLayout,
  CopyCommandButton,
  extractTextFromReactNode,
  type PageLoaderData,
  type TocItem,
  type SidebarSection,
} from '@olwiba/docs';
import { findNeighbour } from 'fumadocs-core/page-tree';

const sidebarSections: SidebarSection[] = [
  { name: 'Get Started', href: '/docs' },
  { name: 'Blocks', href: '/docs/blocks' },
];

/**
 * What fumadocs-mdx actually attaches to a page, which the generic `PageData`
 * from fumadocs-core does not describe — `source.getPage()` is not
 * parameterised with the MDX collection's type, so the augmented fields are
 * invisible to TypeScript. Narrowed explicitly rather than left to `any`, so
 * a change in what the loader reads is still a type error.
 */
type FumadocsPageData = {
  title: string;
  description?: string;
  toc?: Array<{ title?: React.ReactNode; url: string; depth: number }>;
  getText: (mode: 'raw' | 'processed') => Promise<string>;
};

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? [];
    const data = (await serverLoader({ data: slugs })) as PageLoaderData;
    await clientLoader.preload(data.path);
    return data;
  },
});

const serverLoader = createServerFn({
  method: 'GET',
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    const pageTree = source.getPageTree();
    const neighbours = findNeighbour(pageTree, page.url);
    const pageData = page.data as unknown as FumadocsPageData;
    const rawContent = await pageData.getText('raw');

    return {
      path: page.path,
      url: page.url,
      pageTree: await source.serializePageTree(pageTree),
      frontmatter: {
        title: pageData.title,
        description: pageData.description,
      },
      toc: (pageData.toc ?? []).map((item: { title?: React.ReactNode; url: string; depth: number }) => ({
        title: extractTextFromReactNode(item.title),
        url: item.url,
        depth: item.depth,
      })) as TocItem[],
      rawContent,
      neighbours: {
        previous: neighbours.previous
          ? { url: neighbours.previous.url, name: extractTextFromReactNode(neighbours.previous.name) }
          : null,
        next: neighbours.next
          ? { url: neighbours.next.url, name: extractTextFromReactNode(neighbours.next.name) }
          : null,
      },
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component({ default: MDX }) {
    return (
      <div className="w-full flex-1">
        <MDX
          components={{
            ...defaultMdxComponents,
            ...mdxComponents,
            CopyCommandButton,
          }}
        />
      </div>
    );
  },
});

function Page() {
  const loaderData = Route.useLoaderData() as PageLoaderData;
  const data = useFumadocsLoader(loaderData);

  return (
    <DocsLayout loaderData={loaderData} pageTree={data.pageTree} sections={sidebarSections}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        {clientLoader.useContent(data.path, undefined)}
      </Suspense>
    </DocsLayout>
  );
}
