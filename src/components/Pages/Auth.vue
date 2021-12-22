<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An Error occured..."
      @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" fixed title="Autentificating...">
      <base-spinner></base-spinner
    ></base-dialog>
    <base-card class="control">
      <form @submit.prevent="submitForm">
        <label for="email"></label>
        <input
          type="email"
          id="email"
          v-model="inputEmail"
          placeholder="Email"
        />
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      inputEmail: "",
      inputPassword: "",
      mode: "login",
      isLoading: false,
      error: null,
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

    async submitForm() {
      try {
        this.isLoading = true;
        if (this.mode === "login") {
          await this.$store.dispatch("loginUser", {
            email: this.inputEmail,
            password: this.inputPassword,
          });
          this.isLoading = false;
        } else {
          this.isLoading = true;

          await this.$store.dispatch("registerUser", {
            email: this.inputEmail,
            password: this.inputPassword,
          });
        }
      } catch (err) {
        this.error = err.message || "Failed to auth! Try again later...";
      }
      this.isLoading = false;
      this.$router.replace("/create");
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>
<style scoped>
/* div {
  min-width: 300px;
  min-height: 300px;
} */
form {
  display: flex;
  flex-direction: column;
}
.control {
  margin: auto;
  max-width: 200px;
  margin-top: 50px;
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
