const _routes = [
  {
    path: "/config-form",
    component: () => import("../designer/index.vue"),
    children: [
      {
        path: "list",
        component: () => import("../designer/views/list.vue")
      },
      {
        path: "edit",
        component: () => import("../designer/views/edit/index.vue")
      },
      {
        path: "preview",
        component: () => import("../designer/views/preview.vue")
      },
      {
        path: "detail",
        component: () => import("../designer/views/detail.vue")
      },
      {
        path: "compare",
        component: () => import("../designer/views/compare.vue")
      },
      {
        path: "",
        redirect: "list"
      }
    ]
  }
];

const routes = _routes;

export default routes;
