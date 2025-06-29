<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Đăng Nhập</h2>
      </div>

      <!-- Alert -->
      <el-alert
        v-if="alertMessage"
        :title="alertMessage"
        :type="alertType"
        show-icon
        class="mb-4"
        @close="clearAlert"
        closable
      />

      <!-- Login Form -->
      <el-form v-if="formType === 'login'" @submit.native.prevent="login" class="space-y-6">
        <el-form-item label="Email" label-for="email">
          <el-input
            id="email"
            v-model="loginForm.email"
            type="email"
            placeholder="Nhập email của bạn"
            required
            autocomplete="email"
          />
        </el-form-item>
        <el-form-item label="Mật khẩu" label-for="password">
          <el-input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="Nhập mật khẩu của bạn"
            required
            autocomplete="current-password"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.rememberMe">Ghi nhớ đăng nhập</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="isLoading"
            :disabled="isLoading"
            class="w-full"
          >
            {{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- Forgot Password Form -->
      <ForgotPassword
        v-if="formType === 'forgot'"
        :is-loading="isLoading"
        @submit="forgotPassword"
        @back="showLogin"
      />

      <!-- Register Form -->
      <Register
        v-if="formType === 'register'"
        :is-loading="isLoading"
        :passwords-match="passwordsMatch"
        :register-data="registerForm"
        @update:register-data="val => registerForm = val"
        @submit="register"
        @back="showLogin"
      />

      <!-- Navigation Links -->
      <div class="mt-6 text-center space-y-3">
        <div v-if="formType === 'login'" class="space-y-2">
          <el-button
            type="text"
            @click="showForgot"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
          >
            Quên mật khẩu?
          </el-button>
          <div class="text-gray-600 text-sm">
            Chưa có tài khoản?
            <el-button
              type="text"
              @click="showRegister"
              class="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
            >
              Đăng ký ngay
            </el-button>
          </div>
        </div>
        <div v-else class="space-y-2">
          <el-button
            type="text"
            @click="showLogin"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
          >
            Quay lại đăng nhập
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ForgotPassword from '~/components/login/ForgotPassword.vue';
import Register from '~/components/login/Register.vue';
import { loginUser, registerUser } from '../api/api-controller';

export default {
  layout: 'login',
  components: { ForgotPassword, Register },
  data() {
    return {
      formType: 'login', // 'login' | 'register' | 'forgot'
      loginForm: {
        email: '',
        password: '',
        rememberMe: false,
      },
      registerForm: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      isLoading: false,
      alertMessage: '',
      alertType: 'success'
    };
  },
  computed: {
    passwordsMatch() {
      return this.registerForm.password === this.registerForm.confirmPassword;
    }
  },
  methods: {
    showLogin() { this.formType = 'login'; this.clearAlert(); this.resetForms(); },
    showRegister() { this.formType = 'register'; this.clearAlert(); this.resetForms(); },
    showForgot() { this.formType = 'forgot'; this.clearAlert(); this.resetForms(); },
    async login() {
      this.isLoading = true;
      this.clearAlert();
      try {
        const result = await loginUser({ email: this.loginForm.email, password: this.loginForm.password });
        if (result.success) {
          this.showAlert(result.message, 'success');
          this.$router.push('/project');
        } else {
          this.showAlert(result.message, 'error');
        }
      } catch (error) {
        this.showAlert('Đăng nhập thất bại. Vui lòng thử lại sau.', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    async forgotPassword(email) {
      this.isLoading = true;
      this.clearAlert();
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.showAlert('Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.', 'success');
        this.showLogin();
      } catch (error) {
        this.showAlert('Không thể gửi email. Vui lòng thử lại sau.', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    async register(formData) {
      if (!this.passwordsMatch) {
        this.showAlert('Mật khẩu xác nhận không khớp!', 'error');
        return;
      }
      this.isLoading = true;
      this.clearAlert();
      try {
        const result = await registerUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        });
        if (result.success) {
          this.showAlert('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
          this.showLogin();
        } else {
          this.showAlert(result.error || 'Đăng ký thất bại. Vui lòng thử lại sau.', 'error');
        }
      } catch (error) {
        this.showAlert('Đăng ký thất bại. Vui lòng thử lại sau.', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    resetForms() {
      this.loginForm = { email: '', password: '', rememberMe: false };
      this.registerForm = { fullName: '', email: '', password: '', confirmPassword: '' };
    },
    showAlert(message, type = 'success') {
      this.alertMessage = message;
      this.alertType = type;
    },
    clearAlert() {
      this.alertMessage = '';
    }
  }
};
</script>

<style scoped>

</style>