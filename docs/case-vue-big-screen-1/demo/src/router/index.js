import Vue from 'vue';
import VueRouter from 'vue-router';
import OperationWarn from '../views/operation-warn';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: OperationWarn,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
