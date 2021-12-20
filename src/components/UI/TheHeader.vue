<template>
  <ul>
    <router-link to="/">Edit your To do Lists</router-link>
    <router-link to="/create">Create New Todo List</router-link>
    <router-link to="/login">Login</router-link>
    <w-button @click="load">LoadLists</w-button>
  </ul>
</template>
<script>
export default {
  methods: {
    load() {
      this.$store.dispatch("loadLists");
    },
  },
};
</script>

<style scoped>
ul {
  width: 100%;
  height: 50px;
  background-color: rgb(9, 102, 175);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20em;
}
a {
  color: white;
}
a.router-link-active {
  color: rgb(233, 0, 0);
}
</style>
