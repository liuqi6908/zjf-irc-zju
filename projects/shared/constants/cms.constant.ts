import { defineAsyncComponent, markRaw } from 'vue';
const HomeCarousel = defineAsyncComponent(() => import('../component/cms/home/HomeCarousel.vue'))
const DataIntroduce = defineAsyncComponent(() => import('../component/cms/home/DataIntroduce.vue'))
const Footer = defineAsyncComponent(()=>import('../component/cms/home/Footer.vue'))
const Question = defineAsyncComponent(()=>import('../component/cms/question/Question.vue'))
const RichText = defineAsyncComponent(()=>import('../component/cms/richText/index.vue'))

export const cmsConfig = [
  {
    id: 'home',
    children: [
      {
        id: 'homeCarousel',
        label: '首页轮播图',
        component: markRaw(HomeCarousel),
        col: ['title', 'uploadImg', 'richText', 'delete', 'sort', 'add'],
        rows: [],
        sort: 1
      },
      {
        id: 'homeDataIntroduce',
        label: '平台介绍',
        component: markRaw(DataIntroduce),
        col: ['title', 'richText'],
        rows: [{ title: '', richText: '' }],
        sort: 2
      },
      {
        id: 'homeContent',
        label: '首页内容',
        component: markRaw(RichText),
        col: ['richText', 'delete', 'sort', 'add'],
        rows: [{ richText: '' }],
        sort: 3
      },
      {
        id: 'footer',
        label: '联系方式',
        component: markRaw(Footer),
        col: ['title', 'richText', 'delete', 'sort', 'add'],
        rows: [],
        sort: 4
      },
      {
        id: 'homeUpdateDescribe',
        label: '数据上传说明',
        component: markRaw(RichText),
        col: ['richText'],
        rows: [{ richText: '' }],
        sort: 6
      },
    ]
  },
  {
    id: 'question',
    children: [
      {
        id: 'questionItem',
        label: '问答',
        component: markRaw(Question),
        col: ['title', 'svg', 'richText', 'delete', 'sort', 'add'],
        rows: [],
        sort: 5
      },
    ]
  },
]