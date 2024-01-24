// Composables
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
    children: [
      {
        name: "default",
        path: "/",
        components: {
          aboutContent: () => import("@/views/DefaultView.vue"),
        },
      },
      {
        path: "posts/:userId",
        name: "posts",
        components: {
          aboutContent: () => import("@/views/PostsView.vue"),
        },
      },
      {
        path: "posts/:postId", // Динамический сегмент для id поста
        name: "post-details",
        components: {
          aboutContent: () => import("@/views/PostDetailsView.vue"),
        },
      },
      {
        path: "todos",
        name: "todos",
        components: {
          aboutContent: () => import("@/views/TodoView.vue"),
        },
      },
    ],
  },
  // {
  //   path: "/posts",
  //   name: "posts",
  //   component: () => import("@/views/PostsView.vue"),
  // },
  // // {
  // // path: "/",
  // // component: () => import("@/views/HomeView.vue"),
  // // children: [
  // //   {
  //     path: "posts",
  //     name: "posts",
  //     components: {
  //       homeComponents: PostsViewVue,
  //     },
  //   },
  // ],
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
