import { visit } from 'unist-util-visit';
import type { Root, Link } from 'mdast';
import type { Data } from 'unist';

type LinkData = Data & {
  hProperties?: Record<string, string>;
};

export function remarkExternalLinks() {
  return (tree: Root) => {

    visit(tree, 'link', (node: Link) => {

      const isExternal =
        /^https?:\/\//.test(node.url);

      if (!isExternal) return;

      const data = (node.data ??= {}) as LinkData;

      data.hProperties = {
        ...(data.hProperties || {}),
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    });
  };
}

export default remarkExternalLinks;
