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
    <base-card>
      <form @submit.prevent="submitForm" class="input_fields pa5 box sh6">
        <w-input
          type="email"
          id="email"
          v-model="inputEmail"
          placeholder="Email"
          shadow
          inner-icon-left="mdi mdi-account"
          color="primary-light"
          @blur="v$.inputEmail.$touch"
        />
        <div class="error" v-if="v$.inputEmail.$error">
          {{ v$.inputEmail.$errors[0].$message }}
        </div>

        <w-input
          class="pt5"
          placeholder="Password"
          id="password"
          :type="isPassword ? 'password' : 'text'"
          :inner-icon-left="isPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
          color="primary-light"
          @click:inner-icon-left="isPassword = !isPassword"
          v-model="inputPassword"
          shadow
          @blur="v$.inputPassword.$touch"
        >
        </w-input>
        <div class="error" v-if="v$.inputPassword.$error">
          {{ v$.inputPassword.$errors[0].$message }}
        </div>
        <!-- <w-input
          v-if="mode == 'register'"
          class="pt5"
          placeholder="Confirm password"
          id="confirmPassword"
          :type="isConfirmPassWord ? 'password' : 'text'"
          :inner-icon-left="
            isConfirmPassWord ? 'mdi mdi-eye-off' : 'mdi mdi-eye'
          "
          color="primary-light"
          @click:inner-icon-left="isConfirmPassWord = !isConfirmPassWord"
          v-model="inputConfirmPassword"
          shadow
          @blur="v$.inputConfirmPassword.$touch"
        >
        </w-input>
        <div class="error" v-if="v$.inputConfirmPassword.$error">
          Password is not same !
        </div> -->

        <w-flex class="my5" justify-space-around>
          <button
            class="box sh-6"
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
        </w-flex>
      </form>
    </base-card>
  </div>
</template>
<script>
import useValidate from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  email,
  // sameAs,
} from "@vuelidate/validators";
export default {
  data() {
    return {
      v$: useValidate(),
      inputEmail: "",
      inputPassword: "",
      mode: "login",
      isLoading: false,
      error: null,
      isPassword: true,
      minLength: 6,
      maxLength: 50,
      // email, ??
      // inputConfirmPassword: "",
      // isConfirmPassWord: true,
      // sameAs,
    };
  },
  validations() {
    return {
      inputEmail: {
        required,
        email,
      },
      inputPassword: {
        required,
        minLength: minLength(this.minLength),
        maxLength: maxLength(this.maxLength),
      },
      // inputConfirmPassword: {
      //   inputConfirmPassword: sameAs(this.inputPassword),
      // },
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
      this.v$.$validate();
      if (!this.v$.$error) {
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
        this.$router.replace("/lists");
      }
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>
<style scoped>
button {
  padding: 10px;
  border: 1px solid rgb(196, 155, 155);
  border-radius: 6px;
}
button:hover {
  cursor: pointer;
}
.register {
  background: rgb(242, 0, 0);
  color: white;
  font-weight: bold;
}
.login {
  background: rgb(87, 83, 206);
  color: white;
  font-weight: bold;
}
.input_fields {
  max-width: 360px;
  margin: 100px auto;
}
</style>
