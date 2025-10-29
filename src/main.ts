import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// Optimize performance
const app = createApp(App);

// Use performance-optimized pinia
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Disable production tips for faster startup
app.config.performance = false;

app.mount("#app");
