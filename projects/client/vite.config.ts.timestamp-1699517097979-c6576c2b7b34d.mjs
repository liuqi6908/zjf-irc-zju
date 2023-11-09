// vite.config.ts
import path from "node:path";
import Unocss from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+unocss@0.53.5_postcss@8.4.26_rollup@2.79.1_vite@4.4.3/node_modules/unocss/dist/vite.mjs";
import Vue from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+@vitejs+plugin-vue@4.2.3_vite@4.4.3_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Pages from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-pages@0.31.0_vite@4.4.3/node_modules/vite-plugin-pages/dist/index.mjs";
import Shiki from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+markdown-it-shiki@0.9.0/node_modules/markdown-it-shiki/dist/index.mjs";
import { VitePWA } from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-pwa@0.16.4_vite@4.4.3_workbox-build@7.0.0_workbox-window@7.0.0/node_modules/vite-plugin-pwa/dist/index.js";
import { defineConfig, loadEnv } from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+vite@4.4.3_@types+node@18.16.18_sass@1.32.12/node_modules/vite/dist/node/index.js";
import Layouts from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-vue-layouts@0.8.0_vite@4.4.3_vue-router@4.2.4_vue@3.3.4/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import generateSitemap from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+vite-ssg-sitemap@0.5.1/node_modules/vite-ssg-sitemap/dist/index.js";
import Markdown from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-vue-markdown@0.23.5_rollup@2.79.1_vite@4.4.3/node_modules/vite-plugin-vue-markdown/dist/index.mjs";
import VueMacros from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+unplugin-vue-macros@2.3.6_@vueuse+core@10.2.1_rollup@2.79.1_vite@4.4.3_vue@3.3.4/node_modules/unplugin-vue-macros/dist/vite.mjs";
import AutoImport from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+unplugin-auto-import@0.16.6_@vueuse+core@10.2.1_rollup@2.79.1/node_modules/unplugin-auto-import/dist/vite.js";
import VueDevTools from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-vue-devtools@0.5.1_@types+node@18.16.18_axios@1.4.0_nprogr_pw5dm2c5s4cs3eega6uftkbqny/node_modules/vite-plugin-vue-devtools/dist/index.mjs";
import WebfontDownload from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-webfont-dl@3.7.6_vite@4.4.3/node_modules/vite-plugin-webfont-dl/dist/index.mjs";
import Components from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+unplugin-vue-components@0.25.1_rollup@2.79.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/vite.mjs";
import VueI18n from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+@intlify+unplugin-vue-i18n@0.12.2_rollup@2.79.1_vue-i18n@9.2.2/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import LinkAttributes from "file:///D:/qiyan/zjf-irc/node_modules/.pnpm/registry.npmmirror.com+markdown-it-link-attributes@4.0.1/node_modules/markdown-it-link-attributes/index.js";
var __vite_injected_original_dirname = "D:\\qiyan\\zjf-irc\\projects\\client";
var vite_config_default = ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
    VITE_MODE: mode
  };
  return defineConfig({
    base: process.env.VITE_BASE,
    define: {
      "process.env": {}
    },
    server: {
      host: "0.0.0.0",
      port: Number.parseInt(process.env.VITE_DEV_PORT || "3333", 10),
      proxy: {
        [process.env.VITE_API_BASE]: {
          target: process.env.VITE_DEV_PROXY_TARGET,
          changeOrigin: true,
          rewrite: (path2) => path2.replace(new RegExp(`^${process.env.VITE_API_BASE}`), "")
        }
      }
    },
    resolve: {
      alias: {
        "~/": `${path.resolve(__vite_injected_original_dirname, "src")}/`
      }
    },
    plugins: [
      VueMacros({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/]
          })
        }
      }),
      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ["vue", "md"]
      }),
      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          "vue-i18n",
          "@vueuse/head",
          "@vueuse/core"
        ],
        dts: "src/auto-imports.d.ts",
        dirs: [
          "src/composables",
          "src/stores",
          "src/constants",
          "src/views"
        ],
        vueTemplate: true
      }),
      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ["vue", "md"],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: "src/components.d.ts"
      }),
      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      Unocss(),
      // https://github.com/antfu/vite-plugin-vue-markdown
      // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
      Markdown({
        wrapperClasses: "prose prose-sm m-auto text-left",
        headEnabled: true,
        markdownItSetup(md) {
          md.use(Shiki, {
            theme: {
              light: "vitesse-light",
              dark: "vitesse-dark"
            }
          });
          md.use(LinkAttributes, {
            matcher: (link) => /^https?:\/\//.test(link),
            attrs: {
              target: "_blank",
              rel: "noopener"
            }
          });
        }
      }),
      // https://github.com/antfu/vite-plugin-pwa
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg", "safari-pinned-tab.svg"],
        manifest: {
          name: "Vitesse",
          short_name: "Vitesse",
          theme_color: "#ffffff",
          icons: [
            {
              src: "/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable"
            }
          ]
        }
      }),
      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [path.resolve(__vite_injected_original_dirname, "locales/**")]
      }),
      // https://github.com/feat-agency/vite-plugin-webfont-dl
      WebfontDownload(),
      // https://github.com/webfansplz/vite-plugin-vue-devtools
      VueDevTools()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "shared/style/base.scss";'
        }
      }
    },
    // https://github.com/vitest-dev/vitest
    test: {
      include: ["test/**/*.test.ts"],
      environment: "jsdom",
      deps: {
        inline: ["@vue", "@vueuse", "vue-demi"]
      }
    },
    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: "async",
      formatting: "minify",
      crittersOptions: {
        reduceInlineStyles: false
      },
      onFinished() {
        generateSitemap();
      }
    },
    optimizeDeps: {
      include: [
        "echarts/core",
        "echarts/renderers",
        "echarts/charts",
        "echarts/components",
        "vue-echarts"
      ]
    },
    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: ["workbox-window", /vue-i18n/, "echarts", "vue-echarts", "resize-detector", "zrender"]
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxxaXlhblxcXFx6amYtaXJjXFxcXHByb2plY3RzXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccWl5YW5cXFxcempmLWlyY1xcXFxwcm9qZWN0c1xcXFxjbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3FpeWFuL3pqZi1pcmMvcHJvamVjdHMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgVW5vY3NzIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQgVnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IFBhZ2VzIGZyb20gJ3ZpdGUtcGx1Z2luLXBhZ2VzJ1xyXG5pbXBvcnQgU2hpa2kgZnJvbSAnbWFya2Rvd24taXQtc2hpa2knXHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCBMYXlvdXRzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzJ1xyXG5pbXBvcnQgZ2VuZXJhdGVTaXRlbWFwIGZyb20gJ3ZpdGUtc3NnLXNpdGVtYXAnXHJcbmltcG9ydCBNYXJrZG93biBmcm9tICd2aXRlLXBsdWdpbi12dWUtbWFya2Rvd24nXHJcbmltcG9ydCBWdWVNYWNyb3MgZnJvbSAndW5wbHVnaW4tdnVlLW1hY3Jvcy92aXRlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgVnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xyXG5pbXBvcnQgV2ViZm9udERvd25sb2FkIGZyb20gJ3ZpdGUtcGx1Z2luLXdlYmZvbnQtZGwnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCBWdWVJMThuIGZyb20gJ0BpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGUnXHJcbmltcG9ydCBMaW5rQXR0cmlidXRlcyBmcm9tICdtYXJrZG93bi1pdC1saW5rLWF0dHJpYnV0ZXMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH06IGFueSkgPT4ge1xyXG4gIHByb2Nlc3MuZW52ID0ge1xyXG4gICAgLi4ucHJvY2Vzcy5lbnYsXHJcbiAgICAuLi5sb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpLFxyXG4gICAgVklURV9NT0RFOiBtb2RlLFxyXG4gIH1cclxuICAvLyBPYmplY3QuYXNzaWduKHByb2Nlc3MuZW52LCBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpKVxyXG4gIHJldHVybiBkZWZpbmVDb25maWcoe1xyXG4gICAgYmFzZTogcHJvY2Vzcy5lbnYuVklURV9CQVNFLFxyXG4gICAgZGVmaW5lOiB7XHJcbiAgICAgICdwcm9jZXNzLmVudic6IHt9LFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgIHBvcnQ6IE51bWJlci5wYXJzZUludCgocHJvY2Vzcy5lbnYuVklURV9ERVZfUE9SVCBhcyBzdHJpbmcpIHx8ICczMzMzJywgMTApLFxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgIFtwcm9jZXNzLmVudi5WSVRFX0FQSV9CQVNFIGFzIHN0cmluZ106IHtcclxuICAgICAgICAgIHRhcmdldDogcHJvY2Vzcy5lbnYuVklURV9ERVZfUFJPWFlfVEFSR0VULFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7cHJvY2Vzcy5lbnYuVklURV9BUElfQkFTRX1gKSwgJycpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICd+Lyc6IGAke3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKX0vYCxcclxuICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICBWdWVNYWNyb3Moe1xyXG4gICAgICAgIHBsdWdpbnM6IHtcclxuICAgICAgICAgIHZ1ZTogVnVlKHtcclxuICAgICAgICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLm1kJC9dLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaGFubm9lcnUvdml0ZS1wbHVnaW4tcGFnZXNcclxuICAgICAgUGFnZXMoe1xyXG4gICAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ21kJ10sXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0pvaG5DYW1waW9uSnIvdml0ZS1wbHVnaW4tdnVlLWxheW91dHNcclxuICAgICAgTGF5b3V0cygpLFxyXG5cclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWF1dG8taW1wb3J0XHJcbiAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICAgICd2dWUnLFxyXG4gICAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICAgJ3Z1ZS1pMThuJyxcclxuICAgICAgICAgICdAdnVldXNlL2hlYWQnLFxyXG4gICAgICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBkdHM6ICdzcmMvYXV0by1pbXBvcnRzLmQudHMnLFxyXG4gICAgICAgIGRpcnM6IFtcclxuICAgICAgICAgICdzcmMvY29tcG9zYWJsZXMnLFxyXG4gICAgICAgICAgJ3NyYy9zdG9yZXMnLFxyXG4gICAgICAgICAgJ3NyYy9jb25zdGFudHMnLFxyXG4gICAgICAgICAgJ3NyYy92aWV3cycsXHJcbiAgICAgICAgXSxcclxuICAgICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgLy8gYWxsb3cgYXV0byBsb2FkIG1hcmtkb3duIGNvbXBvbmVudHMgdW5kZXIgYC4vc3JjL2NvbXBvbmVudHMvYFxyXG4gICAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ21kJ10sXHJcbiAgICAgICAgLy8gYWxsb3cgYXV0byBpbXBvcnQgYW5kIHJlZ2lzdGVyIGNvbXBvbmVudHMgdXNlZCBpbiBtYXJrZG93blxyXG4gICAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXHJcbiAgICAgICAgZHRzOiAnc3JjL2NvbXBvbmVudHMuZC50cycsXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3Vub2Nzc1xyXG4gICAgICAvLyBzZWUgdW5vLmNvbmZpZy50cyBmb3IgY29uZmlnXHJcbiAgICAgIFVub2NzcygpLFxyXG5cclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGUtcGx1Z2luLXZ1ZS1tYXJrZG93blxyXG4gICAgICAvLyBEb24ndCBuZWVkIHRoaXM/IFRyeSB2aXRlc3NlLWxpdGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS92aXRlc3NlLWxpdGVcclxuICAgICAgTWFya2Rvd24oe1xyXG4gICAgICAgIHdyYXBwZXJDbGFzc2VzOiAncHJvc2UgcHJvc2Utc20gbS1hdXRvIHRleHQtbGVmdCcsXHJcbiAgICAgICAgaGVhZEVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgbWFya2Rvd25JdFNldHVwKG1kKSB7XHJcbiAgICAgICAgICAvLyBodHRwczovL3ByaXNtanMuY29tL1xyXG4gICAgICAgICAgbWQudXNlKFNoaWtpLCB7XHJcbiAgICAgICAgICAgIHRoZW1lOiB7XHJcbiAgICAgICAgICAgICAgbGlnaHQ6ICd2aXRlc3NlLWxpZ2h0JyxcclxuICAgICAgICAgICAgICBkYXJrOiAndml0ZXNzZS1kYXJrJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICBtZC51c2UoTGlua0F0dHJpYnV0ZXMsIHtcclxuICAgICAgICAgICAgbWF0Y2hlcjogKGxpbms6IHN0cmluZykgPT4gL15odHRwcz86XFwvXFwvLy50ZXN0KGxpbmspLFxyXG4gICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgIHRhcmdldDogJ19ibGFuaycsXHJcbiAgICAgICAgICAgICAgcmVsOiAnbm9vcGVuZXInLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS92aXRlLXBsdWdpbi1wd2FcclxuICAgICAgVml0ZVBXQSh7XHJcbiAgICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcbiAgICAgICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLnN2ZycsICdzYWZhcmktcGlubmVkLXRhYi5zdmcnXSxcclxuICAgICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgICAgbmFtZTogJ1ZpdGVzc2UnLFxyXG4gICAgICAgICAgc2hvcnRfbmFtZTogJ1ZpdGVzc2UnLFxyXG4gICAgICAgICAgdGhlbWVfY29sb3I6ICcjZmZmZmZmJyxcclxuICAgICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBzcmM6ICcvcHdhLTE5MngxOTIucG5nJyxcclxuICAgICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiAnL3B3YS01MTJ4NTEyLnBuZycsXHJcbiAgICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHNyYzogJy9wd2EtNTEyeDUxMi5wbmcnLFxyXG4gICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgICAgICAgcHVycG9zZTogJ2FueSBtYXNrYWJsZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ludGxpZnkvYnVuZGxlLXRvb2xzL3RyZWUvbWFpbi9wYWNrYWdlcy91bnBsdWdpbi12dWUtaTE4blxyXG4gICAgICBWdWVJMThuKHtcclxuICAgICAgICBydW50aW1lT25seTogdHJ1ZSxcclxuICAgICAgICBjb21wb3NpdGlvbk9ubHk6IHRydWUsXHJcbiAgICAgICAgZnVsbEluc3RhbGw6IHRydWUsXHJcbiAgICAgICAgaW5jbHVkZTogW3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdsb2NhbGVzLyoqJyldLFxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mZWF0LWFnZW5jeS92aXRlLXBsdWdpbi13ZWJmb250LWRsXHJcbiAgICAgIFdlYmZvbnREb3dubG9hZCgpLFxyXG5cclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYmZhbnNwbHovdml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzXHJcbiAgICAgIFZ1ZURldlRvb2xzKCksXHJcbiAgICBdLFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogJ0BpbXBvcnQgXCJzaGFyZWQvc3R5bGUvYmFzZS5zY3NzXCI7JyxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92aXRlc3QtZGV2L3ZpdGVzdFxyXG4gICAgdGVzdDoge1xyXG4gICAgICBpbmNsdWRlOiBbJ3Rlc3QvKiovKi50ZXN0LnRzJ10sXHJcbiAgICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgICBkZXBzOiB7XHJcbiAgICAgICAgaW5saW5lOiBbJ0B2dWUnLCAnQHZ1ZXVzZScsICd2dWUtZGVtaSddLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1zc2dcclxuICAgIHNzZ09wdGlvbnM6IHtcclxuICAgICAgc2NyaXB0OiAnYXN5bmMnLFxyXG4gICAgICBmb3JtYXR0aW5nOiAnbWluaWZ5JyxcclxuICAgICAgY3JpdHRlcnNPcHRpb25zOiB7XHJcbiAgICAgICAgcmVkdWNlSW5saW5lU3R5bGVzOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgb25GaW5pc2hlZCgpIHtcclxuICAgICAgICBnZW5lcmF0ZVNpdGVtYXAoKVxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgaW5jbHVkZTogW1xyXG4gICAgICAgICdlY2hhcnRzL2NvcmUnLFxyXG4gICAgICAgICdlY2hhcnRzL3JlbmRlcmVycycsXHJcbiAgICAgICAgJ2VjaGFydHMvY2hhcnRzJyxcclxuICAgICAgICAnZWNoYXJ0cy9jb21wb25lbnRzJyxcclxuICAgICAgICAndnVlLWVjaGFydHMnLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuXHJcbiAgICBzc3I6IHtcclxuICAgICAgLy8gVE9ETzogd29ya2Fyb3VuZCB1bnRpbCB0aGV5IHN1cHBvcnQgbmF0aXZlIEVTTVxyXG4gICAgICBub0V4dGVybmFsOiBbJ3dvcmtib3gtd2luZG93JywgL3Z1ZS1pMThuLywgJ2VjaGFydHMnLCAndnVlLWVjaGFydHMnLCAncmVzaXplLWRldGVjdG9yJywgJ3pyZW5kZXInXSxcclxuICAgIH0sXHJcbiAgfSlcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRSLE9BQU8sVUFBVTtBQUM3UyxPQUFPLFlBQVk7QUFDbkIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sV0FBVztBQUNsQixPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8sYUFBYTtBQUNwQixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLGNBQWM7QUFDckIsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8scUJBQXFCO0FBQzVCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sYUFBYTtBQUNwQixPQUFPLG9CQUFvQjtBQWhCM0IsSUFBTSxtQ0FBbUM7QUFrQnpDLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBVztBQUNoQyxVQUFRLE1BQU07QUFBQSxJQUNaLEdBQUcsUUFBUTtBQUFBLElBQ1gsR0FBRyxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFBQSxJQUM5QixXQUFXO0FBQUEsRUFDYjtBQUVBLFNBQU8sYUFBYTtBQUFBLElBQ2xCLE1BQU0sUUFBUSxJQUFJO0FBQUEsSUFDbEIsUUFBUTtBQUFBLE1BQ04sZUFBZSxDQUFD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
