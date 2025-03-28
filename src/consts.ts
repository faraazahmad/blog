import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Faraaz\'s Blog',
  locale: 'en-US',
  description:
    '',
  href: 'https://faraazahmad.github.io/blog',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog/blog',
    label: 'blog',
  },
  {
    href: '/blog/authors',
    label: 'authors',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/jktrn',
    label: 'GitHub',
  },
  {
    href: 'https://twitter.com/Faraaz98',
    label: 'Twitter',
  },
  {
    href: 'mailto:faraaz98@live.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
