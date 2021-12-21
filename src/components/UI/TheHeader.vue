<template>
  <ul>
    <router-link to="/">Edit your To do Lists</router-link>
    <router-link to="/create">Create New Todo List</router-link>
    <router-link to="/auth">Log in</router-link>
  </ul>
</template>

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
