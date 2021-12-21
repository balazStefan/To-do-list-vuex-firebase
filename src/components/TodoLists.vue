<template>
  <div class="wrapper">
    <todo-list
      v-for="list in lists"
      :key="list.idList"
      :todoes="list.todoes"
      :header="list.header"
      :idList="list.idList"
    >
    </todo-list>
  </div>
</template>
<script>
import TodoList from "./TodoList.vue";

export default {
  components: { TodoList },
  data() {
    return {};
  },

  created() {
    this.load();
  },
  computed: {
    lists() {
      return this.$store.getters.lists;
    },
  },
  methods: {
    load() {
      this.$store.dispatch("loadLists");
    },
  },
};
</script>
<style scoped>
div {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-wrap: wrap;
  flex-flow: row wrap;
}
</style>
