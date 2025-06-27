<template>
  <el-dialog :visible.sync="visible" title="Thêm task mới" width="400px" :close-on-click-modal="false" :show-close="false" custom-class="rounded">
    <el-form label-position="top" @submit.native.prevent>
      <el-form-item label="Tên task">
        <el-input v-model="form.title" placeholder="Nhập tên task" />
      </el-form-item>
      <el-form-item label="Mô tả">
        <el-input type="textarea" v-model="form.description" placeholder="Nhập mô tả" :rows="2" />
      </el-form-item>
      <div class="flex gap-2 mb-2">
        <el-form-item label="Ngày bắt đầu" class="flex-1">
          <el-input type="date" v-model="form.startDate" />
        </el-form-item>
        <el-form-item label="Ngày kết thúc" class="flex-1">
          <el-input type="date" v-model="form.dueDate" />
        </el-form-item>
      </div>
      <el-form-item label="Gán cho">
        <el-select v-model="form.assigneeId" placeholder="-- Chọn người --" filterable clearable>
          <el-option v-for="user in users" :key="user.userId" :label="user.fullName" :value="user.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="Nhãn">
        <el-checkbox-group v-model="form.labelId">
          <el-checkbox v-for="label in labels" :key="label.labelId" :label="label.labelId">
            <span :style="{ backgroundColor: label.color, color: '#fff', borderRadius: '4px', padding: '1px 6px' }">{{ label.name }}</span>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="flex justify-end gap-2 mt-4">
        <el-button @click="$emit('close')">Hủy</el-button>
        <el-button type="primary" @click="submit" :disabled="!form.title.trim()">Thêm</el-button>
      </div>
    </el-form>
  </el-dialog>
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
