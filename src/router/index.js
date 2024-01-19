import Vue from "vue";
import VueRouter from "vue-router";
import nprogress from "nprogress";
import "@src/assets/styles/nprogress.scss";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/config-form",
      component: () => import("@src/configForm/designer/index.vue"),
      children: [
        {
          path: "list",
          component: () => import("@src/configForm/designer/views/list.vue")
        },
        {
          path: "edit",
          component: () => import("@src/configForm/designer/views/edit/index.vue")
        },
        {
          path: "preview",
          component: () => import("@src/configForm/designer/views/preview.vue")
        },
        {
          path: "detail",
          component: () => import("@src/configForm/designer/views/detail.vue")
        },
        {
          path: "compare",
          component: () => import("@src/configForm/designer/views/compare.vue")
        },
        {
          path: "",
          redirect: "list"
        }
      ]
    },
    {
      path: "/code-preview",
      name: "CodePreview",
      meta: {
        title: "在线示例预览"
      },
      component: () => import(/* webpackChunkName: "[request]" */ `@src/views/code-preview/index.vue`)
    },
    {
      path: "*",
      redirect: "config-form"
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path !== from.path && !Vue.component(to.name)) {
    nprogress.start();
  }
  next();
});

router.afterEach(() => {
  nprogress.done();
});

export default router;
