<script setup>
import { ref, onMounted, watch } from 'vue'

const selectedTable = ref('users')
const data = ref([])
const loading = ref(false)
const error = ref(null)
const columns = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const pageInput = ref(1)
const sortKey = ref(null)
const sortOrder = ref(1) // 1: ASC, -1: DESC

watch(currentPage, (val) => {
  pageInput.value = val
})

import { inject, computed } from 'vue'
const $log = inject('logger')

const fetchTableData = async () => {
  $log.info(`Adatok betöltése: ${selectedTable.value}`)
  error.value = null
  loading.value = true
  try {
    let url = `/api/${selectedTable.value}`
    if (selectedTable.value === 'users') {
      url += `/page/${currentPage.value}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Hiba a lekérés során: ${response.status}`)
    }
    const result = await response.json()
    
    if (selectedTable.value === 'users') {
      const items = result.users || []
      totalPages.value = result.totalPages || 1
      data.value = items
    } else {
      // For tasks or other non-paginated tables
      data.value = Array.isArray(result) ? result : (result.tasks || [])
      totalPages.value = 1
    }

    if (data.value.length > 0) {
      columns.value = Object.keys(data.value[0])
    } else {
      columns.value = []
    }
    $log.success(`Sikeres betöltés: ${data.value.length} elem`, { table: selectedTable.value })
  } catch (e) {
    error.value = e.message
    $log.error(`Hiba történt a(z) ${selectedTable.value} tábla betöltésekor`, e)
    console.error('Fetch error:', e)
  } finally {
    loading.value = false
  }
}

const changePage = (delta) => {
  const newPage = currentPage.value + delta
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
    fetchTableData()
  }
}

const handlePageJump = () => {
  const page = parseInt(pageInput.value)
  if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchTableData()
  } else {
    // Revert to current page if invalid
    pageInput.value = currentPage.value
  }
}

const toggleSort = (key) => {
  if (selectedTable.value !== 'tasks') return
  if (key !== 'name' && key !== 'description' && key !== 'title') return

  if (sortKey.value === key) {
    sortOrder.value *= -1
  } else {
    sortKey.value = key
    sortOrder.value = 1
  }
}

const displayedData = computed(() => {
  if (selectedTable.value !== 'tasks' || !sortKey.value) {
    return data.value
  }

  return [...data.value].sort((a, b) => {
    const valA = (a[sortKey.value] || '').toString().toLowerCase()
    const valB = (b[sortKey.value] || '').toString().toLowerCase()
    
    if (valA < valB) return -1 * sortOrder.value
    if (valA > valB) return 1 * sortOrder.value
    return 0
  })
})

watch(selectedTable, () => {
  currentPage.value = 1
  sortKey.value = null
  sortOrder.value = 1
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
      
      <div class="pagination-controls" v-if="selectedTable === 'users' && totalPages > 1">
        <button @click="changePage(-1)" :disabled="currentPage === 1" class="btn-nav">
          &larr;
        </button>
        <span class="page-info">
          <input 
            type="number" 
            v-model.lazy="pageInput" 
            @keyup.enter="handlePageJump"
            @blur="handlePageJump"
            class="page-input"
            min="1"
            :max="totalPages"
          >
          / {{ totalPages }}
        </span>
        <button @click="changePage(1)" :disabled="currentPage === totalPages" class="btn-nav">
          &rarr;
        </button>
      </div>
      <div class="sorting-info" v-if="selectedTable === 'tasks'">
        Rendezés: <strong>{{ sortKey ? (sortKey === 'name' ? 'Név' : (sortKey === 'title' ? 'Cím' : 'Leírás')) : 'Nincs' }}</strong>
        <span v-if="sortKey">({{ sortOrder === 1 ? 'A-Z' : 'Z-A' }})</span>
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
      <table v-if="displayedData.length > 0">
        <thead>
          <tr>
            <th 
              v-for="col in columns" 
              :key="col"
              @click="toggleSort(col)"
              :class="{ 
                'sortable': selectedTable === 'tasks' && (col === 'name' || col === 'description' || col === 'title'),
                'active-sort': sortKey === col 
              }"
            >
              {{ col }}
              <span v-if="sortKey === col" class="sort-icon">
                {{ sortOrder === 1 ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in displayedData" :key="index">
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

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-nav {
  background: rgba(100, 108, 255, 0.2);
  border: 1px solid var(--primary-color);
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.btn-nav:hover:not(:disabled) {
  background: var(--primary-color);
  box-shadow: 0 0 10px rgba(100, 108, 255, 0.5);
}

.btn-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: rgba(255, 255, 255, 0.1);
}

.page-info {
  color: #fff;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-input {
  width: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 4px;
  padding: 0.2rem 0.4rem;
  text-align: center;
  font-weight: bold;
  font-family: inherit;
  outline: none;
}

.page-input:focus {
  border-color: #646cff;
}

/* Hide arrows/spinners in number input */
.page-input::-webkit-outer-spin-button,
.page-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.page-input[type=number] {
  -moz-appearance: textfield;
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

select option {
  background-color: #1a1a2e;
  color: #fff;
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
  min-width: 150px;
  transition: all 0.2s;
}

th.sortable {
  cursor: pointer;
  user-select: none;
}

th.sortable:hover {
  background: rgba(100, 108, 255, 0.4);
  color: #fff;
}

th.active-sort {
  background: rgba(100, 108, 255, 0.5);
  color: #fff;
}

.sort-icon {
  margin-left: 0.5rem;
  display: inline-block;
  font-size: 1rem;
}

.sorting-info {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

th:first-child, td:first-child {
  min-width: 60px; /* ID oszlop lehet keskenyebb */
}

th:last-child, td:last-child {
  min-width: 100px; /* Pl. admin vagy műveletek oszlop */
}

td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px; /* Hogy ne nyúljon túl nagyra */
}

td:hover {
  white-space: normal; /* Hoverre mutassa a teljes szöveget ha kell */
  overflow: visible;
  position: relative;
  z-index: 10;
  background: #1a1a2e;
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
