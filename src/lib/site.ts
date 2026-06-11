export interface SiteConfig {
  /** 站点名称，显示在标题栏、页脚等 */
  name: string;
  /** SEO 描述 */
  description: string;
  /** 首页横幅主标题 */
  heroTitle: string;
  /** 首页横幅副标题（不含统计数据） */
  heroSubtitle: string;
  /** Logo 角标文字，建议 1～3 个字符 */
  logo: string;
  /** 页脚文案 */
  footer: string;
  /** 前台是否显示「管理」入口（默认隐藏，管理员直接访问 /admin） */
  showAdminLink: boolean;
}

export function getSiteConfig(): SiteConfig {
  return {
    name: process.env.SITE_NAME ?? "资源导航",
    description:
      process.env.SITE_DESCRIPTION ??
      "精选优质网站与工具，分类整理，一站直达",
    heroTitle: process.env.SITE_HERO_TITLE ?? "优质资源，一站收齐",
    heroSubtitle:
      process.env.SITE_HERO_SUBTITLE ??
      "按主题分类整理链接，支持搜索与后台管理，开箱即用",
    logo: process.env.SITE_LOGO ?? "Nav",
    footer: process.env.SITE_FOOTER ?? "资源导航 · 基于 Next.js 构建",
    showAdminLink:
      process.env.SHOW_ADMIN_LINK === "true" ||
      (process.env.SHOW_ADMIN_LINK !== "false" &&
        process.env.NODE_ENV === "development"),
  };
}
