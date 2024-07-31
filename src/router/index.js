import { createRouter, createWebHistory } from 'vue-router';
import MatchList from '@/components/MatchList.vue';
import MatchDashboard from '@/components/MatchDashboard.vue';
import SignIn from '@/components/SignIn.vue';
import CreateMatch from '@/components/CreateMatch.vue';

const routes = [
    {
        path: '/',
        component: SignIn,
        meta: { title: 'Sign In' }
    },
    {
        path: '/create-match',
        component: CreateMatch,
        meta: { title: 'Create Match' }
    },
    {
        path: '/matches',
        component: MatchList,
        meta: { title: 'Your Matches' }
    },
    {
        path: '/matches/:id',
        component: MatchDashboard,
        props: true,
        meta: { title: 'Match #{id}' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const appName = 'Gin Rummy';
    let title = to.meta.title ? appName + ' — ' + to.meta.title : appName;

    for (const key in to.params) {
        if (Object.prototype.hasOwnProperty.call(to.params, key)) {
            const regex = new RegExp(`{${key}}`, 'g');
            title = title.replace(regex, to.params[key]);
        }
    }

    document.title = title;
    next();
});

export default router;
