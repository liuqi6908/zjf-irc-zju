import { defineAsyncComponent, markRaw } from 'vue';
const HomeCarousel = defineAsyncComponent(() => import('../component/cms/home/HomeCarousel.vue'))
const DataIntroduce = defineAsyncComponent(() => import('../component/cms/home/DataIntroduce.vue'))
const Footer = defineAsyncComponent(()=>import('../component/cms/home/Footer.vue'))
const Question = defineAsyncComponent(()=>import('../component/cms/question/Question.vue'))
const UpdateDescribe = defineAsyncComponent(()=>import('../component/cms/user/UpdateDescribe.vue'))

export const cmsConfig = [
  {
    parentId: '',
    id: 'home',
    label: '',
    children: [
      {
        id: 'homeCarousel',
        label: '首页轮播图',
        parentId: 'home',
        component: markRaw(HomeCarousel),
        col: ['title', 'uploadImg','richText', 'delete', 'sort', 'add'],
        rows: []
      },
      {
        id: 'homeDataIntroduce',
        label: '平台介绍',
        parentId: 'home',
        component: markRaw(DataIntroduce),
        col: ['title', 'richText'],
        rows: [{ title: null, richText: null }]
      },
      {
        id: 'footer',
        label: '联系方式',
        parentId: 'footer',
        component: markRaw(Footer),
        col: ['title', 'richText','delete', 'sort', 'add',],
        rows: []
      },
      {
        id: 'homeUpdateDescribe',
        label: '数据上传说明',
        parentId: 'userUpdateDescribe',
        component: markRaw(UpdateDescribe),
        col: ['richText'],
        rows: [{ richText: null }]
      },
    ]
  },
  {
    parentId: '',
    id: 'question',
    label: '',
    children: [
      {
        id: 'questionItem',
        label: '问答',
        parentId: 'question',
        component: markRaw(Question),
        col: ['title', 'svg', 'richText', 'delete', 'sort', 'add'],
        rows: []
      },
    ]
  },
]