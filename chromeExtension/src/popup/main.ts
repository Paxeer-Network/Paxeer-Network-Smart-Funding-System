import { createApp } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import App from "./App.vue";
import "./style.css";

import DashboardView from "./views/DashboardView.vue";
import ActivityView from "./views/ActivityView.vue";
import ConnectView from "./views/ConnectView.vue";
import SettingsView from "./views/SettingsView.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", redirect: "/dashboard" },
    { path: "/dashboard", component: DashboardView },
    { path: "/activity", component: ActivityView },
    { path: "/connect", component: ConnectView },
    { path: "/settings", component: SettingsView },
  ],
});

const app = createApp(App);
app.use(router);
app.mount("#app");
