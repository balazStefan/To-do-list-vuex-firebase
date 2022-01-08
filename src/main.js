import { createApp } from "vue";
import store from "./store";
import router from "./router";
import App from "./App.vue";
import WaveUI from "wave-ui";
import "wave-ui/dist/wave-ui.css";
import BaseCard from "./components/UI/BaseCard.vue";
import BaseDialog from "./components/UI/BaseDialog.vue";
import BaseSpinner from "./components/UI/BaseSpinner.vue";
import "@mdi/font/css/materialdesignicons.min.css";

const app = createApp(App);
new WaveUI(app, {
  // Some Wave UI options.
});
app.use(router);
app.use(store);
app.component("base-card", BaseCard);
app.component("base-dialog", BaseDialog);
app.component("base-spinner", BaseSpinner);

router.isReady().then(function () {
  app.mount("#app");
});
