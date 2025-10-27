import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
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
      meta: { requiresGuest: true }, // Only accessible when not logged in
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

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  console.log("🧭 Router navigation:", {
    from: from.name,
    to: to.name,
    isAuthenticated: authStore.isAuthenticated,
    requiresAuth: to.meta.requiresAuth,
    requiresGuest: to.meta.requiresGuest,
  });

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log("⛔ Redirecting to auth - not authenticated");
    // Redirect to auth page if not logged in
    next({ name: "auth" });
  }
  // Check if route is only for guests (like auth page)
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log("✅ Redirecting to editor - already authenticated");
    // Redirect to editor if already logged in
    next({ name: "editor" });
  }
  // Allow navigation
  else {
    console.log("✅ Navigation allowed");
    next();
  }
});

export default router;
