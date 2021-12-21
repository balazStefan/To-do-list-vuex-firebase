<template>
  <ul>
    <router-link v-if="isLogedIn" to="/lists"
      >Edit your To do Lists</router-link
    >
    <router-link v-if="isLogedIn" to="/create"
      >Create New Todo List</router-link
    >

    <router-link v-if="isLogedIn" to="/auth" @click="logOutUser"
      >Log out</router-link
    >
  </ul>
</template>
<script>
export default {
  computed: {
    isLogedIn() {
      return this.$store.getters.isAuth;
    },
  },
  methods: {
    logOutUser() {
      this.$store.dispatch("logOutUser");
    },
  },
};
</script>

<style scoped>
ul {
  width: 100%;
  min-height: 50px;
  background-color: rgb(9, 102, 175);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  /* gap: 2rem; */
}
a {
  color: white;
}
a.router-link-active {
  color: rgba(92, 255, 157, 0.87);
}
</style>
