<template>
  <div class="flex flex-row justify-between items-start p-8">
    <div class="bg-white rounded-lg shadow p-8 w-2/3">
      <h2 class="text-2xl font-bold mb-6">Hồ sơ cá nhân</h2>
      <div class="grid grid-cols-2 gap-y-4 gap-x-8 text-base">
        <template v-if="user">      
          <template v-if="user.fullName">
            <div>Tên nhân sự</div>
            <div>{{ user.fullName }}</div>
          </template>
          <template v-if="user.email">
            <div>Email</div>
            <div>{{ user.email }}</div>
          </template>
          <template v-if="user.createdAt">
            <div>Ngày bắt đầu</div>
            <div>{{ formattedStartDate }}</div>
          </template>
        </template>
      </div>
    </div>
    <div class="flex flex-col items-center w-1/3">
      <div class="relative">
        <img 
          :src="userAvatarUrl" 
          class="rounded-full w-40 h-40 object-cover border" 
          alt="Avatar"
        />
        <label for="avatar-upload" class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow cursor-pointer hover:bg-gray-100">
          <i class="el-icon-camera text-xl"></i>
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/*" 
            class="hidden" 
            @change="onAvatarChange" 
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadAvatar } from '~/api/api-controller';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default {
  data() {
    return {
      user: null
    };
  },
  computed: {
    userAvatarUrl() {
      return this.user?.avatarUrl || 'https://via.placeholder.com/120';
    },
    formattedStartDate() {
      return formatDate(this.user?.createdAt);
    }
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    },
    async onAvatarChange(e) {
      const file = e.target.files[0];
      if (!file || !this.user) return;
      
      try {
        const result = await uploadAvatar(this.user.userId, file);
        if (result.success && result.data?.avatarUrl) {
          this.user.avatarUrl = result.data.avatarUrl + '?t=' + Date.now();
          localStorage.setItem('user', JSON.stringify(this.user));
          window.dispatchEvent(new Event('user-avatar-updated'));
          this.$message.success('Cập nhật ảnh đại diện thành công!');
        } else {
          this.$message.error(result.error || 'Upload ảnh thất bại!');
        }
      } catch (error) {
        this.$message.error('Upload ảnh thất bại!');
      }
    }
  }
};
</script>

<style scoped>
.relative { position: relative; }
</style>
