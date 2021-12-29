<template>
  <ul>
    <h2 class="white">Create To Do List</h2>
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
  font-weight: 900;
  font-size: 1.2rem;
}
h2 {
}
</style>
