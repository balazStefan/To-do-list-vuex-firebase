import { createRouter, createWebHistory } from "vue-router";
import TodoLists from "./components/TodoLists.vue";
import Form from "./components/Form.vue";
import NotFound from "./components/Pages/NotFound.vue";
import Auth from "./components/Pages/Auth.vue";
import store from "./store.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Auth,
      redirect: "/auth",
    },

    { path: "/lists", component: TodoLists, meta: { requiresAuth: true } },
    {
      path: "/create",
      component: Form,
      meta: { requiresAuth: true },
    },
    { path: "/auth", component: Auth, meta: { requiresUnAuth: true } },

    {
      path: "/:notfound(.*)",
      component: NotFound,
    },
  ],
});
router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuth) {
    next("/auth");
  } else if (to.meta.requiresUnAuth && store.getters.isAuth) {
    next("/lists");
  } else {
    next();
  }
});
export default router;
