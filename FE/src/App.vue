<script setup>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

const apiResponse = ref(null)
const error = ref(null)

async function testFetch() {
  try {
    apiResponse.value = null
    error.value = null
    const response = await fetch('/api/')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    apiResponse.value = await response.json()
  } catch (e) {
    error.value = e.message
    console.error('Fetch error:', e)
  }
}
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  
  <div class="card">
    <button type="button" @click="testFetch">Teszt lekérdezés a Backendtől</button>
    <div v-if="apiResponse" class="response">
      <h3>Válasz a backendtől:</h3>
      <pre>{{ apiResponse }}</pre>
    </div>
    <div v-if="error" class="error">
      Hiba történt: {{ error }}
    </div>
  </div>

  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.response {
  text-align: left;
  background: #1a1a1a;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}
.error {
  color: #ff6464;
  margin-top: 10px;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
