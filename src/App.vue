<template>
  <div>
    <w-app>
      <the-header></the-header>
      <router-view v-slot="slotProps">
        <transition name="route" mode="out-in">
          <component :is="slotProps.Component"></component>
        </transition>
      </router-view>
    </w-app>
  </div>
</template>
<script>
import TheHeader from "./components/UI/TheHeader.vue";
export default {
  components: { TheHeader },

  created() {
    this.$store.dispatch("tryLogin");
  },
  computed: {
    didAutoLogOut() {
      return this.$store.getters.didAutoLogOut;
    },
  },
  watch: {
    didAutoLogOut(current, old) {
      if (current && current !== old) {
        this.$router.replace("/auth");
      }
    },
  },
};
</script>
<style>
.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.5s ease-out;
}
.route-leave-active {
  transition: all 0.5s ease-in;
}
.route-leave-from,
.route-enter-to {
  opacity: 1;
  transform: translateY(0px);
}
</style>
