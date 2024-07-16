<template>
  <v-card>
    <v-layout>
      <NavBar v-if="token"/>
      <v-main>
          <RouterView />
      </v-main>
    </v-layout>
  </v-card>
</template>
<script setup>

import { RouterView } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores';
import {NavBar} from '@/components';

const authStore = useAuthStore();
const { token : token } = storeToRefs(authStore);


</script>
<style>

/* Scrollbar Styling */
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background: #ffffff;
}
::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
    background: #29335e;
}


/* Hide the scrollbar */
html {
  overflow: hidden;
}

/* Make the main content scrollable */
.v-main {
  overflow: scroll;
  height: 100vh;
}

</style>
