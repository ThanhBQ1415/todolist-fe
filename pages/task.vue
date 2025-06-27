<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- Header & Filter Bar (luôn cố định trên cùng) -->
    <div class="flex flex-wrap items-center mb-4 gap-2 bg-gray-100 z-10 sticky top-0">
      <span class="text-sm text-gray-700 font-medium">Xem theo: <span class="font-semibold">Trạng thái</span></span>
      <span class="text-sm text-gray-700 ml-4">Giai đoạn: <span class="font-semibold">4-6/2025</span></span>
      <span class="ml-4 flex items-center text-sm text-gray-700">
        <i class="el-icon-menu w-4 h-4 mr-1 text-gray-400"></i>
        Bộ lọc:
      </span>
      <el-input
        placeholder="Tìm hoặc nhập điều kiện"
        class="ml-2 w-56"
        size="small"
        v-model="searchTitle"
        @input="onSearchTitleInput($event)"
      />
      <div class="ml-auto flex gap-2">
        <el-button class="w-9 h-9 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200" type="text">
          <i class="el-icon-s-grid w-5 h-5 text-gray-500"></i>
        </el-button>
        <el-button class="w-9 h-9 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200" type="text">
          <i class="el-icon-more w-5 h-5 text-gray-500"></i>
        </el-button>
      </div>
    </div>

    <div class="" style="height: calc(100vh - 120px);">
      <div class="flex flex-row gap-8 h-full min-h-0">
        <Container orientation="horizontal" @drop="onColumnDrop">
          <Draggable v-for="(col, colIdx) in columns" :key="col.statusId">
            <el-card class="bg-white rounded-lg shadow flex flex-col w-[350px] min-w-[350px] max-w-[350px] h-[600px]">
              <div
                class="w-80 h-30 border-b-2 flex items-center font-bold text-xs "
                :style="{ borderColor: getStatusColor(col.name) }"
              >
                <span class="mr-2">
                  <i class="el-icon-s-grid" style="font-size: 16px; color: #D1D5DB;"></i>
                </span>
                <span :style="{ color: getStatusColor(col.name) }">{{ col.name.toUpperCase() }}</span>
                <span class="ml-auto flex items-center gap-2">
                  <span class="flex items-center text-red-500 font-normal text-xs">
                    <i class="el-icon-star-off w-3 h-3 mr-0.5"></i>
                    {{ col.stars || 0 }}
                  </span>
                  <span class="flex items-center text-yellow-500 font-normal text-xs">
                    <i class="el-icon-s-grid w-3 h-3 mr-0.5"></i>
                    {{ col.tasks ? col.tasks.length : 0 }}
                  </span>
                  <el-button class="ml-2 p-1 rounded hover:bg-gray-100" type="text" size="mini">
                    <i class="el-icon-more w-4 h-4 text-gray-400"></i>
                  </el-button>
                </span>
              </div>
              <div class="flex-1 overflow-x-auto">
                <Container group-name="tasks" :get-child-payload="i => ({ ...col.tasks[i], sourceColIdx: colIdx })" @drop="e => onTaskDrop(colIdx, e)">
                  <Draggable v-for="(task, tIdx) in col.tasks" :key="task.taskId">
                    <el-card class="bg-gray-50 rounded p-2 mb-2 shadow text-xs cursor-pointer" @click.native="openTaskDetail(task)">
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
                    </el-card>
                  </Draggable>
                  <div v-if="col.name && col.name.toUpperCase() === 'NEW'" class="px-2 py-2 bg-gray-50 rounded-b flex items-center cursor-pointer hover:bg-gray-100" @click="showAddTaskDialog(col.statusId)">
                    <span class="text-blue-500 text-sm font-medium flex items-center">
                      <i class="el-icon-plus w-4 h-4 mr-1"></i>
                      Thêm task
                    </span>
                  </div>
                </Container>
              </div>
            </el-card>
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
import { getAllStatuses, getTasksByStatus, updateTaskStatusPatch, searchTasksByTitle, getAllLabels, createTask, getAllUsers, updateTask } from '~/api/api-controller';
import { Container, Draggable } from 'vue-smooth-dnd';
import AddTaskDialog from '~/components/task/AddTaskDialog.vue';
import TaskDetailDialog from '~/components/task/TaskDetailDialog.vue';
import debounce from 'lodash/debounce';

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
    onSearchTitleInput: debounce(async function(value) {
      this.searchTitle = value;
      if (!value) {
        await this.fetchColumnsAndTasks();
        return;
      }
      const res = await searchTasksByTitle(value, this.projectId);
      if (res.success && Array.isArray(res.data)) {
        const statusMap = {};
        for (const col of this.columns) statusMap[col.statusId] = { ...col, tasks: [] };
        for (const task of res.data) {
          if (statusMap[task.statusId]) statusMap[task.statusId].tasks.push(task);
        }
        this.columns = Object.values(statusMap);
      }
    }, 300),
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
