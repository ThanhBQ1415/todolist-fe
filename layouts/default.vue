<template>
    <div>
      <Header v-if="isAuthenticated" />
      
      <Nuxt />
  
    </div>
  </template>
  
  <script>
  import Header from '~/components/Header.vue'
  
  export default {
    name: 'DefaultLayout',
    components: {
      Header,
    },
    data() {
      return {
        isAuthenticated: false
      };
    },
    created() {
      if (typeof window !== 'undefined') {
        this.isAuthenticated = !!localStorage.getItem('token');
      }
    },
    methods: {
      checkAuth() {
        this.isAuthenticated = !!localStorage.getItem('token');
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  