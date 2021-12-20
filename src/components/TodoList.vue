<template>
  <div class="list">
    <base-card>
      <w-card
        :title="header"
        title-class="blue-dark3--bg"
        color="white"
        class="box sh6"
      >
        <input
          type="text"
          v-if="isActive"
          :class="{ hide: !isActive }"
          @keypress.enter="submitNewName"
          v-model="nameofTodoList"
        />
        <span @click="changeName" v-if="!isActive" class="edit-control"
          >Edit
        </span>
        <select
          class="select-control"
          v-model="option"
          @change="filteredTodoes"
        >
          <option value="all">all</option>
          <option value="true">done</option>
          <option value="false">notdone</option>
        </select>

        <w-input
          outline
          inner-icon-left="wi-search"
          class="mb2 box bd2"
          type="text"
          placeholder="Search..."
          v-model="search"
          @change="filteredTodoes"
        />

        <todo-item
          v-for="todo in filteredTodoes()"
          :key="todo.idTodo"
          :idTodo="todo.idTodo"
          :title="todo.title"
          :isDone="todo.isDone"
          :msg="todo.msg"
          :id="todo.idTodo"
          :date="todo.date"
          :time="todo.time"
          @delete-todo="removeTodo"
          @change-state="changeState"
        ></todo-item>
        <div class="control-btns">
          <w-button @click="showForm" class="ma1" bg-color="success" shadow
            >Add new To Do</w-button
          >
          <w-button @click="deleteTodolist" class="ma1" bg-color="error" shadow>
            Delete TODOLIST
          </w-button>
        </div>
        <form class="form" v-if="isVisible">
          <w-input
            type="text"
            class="mb4"
            label="Title"
            shadow
            v-model="title"
            @blur="v$.title.$touch"
          />
          <div class="ma4" v-if="v$.title.$error">
            {{ v$.title.$errors[0].$message }}
          </div>
          <w-textarea no-autogrow rows="6" v-model="msg" @blur="v$.msg.$touch">
            Descripe What must to do..
          </w-textarea>
          <div class="ma4" v-if="v$.msg.$error">
            {{ v$.msg.$errors[0].$message }}
          </div>
          <w-input
            type="date"
            class="mb4"
            shadow
            v-model="date"
            @blur="v$.date.$touch"
          />
          <div class="ma4" v-if="v$.date.$error">
            Insert date as DD.MM.YYYY?
          </div>
          <w-input
            type="time"
            class="mb4"
            shadow
            v-model="time"
            @blur="v$.time.$touch"
          />
          <div class="ma4" v-if="v$.time.$error">Insert time as HH:MM</div>
          <w-button @click="addNewTask" class="pr5 pl5 pa2"
            >add new Task</w-button
          >
        </form>
      </w-card>
    </base-card>
  </div>
</template>
<script>
import TodoItem from "./TodoItem.vue";
import BaseCard from "./UI/BaseCard.vue";

import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  components: { TodoItem, BaseCard },
  props: ["header", "todoes", "idList"],
  emits: ["delete-todolist"],
  data() {
    return {
      v$: useValidate(),
      reqminLength: 2, // pre všetky inputy
      reqMaxLength: 50, // pre Title
      maxMsg: 999, // pre msg
      title: "",
      msg: "",
      date: "",
      time: "",
      search: "",
      nameofTodoList: "",
      isActive: false,
      option: "all",
      isVisible: false,
    };
  },
  validations() {
    return {
      title: {
        required,
        minLength: minLength(this.reqminLength),
        maxLegth: maxLength(this.reqMaxLength),
      },
      msg: {
        required,
        minLength: minLength(this.reqminLength),
        maxLegth: maxLength(this.maxMsg),
      },

      date: { required },
      time: { required },
    };
  },

  methods: {
    // add new task
    addNewTask() {
      // validácia
      this.v$.$validate();
      if (!this.v$.$error) {
        this.$store.dispatch(
          "addNewTask",
          {
            idList: this.idList,
            idTodo: (Math.random() * 1000).toFixed(0).toString(),
            title: this.title,
            msg: this.msg,
            date: this.date.split("-").reverse().join("."),
            time: this.time,
            isDone: false,
          },

          this.clearInputs(),
          this.v$.$reset()
        );
      } else {
        alert("Problem");
      }
    },

    clearInputs() {
      this.title = "";
      this.msg = "";
      this.date = "";
      this.time = "";
    },
    removeTodo(itemId) {
      this.$store.dispatch("removeTodo", {
        idTodo: itemId,
        idList: this.idList,
      });
    },
    changeState(item) {
      this.$store.dispatch("changeState", { item: item, idList: this.idList });
    },
    deleteTodolist() {
      this.$store.dispatch("deleteTodolistFromArr", this.idList);
    },

    filteredTodoes() {
      const allTodoes = this.todoes;
      const filteredItemBySearch = this.filteredBySearch(
        allTodoes,
        this.search
      );
      const filteredByDropdow = this.filterByDropdown(
        filteredItemBySearch,
        this.option
      );

      return filteredByDropdow;
    },

    filteredBySearch(allTodoes, searchQuery) {
      if (!searchQuery) return allTodoes;

      const filteredResults = allTodoes.filter((todo) =>
        todo.title.includes(searchQuery)
      );
      return filteredResults;
    },
    filterByDropdown(allTodoes, option) {
      const showAll = option === "all";
      if (showAll) return allTodoes;
      const filteredResults = allTodoes.filter(
        (todo) => todo.isDone == JSON.parse(option)
      );

      return filteredResults;
    },
    changeName() {
      this.isActive = true;
    },
    submitNewName() {
      this.isActive = false;
      this.$store.dispatch("submitNewName", {
        header: this.nameofTodoList,
        idList: this.idList,
      });
    },
    showForm() {
      this.v$.$reset(); // ak sa rozhodnem že nechcem a zavriem
      this.isVisible = !this.isVisible;
    },
  },
};
</script>
<style scoped>
form {
  width: 500px;
  color: black;
}
.list {
  display: flex;
  justify-content: space-evenly;
  margin: 50px 0px 50px 0px;
}
.item {
  display: flex;
  flex-direction: column;
}
.edit-control {
  color: white;
  font-size: 0.7rem;
  position: absolute;
  top: -12px;
  left: 10px;
  padding: 2px 5px 2px 5px;
  background-color: rgb(9, 102, 175);
  border-radius: 2px;
}
.edit-control:hover {
  cursor: pointer;
}
.select-control {
  position: absolute;
  top: 3%;
  left: 75%;
}
.select-control:hover {
  cursor: pointer;
}
.control-btns {
  display: flex;
  justify-content: space-between;
}
</style>
