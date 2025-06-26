<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Top Bar -->
    <div class="mb-6">
      <div class="flex border-b"> 
        <button class="py-2 px-4 text-blue-600 border-b-2 border-blue-600 font-semibold">
          Tất cả
        </button>
        <button class="py-2 px-4 text-gray-500 hover:text-gray-700">
          +
        </button>
      </div>
    </div>

    <!-- Filter and View Options -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-2 text-gray-600">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M3 8h18M3 12h18M3 16h18"></path></svg>
        <span>Bộ lọc:</span>
        <input type="text" placeholder="Tìm hoặc nhập điều kiện" class="bg-transparent focus:outline-none px-2 py-1">
      </div>
      <button class="p-2 rounded hover:bg-gray-200">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
      </button>
    </div>

    <!-- Project Cards -->
    <div v-if="projects.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in projects" :key="project.id || project._id" class="bg-white rounded-lg shadow p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg transition" @click="goToTask(project.id || project._id)">
            <div>
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center text-purple-600 font-bold text-lg">
                            {{ project.name ? project.name.charAt(0).toUpperCase() : '?' }}
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="text-gray-400 hover:text-yellow-500">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                        </button>
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
        </div>
    </div>
    <div v-else class="text-center text-gray-500">
        <p>Không có dự án nào.</p>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end mt-6" v-if="totalPages > 1">
      <nav class="flex items-center space-x-2">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 rounded text-gray-500 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                :class="['px-3 py-1 rounded', currentPage === page ? 'text-white bg-blue-500 shadow' : 'text-gray-500 bg-white hover:bg-gray-100']">
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 rounded text-gray-500 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </nav>
    </div>

  </div>
</template>

<script>
import { getAllProjects } from '~/api/apiController';

export default {
  name: 'ProjectPage',
  data() {
    return {
      allProjects: [],
      projects: [],
      currentPage: 1,
      itemsPerPage: 6,
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
            console.error("Failed to fetch projects or data is not an array:", response.error || response);
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
    }
  }
}
</script>

<style scoped>
</style>
