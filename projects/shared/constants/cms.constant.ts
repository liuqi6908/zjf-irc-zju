import { defineAsyncComponent, markRaw } from 'vue';
const HomeCarousel = defineAsyncComponent(() => import('../component/cms/home/HomeCarousel.vue'))
const DataIntroduce = defineAsyncComponent(() => import('../component/cms/home/DataIntroduce.vue'))
const Question = defineAsyncComponent(()=>import('../component/cms/question/Question.vue'))

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
                /** 当前轮播图所需要的操作，表头按照从左到右的顺序 */
                col: ['title', 'content', 'uploadImg', 'delete', 'sort', 'add'],
                rows: []
            },
            {
                id: 'homeDataIntroduce',
                label: '首页数据库介绍',
                parentId: 'home',
                component: markRaw(DataIntroduce),
                col: ['title', 'content'],
                /** col对象没有add操作，rows需要加上一个空对象 */
                rows: [{ title: null, content: null }]
            }
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
                col: ['title', 'richText','add'],
                rows: []
            }
        ]
    }
]