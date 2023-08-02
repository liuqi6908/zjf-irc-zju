<script lang="ts" setup>
const customize
  = [{
    label: '涉农主题-特色统计库',
    header: 'root',
    title: 'h1',
    children: [
      {
        label: '基础涉农主体',
        title: 'h2',
        children: [
          {
            title: 'h3',
            label: '历年各省市分行业合作社数量统计（2007年-2022年）',
            header: 'generic',
            body: 'story',
          },
          {
            title: 'h3',
            label: '历年各省市分行业合作社数量统计（2007年-2022年）',
            header: 'generic',

          },
          {
            label: '历年各省市分行业合作社数量统计（2007年-2022年）',
            header: 'generic',
            body: 'story',
            title: 'h3',
          },
        ],
      },
    ],
  },
  {
    label: '涉农主题-特色统计库',
    header: 'root',
    title: 'h1',
    children: [
      {
        label: '基础涉农主体',
        title: 'h2',
        children: [
          {
            title: 'h3',
            label: '历年各省市分行业合作社数量统计（2007年-2022年）',
            header: 'generic',
            body: 'story',
          },
          {
            title: 'h3',
            label: '历年各省市分行业合作社数量统计（2007年-2022年）',
            header: 'generic',

          },
          {
            label: '历年各省市分行业合作社数量统计（2007年-2022年）',
            header: 'generic',
            body: 'story',
            title: 'h3',
          },
        ],
      },
    ],
  }]
</script>

<template>
  <div flex flex-col gap-10 p-24>
    <Tree
      v-for="item in customize"
      :key="item.label"
      :label="item.label"
      :header="item.header"
      :title="item.title"
      :children="item.children"
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
