let timer; // určené na autologout

import { createStore } from "vuex";
const store = createStore({
  state() {
    return {
      lists: [],

      userId: null,
      token: null,
      tokenExpiration: null,
      didAutoLogOut: false,
    };
  },
  getters: {
    lists(state) {
      return state.lists;
    },
    getToken(state) {
      return state.token;
    },
    getUserId(state) {
      return state.userId;
    },
    // vráti TRUE || FALSE či som alebo niesom prihlasený
    isAuth(state) {
      return !!state.token;
    },
    didAutoLogOut(state) {
      return state.didAutoLogOut;
    },
  },

  mutations: {
    // aktuálne listy
    setLists(state, payload) {
      state.lists = payload;
    },

    //// Prida todo
    addNewTask(state, payload) {
      state.lists.find((list) => {
        if (list.idList === payload.idList) {
          list.todoes.push(payload);
        }
      });
    },
    // odoberie TODO z ARR TODOES
    removeTodo(state, payload) {
      state.lists.find((list) => {
        list.todoes = list.todoes.filter(
          (todo) => todo.idTodo !== payload.idTodo
        );
      });
    },
    // pridá nový TODOLIST do ARR LISTS
    addNewTodolist(state, payload) {
      state.lists.unshift(payload);
    },
    // odoberie TODOLIST z ARR LISTS
    deleteTodolistFromArr(state, payload) {
      state.lists = state.lists.filter((list) => list.idList !== payload);
    },
    // po zvolení listu vieme prepisať
    submitNewName(state, payload) {
      state.lists.find((list) => {
        if (list.idList === payload.idList) {
          list.header = payload.header;
        }
      });
    },
    // done --> not done --> done
    changeState(state, payload) {
      // console.log(payload);
      state.lists.find((list) => {
        if (list.idList === payload.idList) {
          list.todoes.isDone = payload.isDone;
        }
      });
    },
    //// REGISTER AND LOG IN MUTATIONS
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.didLogOut = false;
    },
    setAutoLogOut(state) {
      state.didAutoLogOut = true;
    },
  },

  actions: {
    // LOAD LISTS FROM DATABASE
    async loadLists(context) {
      const userId = context.getters.getUserId;
      const token = context.getters.getToken;
      const response = await fetch(
        `${process.env.VUE_APP_URL}${userId}.json?auth=` + token 
      );
      const responseData = (await response.json()) ?? {};
      if (!response.ok) {
        // err handling
        const error = new Error(responseData.message || "FAIL TO FETCH ");
        throw error;
      }

      const lists = [];
      for (const key in responseData) {
        const list = {
          idList: key,
          header: responseData[key]?.header,
          todoes: Object.values(responseData[key]?.todoes ?? []),
        };

        lists.push(list);
      }

      context.commit("setLists", lists);
    },

    //// ADD NEW TODO TO TODOES --------------------------->
    async addNewTask(context, payload) {
      const idList = payload.idList;
      const idTodo = payload.idTodo;
      const token = context.getters.getToken;
      const newTodo = {
        ...payload,
      };
      const userId = context.getters.getUserId;
      const response = await fetch(
        `${process.env.VUE_APP_URL}${userId}/${idList}/todoes/${idTodo}.json?auth=` +
          token,
        {
          method: "PUT",
          body: JSON.stringify(newTodo),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(
          responseData.message ||
            "Nepodarilo sa vytvoriť novú položku zoznamu... skúste neskôr"
        );
        throw error;
      }

      localStorage.setItem("newTodo", JSON.stringify(newTodo));
      context.commit("addNewTask", newTodo);
    },
    //// REMOVE TODO FROM TODOES --------------
    async removeTodo(context, { idList, idTodo }) {
      const token = context.getters.getToken;
      const userId = context.getters.getUserId;

      const response = await fetch(
        `${process.env.VUE_APP_URL}${userId}/${idList}/todoes/${idTodo}.json?auth=` +
          token,
        {
          method: "DELETE",
          body: JSON.stringify(idTodo),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(
          responseData.message ||
            "Nepodarilo sa vymazať položku zoznamu ... skúste neskôr"
        );
        throw error;
      }
      context.commit("removeTodo", {
        idList: idList,
        idTodo: idTodo,
      });
    },
    //// ADD NEW TODOLIST IN LISTS
    async createNewTodoList(context, { header, idList }) {
      const list = {
        header: header,
        todoes: [],
        idList: idList,
      };
      const token = context.getters.getToken;
      const userId = context.getters.getUserId;
      const response = await fetch(
        `${process.env.VUE_APP_URL}${userId}/${idList}.json?auth=` + token,
        {
          method: "PUT",
          body: JSON.stringify(list),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(
          responseData.message ||
            "Nepodarilo sa vytvoriť nový list... skúste neskôr"
        );
        throw error;
      }
      localStorage.setItem("newTodoList", JSON.stringify(list));
      context.commit("addNewTodolist", list);
    },
    //// REMOVE TODOLIST FROM LISTS
    async deleteTodolistFromArr(context, idList) {
      const token = context.getters.getToken;
      const userId = context.getters.getUserId;
      const response = await fetch(
        `${process.env.VUE_APP_URL}${userId}/${idList}.json?auth=` + token,
        {
          method: "DELETE",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(
          responseData.message || "Nepodarilo sa vymazať... skúste neskôr"
        );
        throw error;
      }

      context.commit("deleteTodolistFromArr", idList);
    },
    //// CHANGE NAME OF YOUR TODOLIST
    async submitNewName(context, { header, idList }) {
      const token = context.getters.getToken;
      const newHeader = {
        idList: idList,
        header: header,
      };
      const userId = context.getters.getUserId;
      const response = await fetch(
        `${process.env.VUE_APP_URL}${userId}/${idList}.json?auth=` + token,
        {
          method: "PATCH",
          body: JSON.stringify(newHeader),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(
          responseData.message || "Nepodarilo sa upraviť... skúste neskôr"
        );
        throw error;
      }
      context.commit("submitNewName", newHeader);
    },
    //// CHANGE STATE DONE || NOT DONE
    async changeState(context, { item, idList }) {
      const idTodo = item.idTodo;
      const token = context.getters.getToken;

      const todo = {
        isDone: item.isDone,
        idTodo: item.idTodo,
        idList: idList,
      };
      const userId = context.getters.getUserId;
      const response = await fetch(
        `${process.env.VUE_APP_URL}${userId}/${idList}/todoes/${idTodo}.json?auth=` +
          token,
        {
          method: "PATCH",
          body: JSON.stringify(todo),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        //...err handling
        const error = new Error(
          responseData.message || "Nepodarilo sa upraviť... skúste neskôr"
        );
        throw error;
      }

      context.dispatch("loadLists");
      context.commit("changeState", todo);
    },
    //// REGISTRATION NEW USER
    async registerUser(context, { email, password }) {
      const response = await fetch(
        `${process.env.VUE_APP_URL_REG_LOG}signUp?key=${process.env.VUE_APP_KEY}
  
      `,
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        // err. handling
        const error = new Error(responseData.message || "Fail to auth!");
        throw error;
      }
      context.commit("setUser", {
        token: responseData.idToken,
        userId: responseData.localId,
        tokenExpiration: responseData.expiresIn,
      });
    },
    //// LOGIN USER
    async loginUser(context, { email, password }) {
      const response = await fetch(
        `${process.env.VUE_APP_URL_REG_LOG}signInWithPassword?key=${process.env.VUE_APP_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        // err. handling

        const error = new Error(responseData.message || "Fail to auth!");
        throw error;
      }
      /// ADD TO LOCAL STORAGE DATA
      const expiresIn = +responseData.expiresIn * 1000; // automaticky odhlási po 1h
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);
      localStorage.setItem("tokenExpiration", expirationDate);
      timer = setTimeout(function () {
        context.dispatch("didAutoLogOut");
      }, expiresIn);

      context.commit("setUser", {
        token: responseData.idToken,
        userId: responseData.localId,
      });
    },
    //// LOG OUT
    logOutUser(context) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenExpiration");
      clearTimeout(timer);
      context.commit("setUser", {
        token: null,
        userId: null,
      });
    },
    tryLogin(context) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const tokenExpiration = localStorage.getItem("tokenExpiration");

      const expiresIn = +tokenExpiration - new Date().getTime();
      if (expiresIn < 0) {
        return;
      }
      timer = setTimeout(function () {
        context.dispatch("didAutoLogOut");
      }, expiresIn);
      if (token && userId) {
        context.commit("setUser", {
          token: token,
          userId: userId,
        });
      }
    },
    didAutoLogOut(context) {
      context.dispatch("logOutUser");
      context.commit("setAutoLogOut");
    },
  },
});

export default store;
