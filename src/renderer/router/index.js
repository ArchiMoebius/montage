import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'galleries',
      component: require('@/components/Galleries').default
    },
    {
      path: '/gallery/:id',
      name: 'gallery',
      component: require('@/components/Gallery').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
