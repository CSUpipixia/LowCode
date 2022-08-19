import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/css/nprogress.css'; // 进度条样式

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const routes = [
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/editor/index'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(() => {
  NProgress.start(); // start progress bar
  return true;
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});

export default router;
