<template>
  <div>
    <input type="checkbox" @click="toggleChecked" :checked="isDone" />
    <section :class="{ done: isDone }">
      <h4>{{ title }}</h4>
      <p>{{ msg }}</p>
      <p>{{ date }} {{ time }}</p>
    </section>
    <w-button @click="removeItem" class="ma1" bg-color="error" shadow
      >delete</w-button
    >
  </div>
</template>
<script>
export default {
  props: ["idTodo", "title", "msg", "date", "time", "isDone"],
  emits: ["delete-todo", "change-state"],

  methods: {
    removeItem() {
      this.$emit("delete-todo", this.idTodo);
    },
    toggleChecked() {
      this.$emit("change-state", {
        isDone: !this.isDone,
        idTodo: this.idTodo,
      });
    },
  },
};
</script>
<style scoped>
div {
  border: 1px solid black;
  max-width: 20em;
  display: flex;
  justify-content: space-evenly;
  background-color: rgb(167, 208, 126);
  margin: 10px 0px 10px 0px;
  color: black;
}
section {
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
}
input {
  align-self: center;
}
button {
  align-self: center;
}

.done {
  text-decoration: line-through;
}
</style>
