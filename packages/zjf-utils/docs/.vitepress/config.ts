import { defineConfig } from "vitepress";
import utilStructure from "./utils.json";

// TODO: 暂时没有找到从环境变量读取的方法分
const base = process.env.NODE_ENV === "production" ? "/r/v3/utils/docs/" : "/";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  lastUpdated: true,
  title: "ZJF Utils",
  description: "Utils of zjf system",
  srcDir: "src",
  head: [["link", { rel: "icon", href: base + "logo.svg" }]],
  themeConfig: {
    logo: "/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],
    search: {
      provider: "local",
    },

    sidebar: [
      ...utilStructure,

      {
        text: "新增与维护",
        link: "/contribute",
      },
      {
        text: "Roadmap",
        link: "/roadmap",
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://codeup.aliyun.com/62cea2b83e81781f3ad23a2f/r.qiyandata.com/ssdp",
      },
    ],
  },
});
