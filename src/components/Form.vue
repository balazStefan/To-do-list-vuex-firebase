<template>
  <div>
    <header>
      <h2>Create new Todolist?</h2>
      <p>Type below new name of your To do List</p>
    </header>
    <form>
      <w-input
        label="New To Do list Name"
        class="mb2"
        outline
        bg-color="blue-light5"
        v-model="header"
        @blur="v$.header.$touch"
      ></w-input>
      <div v-if="v$.header.$error">{{ v$.header.$errors[0].$message }}</div>
      <w-button @click="addNewTodoList" class="btn-control">
        Add new TodoList</w-button
      >
    </form>
  </div>
</template>
<script>
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { uuid } from "vue-uuid";
export default {
  data() {
    return {
      v$: useValidate(),
      uuid: uuid.v1(),
      todolists: [],
      header: "",
      minLength: 2,
      maxLength: 20,
    };
  },
  validations() {
    return {
      header: {
        required,
        minLength: minLength(this.minLength),
        maxLength: maxLength(this.maxLength),
      },
    };
  },
  methods: {
    addNewTodoList() {
      this.v$.$validate();
      if (!this.v$.$error) {
        const newTodoList = {
          header: this.header,
          idList: this.uuid,
        };

        this.header = "";
        this.$store.dispatch("createNewTodoList", newTodoList);
        this.$router.push("/lists");
      } else {
        alert("problem");
      }
    },
  },
};
</script>
<style scoped>
div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
}

.btn-control {
  margin-top: 10%;
  width: 100%;
}
</style>
