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
      meta: { requiresGuest: true }, // Only show welcome to unauthenticated users
    },
    {
      path: "/onboarding",
      name: "onboarding",
      component: () => import("../views/OnboardingView.vue"),
      meta: { requiresGuest: true }, // Only accessible when not logged in
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
    {
      path: "/flashcards",
      name: "flashcards",
      component: () => import("../views/FlashcardsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/focus",
      name: "focus",
      component: () => import("../views/FocusView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/learning-center",
      name: "learning-center",
      component: () => import("../views/LearningCenterView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/canvas",
      name: "canvas",
      component: () => import("../views/CanvasView.vue"),
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
    console.log("⛔ Redirecting to home - not authenticated");
    // Redirect to welcome/home page if not logged in
    next({ name: "home" });
    return;
  }

  // Check if route is only for guests (like welcome, onboarding, auth)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log("🏠 Redirecting to dashboard - already authenticated");
    // Redirect to dashboard if already logged in
    next({ name: "dashboard" });
    return;
  }

  // Allow navigation
  console.log("✅ Navigation allowed");
  next();
});

export default router;
