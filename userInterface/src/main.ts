import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import App from "./App.vue";
import "./style.css";
import { getAuthToken } from "@/api/client";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/HomeView.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("./views/SignupView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("./views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("./views/NotFoundView.vue"),
    },
  ],
});

let _tokenValidated = false;

router.beforeEach(async (to: RouteLocationNormalized) => {
  if (!to.meta.requiresAuth) return;

  const token = getAuthToken();
  if (!token) return { name: "home" };

  // Validate the token once per session via API call
  if (!_tokenValidated) {
    try {
      const { useAuthStore } = await import("@/stores/auth");
      const auth = useAuthStore();
      const valid = await auth.validateToken();
      if (!valid) return { name: "home" };
      _tokenValidated = true;
    } catch {
      return { name: "home" };
    }
  }
});

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

// Global Vue error handler
app.config.errorHandler = (err, _instance, info) => {
  console.error(`[Vue Error] ${info}:`, err);
};

app.mount("#app");
