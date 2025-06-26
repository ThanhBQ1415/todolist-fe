<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
    <div class="bg-white rounded shadow-lg w-[1100px] max-w-full p-0 flex flex-col max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center px-6 py-4 border-b">
        <span class="mr-2">
          <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor"/>
            <path d="M8 8h8v8H8z" fill="currentColor"/>
          </svg>
        </span>
        <input v-model="form.title" class="ml-2 font-bold text-lg border-b border-blue-200 focus:border-blue-500 outline-none bg-transparent flex-1" />
        <button class="ml-auto" @click="handleCancel">
          <svg class="w-6 h-6 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <!-- Main content: 2 columns -->
      <div class="flex">
        <!-- Left column: main info -->
        <div class="flex-1 px-8 py-6 overflow-y-auto max-h-[70vh]">
          <!-- Status, dates, assignee -->
          <div class="flex items-center gap-2 mb-4">
            <span class="bg-gray-200 text-xs px-2 py-1 rounded">{{ getStatusName(statusId) }}</span>
            <span class="text-xs text-gray-500 ml-2">| Ngày tạo: {{ formatDate(taskData?.createdAt) }}</span>
            <span class="text-xs text-gray-500 ml-2">Phụ trách: <span class="font-semibold">{{ getUserName(form.assigneeId) }}</span></span>
          </div>
          <!-- Dates -->
          <div class="flex gap-4 mb-4">
            <div>
              <div class="text-xs text-gray-500 mb-1">Bắt đầu:</div>
              <input type="date" v-model="form.startDate" class="border px-2 py-1 rounded text-xs" />
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1">Kết thúc:</div>
              <input type="date" v-model="form.dueDate" class="border px-2 py-1 rounded text-xs" />
            </div>
          </div>
          <!-- Description -->
          <div class="mb-6">
            <div class="text-xs font-medium mb-1">Mô tả</div>
            <textarea v-model="form.description" class="w-full border px-2 py-1 rounded" rows="4"></textarea>
          </div>
      
          <!-- Files (placeholder) -->
          <div class="mb-6">
            <div class="text-xs font-medium mb-1">Tài liệu</div>
            <div class="text-xs text-blue-500 cursor-pointer">+ Thêm mới</div>
          </div>
          <!-- Comments -->
          <div class="mb-6">
            <div class="text-xs font-medium mb-1">Bình luận</div>
            <div v-if="loadingComments" class="text-xs text-gray-400 italic">Đang tải...</div>
            <div v-else-if="comments.length === 0" class="text-xs text-gray-400 italic">Chưa có bình luận</div>
            <div v-else class="space-y-2 mb-2">
              <div v-for="c in comments" :key="c.commentId" class="bg-gray-100 rounded px-3 py-2">
                <div class="text-xs text-gray-700 font-semibold mb-1">{{ getUserName(c.userId) }} <span class="text-gray-400 font-normal">{{ formatDate(c.createdAt) }}</span></div>
                <div class="text-sm text-gray-800">{{ c.content }}</div>
              </div>
            </div>
            <!-- New Comment -->
            <div class="flex gap-2 mt-2">
              <input v-model="newComment" :disabled="postingComment" @keyup.enter="postComment" type="text" placeholder="Nhập bình luận..." class="flex-1 border rounded px-2 py-1 text-sm focus:outline-none" />
              <button @click="postComment" :disabled="postingComment || !newComment.trim()" class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50">Gửi</button>
            </div>
          </div>
          <!-- Save/Cancel -->
          <div class="flex justify-end gap-2 mt-4">
            <button @click="handleCancel" class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Hủy</button>
            <button @click="handleSave" :disabled="!form.title.trim()" class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50">Lưu</button>
          </div>
        </div>
        <!-- Right sidebar -->
        <div class="w-72 border-l px-6 py-6 bg-gray-50">
          <div class="mb-6">
            <div class="text-xs text-gray-500">Người tạo</div>
            <div class="font-semibold">{{ getUserName(taskData?.creatorId) }}</div>
          </div>
          <div class="mb-6">
            <div class="text-xs text-gray-500">Giai đoạn</div>
            <div>{{ getPhase(taskData?.dueDate) }}</div>
          </div>
          <div class="mb-6">
            <div class="text-xs text-gray-500">Story point</div>
            <div class="text-gray-400">Chưa có</div>
          </div>
          <div class="mb-6">
            <div class="text-xs text-gray-500">Nhãn</div>
            <div class="flex flex-wrap gap-1 mt-1">
              <label v-for="label in labels" :key="label.labelId" class="flex items-center gap-1 text-xs cursor-pointer">
                <input type="checkbox" :value="label.labelId" :checked="form.labelId.includes(label.labelId)" @change="toggleLabel(label.labelId)" />
                <span :style="{ backgroundColor: label.color, color: '#fff', borderRadius: '4px', padding: '1px 6px' }">{{ label.name }}</span>
              </label>
            </div>
          </div>
          <div class="mb-6">
            <div class="text-xs text-gray-500">Hạng mục liên quan</div>
            <div class="text-blue-500 cursor-pointer">+ Thêm mới</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllComments, createComment } from '~/api/apiController';

export default {
  name: 'TaskDialog',
  props: {
    visible: Boolean,
    taskData: Object,
    users: Array,
    labels: Array,
    statusId: [String, Number],
    projectId: [String, Number],
    statusList: Array, 
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
      comments: [],
      loadingComments: false,
      newComment: '',
      postingComment: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.initForm();
        this.fetchComments();
      }
    },
    taskData: {
      handler() { this.initForm(); this.fetchComments(); },
      deep: true,
    }
  },
  methods: {
    initForm() {
      if (this.taskData) {
        this.form = {
          title: this.taskData.title || '',
          description: this.taskData.description || '',
          startDate: this.taskData.startDate ? this.taskData.startDate.substr(0, 10) : '',
          dueDate: this.taskData.dueDate ? this.taskData.dueDate.substr(0, 10) : '',
          assigneeId: this.taskData.assigneeId || '',
          labelId: Array.isArray(this.taskData.labelId) ? [...this.taskData.labelId] : [],
        };
      }
    },
    handleSave() {
      if (!this.form.title.trim()) return;
      this.$emit('update', {
        ...this.taskData,
        ...this.form,
        assigneeId: this.form.assigneeId || undefined,
        labelId: this.form.labelId.map(Number),
      });
      this.$emit('close');
    },
    handleCancel() {
      this.initForm();
      this.$emit('close');
    },
    toggleLabel(labelId) {
      labelId = Number(labelId);
      const idx = this.form.labelId.indexOf(labelId);
      if (idx === -1) {
        this.form.labelId.push(labelId);
      } else {
        this.form.labelId.splice(idx, 1);
      }
      this.form.labelId = this.form.labelId.map(Number);
    },
    getStatusName(id) {
      const list = this.statusList || this.$parent.statusList || [];
      const status = list.find(s => s.statusId === id);
      return status ? status.name : '';
    },
    getUserName(id) {
      const user = this.users?.find(u => u.userId === id);
      return user ? user.fullName : '';
    },
    getPhase(date) {
      return date ? new Date(date).toLocaleDateString('vi-VN') : '';
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const pad = n => n.toString().padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },
    getLabelsForTask(task) {
      if (!task.labelId || !Array.isArray(task.labelId)) return [];
      return this.labels.filter(l => task.labelId.includes(l.labelId));
    },
    async fetchComments() {
      if (!this.taskData || !this.taskData.taskId) {
        this.comments = [];
        return;
      }
      this.loadingComments = true;
      const res = await getAllComments();
      if (res.success && Array.isArray(res.data)) {
        this.comments = res.data.filter(c => c.taskId === this.taskData.taskId);
      } else {
        this.comments = [];
      }
      this.loadingComments = false;
    },
    async postComment() {
      if (!this.newComment.trim() || !this.taskData?.taskId) return;
      this.postingComment = true;
      const user = JSON.parse(localStorage.getItem('user')||'{}');
      const res = await createComment({
        content: this.newComment,
        userId: user.userId || 1,
        taskId: this.taskData.taskId,
      });
      if (res.success) {
        this.newComment = '';
        await this.fetchComments();
      }
      this.postingComment = false;
    },
  },
};
</script>