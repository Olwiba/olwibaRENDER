import { DocsHeader } from '@olwiba/docs';

const navItems = [
  { label: 'Docs', href: '/docs' },
  { label: 'Blocks', href: '/docs/blocks' },
];

export function SiteHeader() {
  return (
    <DocsHeader
      logo={<>@olwiba/<span className="text-primary">render</span></>}
      navItems={navItems}
      githubUrl="https://github.com/Olwiba/olwibaRENDER"
      githubBadge="soon"
    />
  );
}
