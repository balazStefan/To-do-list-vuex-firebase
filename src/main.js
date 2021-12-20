import { createApp } from "vue";
import store from "./store";
import router from "./router";
import App from "./App.vue";
import WaveUI from "wave-ui";
import "wave-ui/dist/wave-ui.css";
import BaseCard from "./components/UI/BaseCard.vue";

const app = createApp(App);
new WaveUI(app, {
  // Some Wave UI options.
});
app.use(router);
app.use(store);
app.component("base-card", BaseCard);

router.isReady().then(function () {
  app.mount("#app");
});
