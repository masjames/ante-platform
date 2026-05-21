export type SiteConfig = {
  name: string;
  domain?: string;
  description?: string;
  logo?: string;
  navigation: NavigationItem[];
  socialLinks?: Record<string, string>;
};

export type NavigationItem = {
  label: string;
  href: string;
};

export type Page = {
  title: string;
  slug: string;
  body: string;
  seoTitle?: string;
  seoDescription?: string;
  status: "draft" | "published";
};

export type Post = {
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  author?: string;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  status: "draft" | "published";
};

export type Category = {
  name: string;
  slug: string;
  description?: string;
};

export type Membership = {
  title: string;
  description: string;
  benefits: string[];
  antepEmbed?: string;
};

export type SponsorSlot = {
  name: string;
  placement: "home_top" | "home_middle" | "article_top" | "article_bottom" | "sidebar";
  image?: string;
  targetUrl?: string;
  startDate?: string;
  endDate?: string;
};
