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
      state.lists.map((list) => {
        if (list.idList === payload.idList) {
          list.todoes.push(payload);
        }
      });
    },
    // odoberie TODO z ARR TODOES
    removeTodo(state, payload) {
      state.lists.map((list) => {
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
      state.lists.map((list) => {
        if (list.idList === payload.idList) {
          list.header = payload.header;
        }
      });
    },
    // done --> not done --> done
    changeState(state, payload) {
      console.log(payload);
      state.lists.map((list) => {
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
        `https://whattodostevo-default-rtdb.firebaseio.com/lists/${userId}.json?auth=` +
          token
      );
      const responseData = (await response.json()) ?? {}; // ||
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
        `https://whattodostevo-default-rtdb.firebaseio.com/lists/${userId}/${idList}/todoes/${idTodo}.json?auth=` +
          token,
        {
          method: "PUT",
          body: JSON.stringify(newTodo),
        }
      );
      if (!response.ok) {
        //err handling
      }
      //// add to Local Storage in future PWA
      localStorage.setItem("newTodo", JSON.stringify(newTodo));
      context.commit("addNewTask", newTodo);
    },
    //// REMOVE TODO FROM TODOES --------------
    async removeTodo(context, payload) {
      const idList = payload.idList;
      const idTodo = payload.idTodo;
      const token = context.getters.getToken;
      const userId = context.getters.getUserId;

      const response = await fetch(
        `https://whattodostevo-default-rtdb.firebaseio.com/lists/${userId}/${idList}/todoes/${idTodo}.json?auth=` +
          token,
        {
          method: "DELETE",
          body: JSON.stringify(idTodo),
        }
      );
      if (!response.ok) {
        //.. err handling
      }
      context.commit("removeTodo", {
        idList: idList,
        idTodo: idTodo,
      });
    },
    //// ADD NEW TODOLIST IN LISTS
    async createNewTodoList(context, payload) {
      const id = payload.idList;
      const list = {
        header: payload.header,
        todoes: [],
        idList: payload.idList,
      };
      const token = context.getters.getToken;
      const userId = context.getters.getUserId;
      const response = await fetch(
        `https://whattodostevo-default-rtdb.firebaseio.com/lists/${userId}/${id}.json?auth=` +
          token,
        {
          method: "PUT",
          body: JSON.stringify(list),
        }
      );
      if (!response.ok) {
        //...err handling
      }
      //// add to Local Storage in future PWA
      localStorage.setItem("newTodoList", JSON.stringify(list));
      context.commit("addNewTodolist", list);
    },
    //// REMOVE TODOLIST FROM LISTS
    async deleteTodolistFromArr(context, payload) {
      const idList = payload;
      const token = context.getters.getToken;
      const userId = context.getters.getUserId;
      const response = await fetch(
        `https://whattodostevo-default-rtdb.firebaseio.com/lists/${userId}/${idList}.json?auth=` +
          token,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        // err.handling
      }

      context.commit("deleteTodolistFromArr", payload);
    },
    //// CHANGE NAME OF YOUR TODOLIST
    async submitNewName(context, payload) {
      const idList = payload.idList;
      const token = context.getters.getToken;
      const newHeader = {
        idList: payload.idList,
        header: payload.header,
      };
      const userId = context.getters.getUserId;
      const response = await fetch(
        `https://whattodostevo-default-rtdb.firebaseio.com/lists/${userId}/${idList}.json?auth=` +
          token,
        {
          method: "PATCH",
          body: JSON.stringify(newHeader),
        }
      );
      if (!response.ok) {
        //...err handling
      }
      context.commit("submitNewName", newHeader);
    },
    //// CHANGE STATE DONE || NOT DONE
    async changeState(context, payload) {
      const idList = payload.idList;
      const idTodo = payload.item.idTodo;
      const token = context.getters.getToken;

      const todo = {
        isDone: payload.item.isDone,
        idTodo: payload.item.idTodo,
        idList: payload.idList,
      };
      const userId = context.getters.getUserId;
      const response = await fetch(
        `https://whattodostevo-default-rtdb.firebaseio.com/lists/${userId}/${idList}/todoes/${idTodo}.json?auth=` +
          token,
        {
          method: "PATCH",
          body: JSON.stringify(todo),
        }
      );

      if (!response.ok) {
        //...err handling
      }

      context.dispatch("loadLists");

      context.commit("changeState", todo);
    },
    //// REGISTRATION NEW USER
    async registerUser(context, payload) {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC_PbFGQ112UmmNuGC7L2TFtboEZ-d8Q1w
  
      `,
        {
          method: "POST",
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
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
    async loginUser(context, payload) {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC_PbFGQ112UmmNuGC7L2TFtboEZ-d8Q1w`,
        {
          method: "POST",
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
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
