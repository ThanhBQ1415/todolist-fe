<template>
  <header class="bg-white shadow-sm p-4 flex justify-between items-center">

    <div class="flex items-center">
      <i class="el-icon-s-home h-10 w-10 text-blue-500 text-2xl"></i>
      <h1 class="text-xl font-bold ml-2">Quản lý công việc</h1>
    </div>


    <div class="flex items-center space-x-4">
      <el-button type="text" class="p-2 rounded-full hover:bg-gray-200">
        <i class="el-icon-bell h-8 w-8 text-gray-600"></i>
      </el-button>
      <el-button type="text" class="p-2 rounded-full hover:bg-gray-200">
        <i class="el-icon-setting h-8 w-8 text-gray-600"></i>
      </el-button>
      <img v-if="user" :src="user.avatarUrl || 'https://via.placeholder.com/40'" alt="User Avatar" class="h-10 w-10 rounded-full">
      <div v-else class="h-10 w-10 rounded-full bg-gray-300"></div>
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
  }
};
</script>
  