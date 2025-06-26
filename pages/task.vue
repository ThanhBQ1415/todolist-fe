<template>
  <div class="bg-gray-100 ">
    <!-- Header & Filter Bar (luôn cố định trên cùng) -->
    <div class="flex flex-wrap items-center mb-4 gap-2 bg-gray-100 z-10 sticky top-0">
      <span class="text-sm text-gray-700 font-medium">Xem theo: <span class="font-semibold">Trạng thái</span></span>
      <span class="text-sm text-gray-700 ml-4">Giai đoạn: <span class="font-semibold">4-6/2025</span></span>
      <span class="ml-4 flex items-center text-sm text-gray-700">
        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M3 12h18M3 18h18"/></svg>
        Bộ lọc:
      </span>
      <input type="text" placeholder="Tìm hoặc nhập điều kiện" class="ml-2 px-2 py-1 border border-gray-200 rounded bg-gray-50 text-xs focus:outline-none w-56" 
        v-model="searchTitle"
        @input="onSearchTitleInput"
      />
      <div class="ml-auto flex gap-2">
        <button class="w-9 h-9 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor"/><path d="M8 8h8v8H8z" fill="currentColor"/></svg>
        </button>
        <button class="w-9 h-9 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg>
        </button>
      </div>
    </div>


    <div class="overflow-x-auto" style="height: 80vh;">
      <div class="flex flex-row gap-8 h-full min-h-0">
        <Container orientation="horizontal" @drop="onColumnDrop">
          <Draggable v-for="(col, colIdx) in columns" :key="col.statusId">
            <div class="bg-white rounded-lg shadow flex flex-col w-[350px] min-w-[350px] max-w-[350px] h-[600px]">
              <div
                class="w-80 h-30 border-b-2 flex items-center font-bold text-xs "
                :style="{ borderColor: getStatusColor(col.name) }"
              >
                <span class="mr-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" fill="#F3F4F6" stroke="#D1D5DB"/></svg>
                </span>
                <span :style="{ color: getStatusColor(col.name) }">{{ col.name.toUpperCase() }}</span>
                <span class="ml-auto flex items-center gap-2">
                  <span class="flex items-center text-red-500 font-normal text-xs">
                    <svg class="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                    {{ col.stars || 0 }}
                  </span>
                  <span class="flex items-center text-yellow-500 font-normal text-xs">
                    <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor"/><path d="M8 8h8v8H8z" fill="currentColor"/></svg>
                    {{ col.tasks ? col.tasks.length : 0 }}
                  </span>
                  <button class="ml-2 p-1 rounded hover:bg-gray-100">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg>
                  </button>
                </span>
              </div>
              <div class="flex-1 overflow-y-auto">
                <Container group-name="tasks" :get-child-payload="i => ({ ...col.tasks[i], sourceColIdx: colIdx })" @drop="e => onTaskDrop(colIdx, e)">
                  <Draggable v-for="(task, tIdx) in col.tasks" :key="task.taskId">
                    <div class="bg-gray-50 rounded p-2 mb-2 shadow text-xs cursor-pointer" @click="openTaskDetail(task)">
                      <div class="font-semibold text-gray-800">{{ task.taskId }}. {{ task.title }}</div>
                      <div class="text-gray-500">{{ task.description }}</div>
                      <div class="text-gray-400 mt-1">
                        {{ formatDate(task.startDate) }} - {{ formatDate(task.dueDate) }}
                      </div>
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span v-for="label in getLabelsForTask(task)" :key="label.labelId" :style="{ backgroundColor: label.color, color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }">
                          {{ label.name }}
                        </span>
                      </div>
                    </div>
                  </Draggable>
                  <div v-if="col.name && col.name.toUpperCase() === 'NEW'" class="px-2 py-2 bg-gray-50 rounded-b flex items-center cursor-pointer hover:bg-gray-100" @click="showAddTaskDialog(col.statusId)">
                    <span class="text-blue-500 text-sm font-medium flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                      Thêm task
                    </span>
                  </div>
                </Container>
              </div>
            </div>
          </Draggable>
        </Container>
      </div>
    </div>
    <!-- Dialogs -->
    <AddTaskDialog
      :visible="addTaskDialog.visible"
      :users="users"
      :labels="labels"
      :statusId="addTaskDialog.statusId"
      :projectId="projectId"
      @close="addTaskDialog.visible=false"
      @submit="handleAddTaskSubmit"
    />
    <TaskDetailDialog
      :visible="taskDetailDialog.visible"
      :taskData="taskDetailDialog.task"
      :users="users"
      :labels="labels"
      :statusId="taskDetailDialog.task.statusId"
      :projectId="taskDetailDialog.task.projectId"
      @close="taskDetailDialog.visible=false"
      @update="handleUpdateTask"
    />
    
  </div>
</template>

<script>
import { getAllStatuses, getTasksByStatus, updateTaskStatusPatch, searchTasksByTitle, getAllLabels, createTask, getAllUsers, updateTask } from '~/api/apiController';
import { Container, Draggable } from 'vue-smooth-dnd';
import AddTaskDialog from '~/components/task/add_task_dialog.vue';
import TaskDetailDialog from '~/components/task/task_detail_dialog.vue';

const STATUS_COLORS = {
  'DELIVERY': '#7c3aed',
  'BACKLOGS': '#222',
  'MỚI': '#6b7280',
  'DEV IN PROGRESS': '#f59e42',
  'CODE REVIEWING': '#06b6d4',
};

export default {
  components: { Container, Draggable, AddTaskDialog, TaskDetailDialog },
  data() {
    return {
      columns: [],
      projectId: null,
      searchTitle: '',
      labels: [],
      users: [],
      addTaskDialog: {
        visible: false,
        title: '',
        description: '',
        startDate: '',
        dueDate: '',
        assigneeId: '',
        labelId: [],
        statusId: null,
      },
      statusList: [],
      taskDetailDialog: {
        visible: false,
        task: {},
      },
    };
  },
  async mounted() {
    this.projectId = this.$route.query.projectId;
    await this.fetchColumnsAndTasks();
    const labelRes = await getAllLabels();
    if (labelRes.success && Array.isArray(labelRes.data)) {
      this.labels = labelRes.data;
    }
    const userRes = await getAllUsers();
    if (userRes.success && Array.isArray(userRes.data)) {
      this.users = userRes.data;
    }
    const statusRes = await getAllStatuses();
    if (statusRes.success && Array.isArray(statusRes.data)) {
      this.statusList = statusRes.data;
    }
  },
  methods: {
    async fetchColumnsAndTasks() {
      const res = await getAllStatuses();
      if (res.success && Array.isArray(res.data)) {
        const columns = await Promise.all(res.data.map(async (col) => {
          const taskRes = await getTasksByStatus(col.statusId, this.projectId);
          return {
            ...col,
            tasks: taskRes.success && Array.isArray(taskRes.data) ? taskRes.data : [],
            stars: Math.floor(Math.random() * 600),
          };
        }));
        this.columns = columns;
      } else {
        this.columns = [];
      }
    },
    getStatusColor(name) {
      return STATUS_COLORS[name?.toUpperCase()] || '#6b7280';
    },
    onColumnDrop(dropResult) {
    },
    onTaskDrop(destColIdx, dropResult) {
      if (!dropResult || dropResult.addedIndex == null) return;
      const { payload } = dropResult;
      if (!payload || payload.sourceColIdx === undefined) return;

      const sourceColIdx = payload.sourceColIdx;
      const sourceCol = this.columns[sourceColIdx];
      const destCol = this.columns[destColIdx];
      const task = payload; 

      if (sourceColIdx === destColIdx) {
        const moved = sourceCol.tasks.splice(dropResult.removedIndex, 1)[0];
        sourceCol.tasks.splice(dropResult.addedIndex, 0, moved);
        this.$set(this.columns, sourceColIdx, { ...sourceCol, tasks: [...sourceCol.tasks] });
        return;
      }

      updateTaskStatusPatch(task.taskId, destCol.statusId).then(res => {
        if (res.success) {
          sourceCol.tasks = sourceCol.tasks.filter(t => t.taskId !== task.taskId);
          destCol.tasks.splice(dropResult.addedIndex, 0, { ...task, statusId: destCol.statusId });
          this.$set(this.columns, sourceColIdx, { ...sourceCol, tasks: [...sourceCol.tasks] });
          this.$set(this.columns, destColIdx, { ...destCol, tasks: [...destCol.tasks] });
        } else {
          alert('Cập nhật trạng thái thất bại!');
        }
      });
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('vi-VN');
    },
    async onSearchTitleInput(e) {
      const value = e.target.value;
      this.searchTitle = value;
      if (!value) {
        await this.fetchColumnsAndTasks();
        return;
      }


      console.log(searchTasksByTitle)
      const res = await searchTasksByTitle(value, this.projectId);
      if (res.success && Array.isArray(res.data)) {
        const statusMap = {};
        for (const col of this.columns) statusMap[col.statusId] = { ...col, tasks: [] };
        for (const task of res.data) {
          if (statusMap[task.statusId]) statusMap[task.statusId].tasks.push(task);
        }
        this.columns = Object.values(statusMap);
      }
    },
    getLabelsForTask(task) {
      if (!task.labelId || !Array.isArray(task.labelId)) return [];
      return this.labels.filter(l => task.labelId.includes(l.labelId));
    },
    showAddTaskDialog(statusId) {
      this.addTaskDialog.visible = true;
      this.addTaskDialog.statusId = statusId;
    },
    async handleAddTaskSubmit(taskData) {
      const creatorId = JSON.parse(localStorage.getItem('user')||'{}').userId || 1;
      const res = await createTask({ ...taskData, creatorId });
      if (res.success) {
        this.addTaskDialog.visible = false;
        await this.fetchColumnsAndTasks();
      } else {
        alert('Thêm task thất bại!');
      }
    },
    openTaskDetail(task) {
      this.taskDetailDialog.task = { ...task };
      this.taskDetailDialog.visible = true;
    },
    async handleUpdateTask(taskData) {
      const res = await updateTask(taskData.taskId, taskData);
      if (res.success) {
        this.taskDetailDialog.visible = false;
        await this.fetchColumnsAndTasks();
      } else {
        alert('Cập nhật task thất bại!');
      }
    },
  },
};
</script>
