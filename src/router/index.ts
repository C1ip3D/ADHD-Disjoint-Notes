import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "../stores/auth";

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
      meta: { requiresGuest: true },
    },
    {
      path: "/editor",
      name: "editor",
      component: () => import("../views/EditorView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/notes",
      name: "notes",
      component: () => import("../views/NotesView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/merge",
      name: "merge",
      component: () => import("../views/MergeView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// Route guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/auth");
    return;
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/");
    return;
  }

  next();
});

export default router;
