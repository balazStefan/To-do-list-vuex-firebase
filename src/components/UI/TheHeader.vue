<template>
  <ul>
    <!-- <h2 class="logo">Logo</h2> -->
    <router-link v-if="isLogedIn && lists.length >= 1" to="/lists"
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
    lists() {
      return this.$store.getters.lists;
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

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgb(9, 102, 175);
}
</style>
