<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Filter and View Options -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-2 text-gray-600">
        <i class="el-icon-search w-5 h-5"></i>
        <el-input
          placeholder="Tìm hoặc nhập điều kiện"
          class="bg-transparent focus:outline-none px-2 py-1 w-56"
          size="small"
          v-model="filterText"
        />
      </div>
      <el-button type="text" class="p-2 rounded hover:bg-gray-200 focus:outline-none">
        <i class="el-icon-setting w-5 h-5 text-gray-600"></i>
      </el-button>
    </div>

    <!-- Project Cards -->
    <div v-if="projects.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        v-for="project in projects"
        :key="project.id || project._id"
        :project="project"
        @card-click="goToTask"
        @star-click="handleStarClick"
      />
    </div>
    <div v-else class="text-center text-gray-500">
      <p>Không có dự án nào.</p>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end mt-6" v-if="totalPages > 1">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="itemsPerPage"
        :total="allProjects.length"
        @current-change="handlePageChange"
      />
    </div>

  </div>
</template>

<script>
import ProjectCard from '@/components/project/ProjectCard.vue'
import { getAllProjects } from '~/api/api-controller';

export default {
  name: 'ProjectPage',
  components: {
    ProjectCard
  },
  data() {
    return {
      allProjects: [],
      projects: [],
      currentPage: 1,
      itemsPerPage: 6,
      filterText: ''
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.allProjects.length / this.itemsPerPage);
    }
  },
  async mounted() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      const response = await getAllProjects();
      if (response.success && Array.isArray(response.data)) {
        this.allProjects = response.data;
        this.updateProjectsForPage();
      } else {
        this.allProjects = [];
        this.projects = [];
      }
    },
    updateProjectsForPage() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.projects = this.allProjects.slice(startIndex, endIndex);
      window.scrollTo(0, 0);
    },
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
        this.updateProjectsForPage();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updateProjectsForPage();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateProjectsForPage();
      }
    },
    goToTask(projectId) {
      this.$router.push({ path: '/task', query: { projectId } });
    },
    handleStarClick(project) {
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.updateProjectsForPage();
    }
  }
}
</script>

<style scoped>
</style>
