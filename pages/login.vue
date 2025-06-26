<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Đăng Nhập</h2>
      </div>

      <!-- Login Form -->
      <form v-if="!showForgotPassword && !showRegister" @submit.prevent="login" class="space-y-6">
        <div>
          <label for="email" class="block text-gray-700 text-sm font-semibold mb-2">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            placeholder="Nhập email của bạn"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          >
        </div>
        
        <div>
          <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">Mật khẩu</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="Nhập mật khẩu của bạn"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          >
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" v-model="rememberMe" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
            <span class="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
          </label>
        </div>

        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
          {{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
      </form>

      <!-- Forgot Password Form -->
      <form v-if="showForgotPassword" @submit.prevent="forgotPassword" class="space-y-6">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Quên mật khẩu?</h3>
          <p class="text-gray-600">Nhập email để nhận link đặt lại mật khẩu</p>
        </div>
        
        <div>
          <label for="forgotEmail" class="block text-gray-700 text-sm font-semibold mb-2">Email</label>
          <input 
            type="email" 
            id="forgotEmail" 
            v-model="forgotEmail" 
            required
            placeholder="Nhập email của bạn"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          >
        </div>

        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
          {{ isLoading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu' }}
        </button>
      </form>

      <!-- Register Form -->
      <form v-if="showRegister" @submit.prevent="register" class="space-y-6">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Tạo tài khoản mới</h3>
          <p class="text-gray-600">Điền thông tin để đăng ký</p>
        </div>
        
        <div>
          <label for="regName" class="block text-gray-700 text-sm font-semibold mb-2">Họ và tên</label>
          <input 
            type="text" 
            id="regName" 
            v-model="registerData.name" 
            required
            placeholder="Nhập họ và tên"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          >
        </div>

        <div>
          <label for="regEmail" class="block text-gray-700 text-sm font-semibold mb-2">Email</label>
          <input 
            type="email" 
            id="regEmail" 
            v-model="registerData.email" 
            required
            placeholder="Nhập email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          >
        </div>

        <div>
          <label for="regPassword" class="block text-gray-700 text-sm font-semibold mb-2">Mật khẩu</label>
          <input 
            type="password" 
            id="regPassword" 
            v-model="registerData.password" 
            required
            placeholder="Nhập mật khẩu"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          >
        </div>

        <div>
          <label for="regConfirmPassword" class="block text-gray-700 text-sm font-semibold mb-2">Xác nhận mật khẩu</label>
          <input 
            type="password" 
            id="regConfirmPassword" 
            v-model="registerData.confirmPassword" 
            required
            placeholder="Nhập lại mật khẩu"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          >
        </div>

        <button 
          type="submit"
          :disabled="isLoading || !passwordsMatch"
          class="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
          {{ isLoading ? 'Đang đăng ký...' : 'Đăng ký' }}
        </button>
      </form>

      <!-- Navigation Links -->
      <div class="mt-6 text-center space-y-3">
        <!-- Show when on login form -->
        <div v-if="!showForgotPassword && !showRegister" class="space-y-2">
          <button 
            @click="showForgotPassword = true"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
          >
            Quên mật khẩu?
          </button>
          <div class="text-gray-600 text-sm">
            Chưa có tài khoản? 
            <button 
              @click="showRegister = true"
              class="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>

        <!-- Show when on forgot password form -->
        <div v-if="showForgotPassword" class="space-y-2">
          <button 
            @click="backToLogin"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
          >
            ← Quay lại đăng nhập
          </button>
        </div>

        <!-- Show when on register form -->
        <div v-if="showRegister" class="space-y-2">
          <button 
            @click="backToLogin"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      </div>

     
    </div>
  </div>
</template>

<script>
import { loginUser, registerUser } from '../api/apiController';

export default {
  layout: 'login',
  data() {
    return {
      // Login form data
      email: '',
      password: '',
      rememberMe: false,
      
      // Forgot password data
      showForgotPassword: false,
      forgotEmail: '',
      
      // Register form data
      showRegister: false,
      registerData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      
      // UI state
      isLoading: false,
      alertMessage: '',
      alertType: 'success'
    };
  },
  computed: {
    passwordsMatch() {
      return this.registerData.password === this.registerData.confirmPassword;
    }
  },
  methods: {
    async login() {
      this.isLoading = true;
      this.clearAlert();
      try {
        const result = await loginUser({ email: this.email, password: this.password });
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

    async forgotPassword() {
      this.isLoading = true;
      this.clearAlert();
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Gửi email đặt lại mật khẩu cho:', this.forgotEmail);
        
        this.showAlert('Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.', 'success');
        this.backToLogin();
        
      } catch (error) {
        this.showAlert('Không thể gửi email. Vui lòng thử lại sau.', 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async register() {
      if (!this.passwordsMatch) {
        this.showAlert('Mật khẩu xác nhận không khớp!', 'error');
        return;
      }
      this.isLoading = true;
      this.clearAlert();
      try {
        const result = await registerUser({
          fullName: this.registerData.name,
          email: this.registerData.email,
          password: this.registerData.password
        });
        if (result.success) {
          this.showAlert('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
          this.backToLogin();
        } else {
          this.showAlert(result.error || 'Đăng ký thất bại. Vui lòng thử lại sau.', 'error');
        }
      } catch (error) {
        this.showAlert('Đăng ký thất bại. Vui lòng thử lại sau.', 'error');
      } finally {
        this.isLoading = false;
      }
    },

    backToLogin() {
      this.showForgotPassword = false;
      this.showRegister = false;
      this.clearAlert();
      this.resetForms();
    },

    resetForms() {
      this.email = '';
      this.password = '';
      this.rememberMe = false;
      this.forgotEmail = '';
      this.registerData = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      };
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
/* Custom styles if needed */
</style>