---
title: "如何新增或维护"
outline: deep
---

## 准备

安装Node（满足workspace的版本要求）和pnpm， 并安装相关依赖


## 目录结构

```
.
├── docs                       // vitepress 文档
│   └── src
├── lib                        // 构建后的产物，暴露给外部使用
│   ├── browser
│   ├── common
│   ├── index.d.ts
│   ├── index.d.ts.map
│   └── index.js
├── nodemon.json
├── package.json
├── scripts                     // 脚本目录
│   └── auto-create-docs.js     // 自动构建文档的脚本
├── src                         // 🔧工具源代码目录
│   ├── browser                 // 仅浏览器可用的工具
│   ├── common                  // 通用工具
│   └── index.ts
└── tsconfig.json
```


## 流程

1. 所有的工具函数定义在 `src` 目录下，所有的改动也只需要在 `src` 目录下进行。
2. 请严格遵守工具文件的命名及目录，**所有的文档将通过项目src下的目录渲染为侧边栏**。
3. 在每个目录下，必须有一个 `index.ts` 文件，暴露当前目录下全部的工具。
4. 所有的**通用工具**最终暴露在 `src/index.ts`。
5. 所有的**浏览器工具**最终暴露在 `src/browser/index.ts`。
6. 工具函数的编写需要严格遵守 [jsDoc](https://jsdoc.app/) 规范，以便自动生成文档。
