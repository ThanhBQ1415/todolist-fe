<template>
  <el-form @submit.native.prevent="onSubmit" class="space-y-6">
    <div class="text-center mb-6">
      <h3 class="text-2xl font-bold text-gray-800 mb-2">Tạo tài khoản mới</h3>
      <p class="text-gray-600">Điền thông tin để đăng ký</p>
    </div>
    <el-form-item label="Họ và tên" label-for="regName">
      <el-input
        id="regName"
        v-model="formData.fullName"
        type="text"
        placeholder="Nhập họ và tên"
        required
        autocomplete="name"
      />
    </el-form-item>
    <el-form-item label="Email" label-for="regEmail">
      <el-input
        id="regEmail"
        v-model="formData.email"
        type="email"
        placeholder="Nhập email"
        required
        autocomplete="email"
      />
    </el-form-item>
    <el-form-item label="Mật khẩu" label-for="regPassword">
      <el-input
        id="regPassword"
        v-model="formData.password"
        type="password"
        placeholder="Nhập mật khẩu"
        required
        autocomplete="new-password"
      />
    </el-form-item>
    <el-form-item label="Xác nhận mật khẩu" label-for="regConfirmPassword">
      <el-input
        id="regConfirmPassword"
        v-model="formData.confirmPassword"
        type="password"
        placeholder="Nhập lại mật khẩu"
        required
        autocomplete="new-password"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="success"
        native-type="submit"
        :loading="isLoading"
        :disabled="isLoading || !passwordsMatch"
        class="w-full"
      >
        {{ isLoading ? 'Đang đăng ký...' : 'Đăng ký' }}
      </el-button>
    </el-form-item>
    <div class="text-center mt-2">
      <el-button type="text" @click="$emit('back')" class="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200">
        ← Quay lại đăng nhập
      </el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  props: {
    isLoading: Boolean,
    passwordsMatch: Boolean,
    registerData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  watch: {
    registerData: {
      handler(newVal) {
        // Chỉ cập nhật khi thực sự cần thiết
        if (JSON.stringify(newVal) !== JSON.stringify(this.formData)) {
          this.formData = { ...newVal };
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    onSubmit() {
      // Emit data hiện tại khi submit
      this.$emit('submit', this.formData);
    }
  }
}
</script>
