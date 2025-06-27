<template>
  <el-card class="project-card bg-white rounded-lg shadow p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg transition" @click.native="handleCardClick" shadow="hover">
    <div>
      <div class="flex justify-between items-start">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center text-purple-600 font-bold text-lg">
            <i class="el-icon-user text-2xl"></i>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <el-button type="text" class="text-gray-400 hover:text-yellow-500 p-0 m-0 min-w-0" @click.stop="handleStarClick">
            <i class="el-icon-star-off text-xl"></i>
          </el-button>
        </div>
      </div>
      <div class="mt-4">
        <h3 class="text-lg font-bold text-gray-800">{{ project.name }}</h3>
        <p class="text-sm text-gray-600 mt-1">{{ project.description }}</p>
      </div>
    </div>
    <div class="mt-4 flex items-center">
      <span class="text-sm text-gray-600">Owner ID: {{ project.ownerId }}</span>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ProjectCard',
  props: {
    project: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  computed: {
    projectInitial() {
      return this.project.name ? this.project.name.charAt(0).toUpperCase() : '?';
    }
  },
  methods: {
    handleCardClick() {
      this.$emit('card-click', this.project.id || this.project._id);
    },
    handleStarClick() {
      this.$emit('star-click', this.project);
    }
  }
}
</script>

<style scoped>
</style>
