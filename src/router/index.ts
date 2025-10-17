import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/AuthView.vue"),
    },
    {
      path: "/auth-test",
      name: "auth-test",
      component: () => import("../views/AuthTestView.vue"),
    },
    {
      path: "/editor",
      name: "editor",
      component: () => import("../views/EditorView.vue"),
    },
    {
      path: "/notes",
      name: "notes",
      component: () => import("../views/NotesView.vue"),
    },
    {
      path: "/merge",
      name: "merge",
      component: () => import("../views/MergeView.vue"),
    },
  ],
});

export default router;
