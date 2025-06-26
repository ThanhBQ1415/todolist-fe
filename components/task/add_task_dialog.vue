<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
    <div class="bg-white rounded shadow-lg p-6 w-96">
      <div class="font-semibold mb-2">Thêm task mới</div>
      <div class="mb-2">
        <label class="block text-xs font-medium mb-1">Tên task</label>
        <input v-model="form.title" placeholder="Nhập tên task" class="w-full border px-2 py-1 rounded" />
      </div>
      <div class="mb-2">
        <label class="block text-xs font-medium mb-1">Mô tả</label>
        <textarea v-model="form.description" placeholder="Nhập mô tả" class="w-full border px-2 py-1 rounded" rows="2"></textarea>
      </div>
      <div class="flex gap-2 mb-2">
        <div class="flex-1">
          <label class="block text-xs font-medium mb-1">Ngày bắt đầu</label>
          <input type="date" v-model="form.startDate" class="w-full border px-2 py-1 rounded" />
        </div>
        <div class="flex-1">
          <label class="block text-xs font-medium mb-1">Ngày kết thúc</label>
          <input type="date" v-model="form.dueDate" class="w-full border px-2 py-1 rounded" />
        </div>
      </div>
      <div class="mb-2">
        <label class="block text-xs font-medium mb-1">Gán cho</label>
        <select v-model="form.assigneeId" class="w-full border px-2 py-1 rounded">
          <option value="">-- Chọn người --</option>
          <option v-for="user in users" :key="user.userId" :value="user.userId">{{ user.fullName }}</option>
        </select>
      </div>
      <div class="mb-2">
        <label class="block text-xs font-medium mb-1">Nhãn</label>
        <div class="flex flex-wrap gap-2">
          <label v-for="label in labels" :key="label.labelId" class="flex items-center gap-1 text-xs cursor-pointer">
            <input type="checkbox" :value="label.labelId" v-model="form.labelId" />
            <span :style="{ backgroundColor: label.color, color: '#fff', borderRadius: '4px', padding: '1px 6px' }">{{ label.name }}</span>
          </label>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <button @click="$emit('close')" class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Hủy</button>
        <button @click="submit" :disabled="!form.title.trim()" class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50">Thêm</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddTaskDialog',
  props: {
    visible: Boolean,
    users: Array,
    labels: Array,
    statusId: [String, Number],
    projectId: [String, Number],
  },
  data() {
    return {
      form: {
        title: '',
        description: '',
        startDate: '',
        dueDate: '',
        assigneeId: '',
        labelId: [],
      },
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.resetForm();
      }
    },
  },
  methods: {
    resetForm() {
      this.form = {
        title: '',
        description: '',
        startDate: '',
        dueDate: '',
        assigneeId: '',
        labelId: [],
      };
    },
    submit() {
      if (!this.form.title.trim()) return;
      this.$emit('submit', {
        ...this.form,
        statusId: this.statusId,
        projectId: this.projectId,
      });
    },
  },
};
</script>
