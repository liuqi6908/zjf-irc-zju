<script setup lang="ts">
const cardList = [
  {
    icon: '<div i-mingcute:download-3-line w-7 h-7 text-grey-1 />',
    title: '如何申请下载数据？',
    article: '通过云桌面服务器、数据库服务器以及环境服务器三者协同，为用户提供离线、安全和多人协同的数据分析和学术生产环境。云桌面服务器为用户提供虚拟主机，运行性能灵活可控，并基于传统的Windows操作系统，为学者提供熟悉的办公分析环境；数据库服务器，为用户提供必需的大数据存取服务；环境服务器方便用户便捷、离线配置计量分析工具和协同写作。',
  },
  {
    icon: '<div i-mingcute:align-arrow-right-line w-7 h-7 text-grey-1 />',
    title: '如何登录智能云科研平台 - 云桌面？',
    article: '通过云桌面服务器、数据库服务器以及环境服务器三者协同，为用户提供离线、安全和多人协同的数据分析和学术生产环境。云桌面服务器为用户提供虚拟主机，运行性能灵活可控，并基于传统的Windows操作系统，为学者提供熟悉的办公分析环境；数据库服务器，为用户提供必需的大数据存取服务；环境服务器方便用户便捷、离线配置计量分析工具和协同写作。',
  },
  {
    icon: '<div i-mingcute:send-line w-7 h-7 text-grey-1 />',
    title: '如何外发研究成果？外发注意点？',
    article: '通过云桌面服务器、数据库服务器以及环境服务器三者协同，为用户提供离线、安全和多人协同的数据分析和学术生产环境。云桌面服务器为用户提供虚拟主机，运行性能灵活可控，并基于传统的Windows操作系统，为学者提供熟悉的办公分析环境；数据库服务器，为用户提供必需的大数据存取服务；环境服务器方便用户便捷、离线配置计量分析工具和协同写作。',
  },
  {
    icon: '<div i-mingcute:chat-4-line w-7 h-7 text-grey-1 />',
    title: '云桌面常见问题？',
    article: '通过云桌面服务器、数据库服务器以及环境服务器三者协同，为用户提供离线、安全和多人协同的数据分析和学术生产环境。云桌面服务器为用户提供虚拟主机，运行性能灵活可控，并基于传统的Windows操作系统，为学者提供熟悉的办公分析环境；数据库服务器，为用户提供必需的大数据存取服务；环境服务器方便用户便捷、离线配置计量分析工具和协同写作。',
  },
]
</script>

<template>
  <div grid gap-10 p-20 lg:grid-cols-2>
    <DisplayCard
      v-for="item in cardList"
      :key="item.title"
      :title="item.title"
      :icon="item.icon"
      :article="item.article"
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
