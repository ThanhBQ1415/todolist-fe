<template>
  <header class="bg-white shadow-sm p-4 flex justify-between items-center">

    <div class="flex items-center">
      <i class="el-icon-s-home h-10 w-10 text-blue-500 text-2xl cursor-pointer" @click="goProject"></i>
      <h1 class="text-xl font-bold ml-2">Quản lý công việc</h1>
    </div>


    <div class="flex items-center space-x-4">
      <el-button type="text" class="p-2 rounded-full hover:bg-gray-200">
        <i class="el-icon-bell h-8 w-8 text-gray-600"></i>
      </el-button>
      <el-button type="text" class="p-2 rounded-full hover:bg-gray-200">
        <i class="el-icon-setting h-8 w-8 text-gray-600"></i>
      </el-button>
      <el-dropdown trigger="click" placement="bottom-end">
        <span class="cursor-pointer">
          <img :src="user?.avatarUrl || 'https://via.placeholder.com/40'" alt="User Avatar" class="h-10 w-10 rounded-full">
        </span>
        <el-dropdown-menu slot="dropdown">
          <div class="bg-white rounded-lg shadow-lg p-4 min-w-[220px]">
            <div class="flex items-center mb-2">
              <img :src="user?.avatarUrl || 'https://via.placeholder.com/40'" class="h-10 w-10 rounded-full mr-2" />
              <div>
                <div class="font-semibold">{{ user?.fullName || '' }}</div>
                <div class="text-xs text-gray-500">{{ user?.email || '' }}</div>
              </div>
            </div>
            <el-divider class="my-2" />
            <el-menu class="border-0 shadow-none">
              <el-menu-item @click="goProfile"><i class="el-icon-user mr-2"></i> Trang cá nhân</el-menu-item>
              <el-menu-item @click="goChangePassword"><i class="el-icon-lock mr-2"></i> Đổi mật khẩu</el-menu-item>
              <el-menu-item @click="logout"><i class="el-icon-switch-button mr-2"></i> Đăng xuất</el-menu-item>
            </el-menu>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      user: null
    };
  },
  mounted() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
    window.addEventListener('user-avatar-updated', this.refreshUser);
  },
  beforeDestroy() {
    window.removeEventListener('user-avatar-updated', this.refreshUser);
  },
  methods: {
    refreshUser() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    },
    goProfile() {
      this.$router.push('/profile');
    },
    goChangePassword() {
      this.$router.push('/change-password');
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
    goProject() {
      this.$router.push('/project');
    },
  }
};
</script>
  