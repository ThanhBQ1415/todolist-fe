<template>
  <el-form @submit.native.prevent="onSubmit" class="space-y-6">
    <div class="text-center mb-6">
      <h3 class="text-2xl font-bold text-gray-800 mb-2">Quên mật khẩu?</h3>
      <p class="text-gray-600">Nhập email để nhận link đặt lại mật khẩu</p>
    </div>
    <el-form-item label="Email" label-for="forgotEmail">
      <el-input
        id="forgotEmail"
        v-model="email"
        type="email"
        placeholder="Nhập email của bạn"
        required
        autocomplete="email"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        native-type="submit"
        :loading="isLoading"
        :disabled="isLoading"
        class="w-full"
      >
        {{ isLoading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu' }}
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
    isLoading: Boolean
  },
  data() {
    return {
      email: ''
    }
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.email);
    }
  }
}
</script>
