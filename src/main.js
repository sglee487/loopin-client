import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";

import timeago from "vue-timeago3";

createApp(App).use(timeago).mount("#app");
