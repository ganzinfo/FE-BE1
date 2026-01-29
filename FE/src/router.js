import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import DataListViewer from './components/DataListViewer.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HelloWorld,
        props: { msg: 'Üdvözöljük a Tasker Appban!' }
    },
    {
        path: '/data',
        name: 'DataViewer',
        component: DataListViewer
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
