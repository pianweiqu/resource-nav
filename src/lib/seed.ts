export interface SeedResource {
  title: string;
  url: string;
  description?: string;
}

export interface SeedCategory {
  name: string;
  slug: string;
  children?: SeedCategory[];
  resources?: SeedResource[];
}

// 通用演示数据，可在后台自由增删改；删除 data/app.db 后重启可恢复为初始数据
export const seedData: SeedCategory[] = [
  {
    name: "常用工具",
    slug: "tools",
    children: [
      {
        name: "效率办公",
        slug: "productivity",
        resources: [
          { title: "Notion", url: "https://www.notion.so/", description: "笔记、文档与项目管理一体化" },
          { title: "飞书", url: "https://www.feishu.cn/", description: "团队协作与在线文档" },
          { title: "语雀", url: "https://www.yuque.com/", description: "结构化知识库与文档协作" },
          { title: "Todoist", url: "https://todoist.com/", description: "跨平台任务与待办管理" },
          { title: "Calendly", url: "https://calendly.com/", description: "在线预约与日程安排" },
        ],
      },
      {
        name: "开发辅助",
        slug: "dev-tools",
        resources: [
          { title: "GitHub", url: "https://github.com/", description: "代码托管与开源社区" },
          { title: "Vercel", url: "https://vercel.com/", description: "前端部署与 Serverless 平台" },
          { title: "Postman", url: "https://www.postman.com/", description: "API 调试与接口文档" },
          { title: "Raycast", url: "https://www.raycast.com/", description: "macOS 启动器与效率扩展" },
          { title: "Excalidraw", url: "https://excalidraw.com/", description: "手绘风格白板与示意图" },
        ],
      },
      {
        name: "在线转换",
        slug: "converters",
        resources: [
          { title: "TinyPNG", url: "https://tinypng.com/", description: "图片压缩与体积优化" },
          { title: "CloudConvert", url: "https://cloudconvert.com/", description: "多格式文件在线转换" },
          { title: "SVGOMG", url: "https://jakearchibald.github.io/svgomg/", description: "SVG 优化与精简" },
        ],
      },
    ],
  },
  {
    name: "开发资源",
    slug: "development",
    children: [
      {
        name: "文档与手册",
        slug: "docs",
        resources: [
          { title: "MDN Web Docs", url: "https://developer.mozilla.org/", description: "Web 技术权威参考文档" },
          { title: "React", url: "https://react.dev/", description: "React 官方文档与教程" },
          { title: "Next.js", url: "https://nextjs.org/docs", description: "Next.js 框架文档" },
          { title: "TypeScript", url: "https://www.typescriptlang.org/docs/", description: "TypeScript 语言手册" },
          { title: "Node.js", url: "https://nodejs.org/docs", description: "Node.js 官方 API 文档" },
        ],
      },
      {
        name: "UI 组件库",
        slug: "ui-libraries",
        resources: [
          { title: "shadcn/ui", url: "https://ui.shadcn.com/", description: "可复制的 React 组件集合" },
          { title: "Radix UI", url: "https://www.radix-ui.com/", description: "无样式、可访问的基础组件" },
          { title: "Tailwind CSS", url: "https://tailwindcss.com/", description: "实用优先的 CSS 框架" },
          { title: "Ant Design", url: "https://ant.design/", description: "企业级 React UI 组件库" },
        ],
      },
      {
        name: "AI 与 API",
        slug: "ai-apis",
        resources: [
          { title: "OpenAI", url: "https://platform.openai.com/", description: "大模型 API 与开发者平台" },
          { title: "Hugging Face", url: "https://huggingface.co/", description: "开源模型与数据集社区" },
          { title: "Supabase", url: "https://supabase.com/", description: "开源 Firebase 替代方案" },
        ],
      },
    ],
  },
  {
    name: "设计资源",
    slug: "design",
    children: [
      {
        name: "图标与插画",
        slug: "icons",
        resources: [
          { title: "Lucide", url: "https://lucide.dev/", description: "简洁一致的开源图标库" },
          { title: "Heroicons", url: "https://heroicons.com/", description: "Tailwind 团队出品的 SVG 图标" },
          { title: "unDraw", url: "https://undraw.co/", description: "可自定义颜色的免费插画" },
          { title: "Icons8", url: "https://icons8.com/", description: "图标、插画与素材集合" },
        ],
      },
      {
        name: "字体与配色",
        slug: "fonts-colors",
        resources: [
          { title: "Google Fonts", url: "https://fonts.google.com/", description: "免费 Web 字体库" },
          { title: "Coolors", url: "https://coolors.co/", description: "配色方案生成与浏览" },
          { title: "Fontshare", url: "https://www.fontshare.com/", description: "高质量免费商用字体" },
        ],
      },
      {
        name: "灵感参考",
        slug: "inspiration",
        resources: [
          { title: "Dribbble", url: "https://dribbble.com/", description: "设计师作品展示社区" },
          { title: "Behance", url: "https://www.behance.net/", description: "创意作品集平台" },
          { title: "Awwwards", url: "https://www.awwwards.com/", description: "优秀网页设计评选" },
          { title: "Mobbin", url: "https://mobbin.com/", description: "移动应用 UI 设计参考" },
        ],
      },
    ],
  },
  {
    name: "学习社区",
    slug: "community",
    resources: [
      { title: "Stack Overflow", url: "https://stackoverflow.com/", description: "程序员问答社区" },
      { title: "Dev.to", url: "https://dev.to/", description: "开发者博客与讨论" },
      { title: "掘金", url: "https://juejin.cn/", description: "中文技术社区与专栏" },
      { title: "V2EX", url: "https://www.v2ex.com/", description: "创意工作者社区" },
      { title: "Product Hunt", url: "https://www.producthunt.com/", description: "每日新产品发现" },
      { title: "Hacker News", url: "https://news.ycombinator.com/", description: "创业与技术资讯聚合" },
    ],
  },
  {
    name: "在线课程",
    slug: "courses",
    resources: [
      { title: "Coursera", url: "https://www.coursera.org/", description: "全球名校在线课程" },
      { title: "Udemy", url: "https://www.udemy.com/", description: "实用技能视频课程" },
      { title: "freeCodeCamp", url: "https://www.freecodecamp.org/", description: "免费编程学习路径" },
      { title: "慕课网", url: "https://www.imooc.com/", description: "中文 IT 技能在线学习" },
    ],
  },
  {
    name: "新闻资讯",
    slug: "news",
    children: [
      {
        name: "科技媒体",
        slug: "tech-news",
        resources: [
          { title: "TechCrunch", url: "https://techcrunch.com/", description: "创业与科技新闻报道" },
          { title: "The Verge", url: "https://www.theverge.com/", description: "科技、文化与产品评测" },
          { title: "36氪", url: "https://36kr.com/", description: "中国创投与科技商业媒体" },
          { title: "少数派", url: "https://sspai.com/", description: "数字生活技巧与工具推荐" },
        ],
      },
      {
        name: "综合资讯",
        slug: "general-news",
        resources: [
          { title: "Reuters", url: "https://www.reuters.com/", description: "国际新闻通讯社" },
          { title: "BBC News", url: "https://www.bbc.com/news", description: "英国广播公司新闻" },
          { title: "澎湃新闻", url: "https://www.thepaper.cn/", description: "时政与思想类新媒体" },
        ],
      },
    ],
  },
  {
    name: "影音娱乐",
    slug: "media",
    resources: [
      { title: "YouTube", url: "https://www.youtube.com/", description: "全球最大的视频平台" },
      { title: "Bilibili", url: "https://www.bilibili.com/", description: "中文弹幕视频社区" },
      { title: "Spotify", url: "https://open.spotify.com/", description: "音乐流媒体服务" },
      { title: "Netflix", url: "https://www.netflix.com/", description: "影视订阅流媒体" },
    ],
  },
  {
    name: "生活服务",
    slug: "life",
    resources: [
      { title: "高德地图", url: "https://www.amap.com/", description: "出行导航与本地生活" },
      { title: "美团", url: "https://www.meituan.com/", description: "本地生活服务平台" },
      { title: "12306", url: "https://www.12306.cn/", description: "中国铁路官方购票" },
      { title: "快递100", url: "https://www.kuaidi100.com/", description: "快递单号查询" },
    ],
  },
];
