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
  watch: {
    lists() {
      if (this.lists <= 0) {
        this.redirectedToCreate();
      }
    },
  },
  methods: {
    load() {
      this.$store.dispatch("loadLists");
    },
    redirectedToCreate() {
      // ak mam 0 listov pošle ma na /create na vytvorenie nového
      this.$router.replace("/create");
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
