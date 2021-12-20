import { createRouter, createWebHistory } from "vue-router";
import TodoLists from "./components/TodoLists.vue";
import Form from "./components/Form.vue";
import NotFound from "./components/Pages/NotFound.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: TodoLists,
      props: true,
    },
    {
      path: "/admin",
      redirect: "/",
    },
    {
      path: "/create",
      component: Form,
    },

    {
      path: "/:notfound(.*)",
      component: NotFound,
    },
  ],
});
export default router;
