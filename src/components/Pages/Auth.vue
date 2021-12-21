<template>
  <base-card class="control">
    <form @submit.prevent="submitForm">
      <label for="email"></label>
      <input type="email" id="email" v-model="inputEmail" placeholder="Email" />
      <label for="password"></label>
      <input
        type="password"
        id="password"
        v-model="inputPassword"
        placeholder="Password"
      />
      <div class="btns">
        <button
          :class="{ register: mode == 'register', login: mode == 'login' }"
        >
          {{ actionMode }}
        </button>
        <button
          type="button"
          @click="switchMode"
          :class="{ register: mode == 'login', login: mode == 'register' }"
        >
          {{ buttonMode }}
        </button>
      </div>
    </form>
  </base-card>
</template>
<script>
export default {
  data() {
    return {
      inputEmail: "",
      inputPassword: "",
      mode: "login",
    };
  },

  computed: {
    buttonMode() {
      if (this.mode === "login") {
        return "Register instead";
      } else {
        return "Login instead";
      }
    },
    actionMode() {
      if (this.mode === "login") {
        return "Login";
      } else {
        return "Register";
      }
    },
  },

  methods: {
    switchMode() {
      if (this.mode === "login") {
        this.mode = "register";
      } else {
        this.mode = "login";
      }
    },
    submitForm() {
      if (this.mode === "login") {
        // dispatch login action
      } else {
        this.$store.dispatch("registerUser", {
          email: this.inputEmail,
          password: this.inputPassword,
        });
      }
    },
  },
};
</script>
<style scoped>
form {
  display: flex;
  flex-direction: column;
}
.control {
  margin: auto;
}
.btns {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 15px;
}
button {
  justify-self: center;
  align-self: center;
}
input,
button {
  padding: 10px;
}
.register {
  background: rgb(242, 0, 0);
  color: white;
}
.login {
  background: rgb(45, 40, 219);
  color: white;
}
</style>
