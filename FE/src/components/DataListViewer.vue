<script setup>
import { ref, onMounted, watch } from 'vue'

const selectedTable = ref('users')
const data = ref([])
const loading = ref(false)
const error = ref(null)
const columns = ref([])

import { inject } from 'vue'
const $log = inject('logger')

const fetchTableData = async () => {
  $log.info(`Adatok betöltése: ${selectedTable.value}`)
  loading.value = true
  error.value = null
  try {
    const response = await fetch(`/api/${selectedTable.value}`)
    if (!response.ok) throw new Error(`Hiba a lekérés során: ${response.status}`)
    const result = await response.json()
    
    // API returns { success: true, count: X, data: [...] } for users
    // and potentially just an array for others, or different structure.
    // Let's normalize based on what we see in taskController/userController
    
    const items = Array.isArray(result) ? result : (result.data || [])
    data.value = items

    if (items.length > 0) {
      columns.value = Object.keys(items[0]).filter(key => key !== 'password')
    } else {
      columns.value = []
    }
    $log.success(`Sikeres betöltés: ${items.length} elem`, { table: selectedTable.value })
  } catch (e) {
    error.value = e.message
    $log.error(`Hiba történt a(z) ${selectedTable.value} tábla betöltésekor`, e)
    console.error('Fetch error:', e)
  } finally {
    loading.value = false
  }
}

watch(selectedTable, () => {
  fetchTableData()
})

onMounted(() => {
  fetchTableData()
})
</script>

<template>
  <div class="data-viewer">
    <div class="controls glass">
      <div class="control-group">
        <label for="table-select">Válassz táblát:</label>
        <select id="table-select" v-model="selectedTable">
          <option value="users">Felhasználók</option>
          <option value="tasks">Feladatok</option>
        </select>
      </div>
      <div class="stats" v-if="data.length > 0">
        Találatok: <strong>{{ data.length }}</strong>
      </div>
    </div>

    <div v-if="loading" class="loader-container">
      <div class="loader"></div>
      <p>Adatok betöltése...</p>
    </div>

    <div v-else-if="error" class="error-msg glass">
      <span class="icon">⚠️</span> {{ error }}
    </div>

    <div v-else class="table-container glass">
      <table v-if="data.length > 0">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <td v-for="col in columns" :key="col">
              <span v-if="col === 'admin'">{{ item[col] ? '✅' : '❌' }}</span>
              <span v-else>{{ item[col] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nincs megjeleníthető adat ebben a táblában.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-viewer {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.controls {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

label {
  font-weight: 600;
  color: #fff;
}

select {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  outline: none;
  font-size: 1rem;
  transition: all 0.3s ease;
}

select:focus {
  border-color: #646cff;
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.3);
}

.stats {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.table-container {
  overflow-x: auto;
  border-radius: 16px;
  padding: 1px; /* Background for border effect */
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  background: transparent;
}

th {
  background: rgba(100, 108, 255, 0.2);
  padding: 1rem;
  font-weight: 600;
  color: #646cff;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
}

tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  color: #646cff;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #FFF;
  border-bottom-color: #646cff;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-msg {
  padding: 2rem;
  color: #ff4757;
  text-align: center;
  border-radius: 16px;
  border: 1px solid rgba(255, 71, 87, 0.3);
}

.empty-state {
  padding: 4rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}

/* Glassmorphism utility if not in global css yet */
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
</style>
