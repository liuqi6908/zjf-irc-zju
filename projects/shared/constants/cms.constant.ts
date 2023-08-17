import { defineAsyncComponent } from 'vue';
const HomeCarousel = defineAsyncComponent(() => import('../component/cms/home/HomeCarousel.vue'))

export const cmsConfig = [
    {
        parentId: '',
        id:'home',
        label: '',
        children: [
            {
                id: 'homeCarousel',
                label: '首页轮播图',
                parentId: 'home',
                component: HomeCarousel,
                /** 当前轮播图所需要的操作，表头按照从左到右的顺序 */
                col: ['title', 'content', 'uploadImg', 'delete'],
                rows: []
            },
            {
                id: 'homeQuestion',
                label: '首页问卷',
                parentId: 'home',
                component: defineAsyncComponent(() => import('../component/cms/home/HomeQuestion.vue')),
                col: ['title', 'content', 'delete'],
                rows: []
            }
        ]
    }
]