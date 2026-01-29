<script setup>
</script>

<template>
  <nav class="main-nav glass">
    <div class="nav-content">
      <div class="logo-area">
        <img src="/vite.svg" class="nav-logo" alt="Vite logo" />
        <span class="app-title">Tasker Pro</span>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link" active-class="active">Kezdőlap</router-link>
        <router-link to="/data" class="nav-link" active-class="active">Adatkezelő</router-link>
      </div>
    </div>
  </nav>

  <main class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<style>
/* Reset and global styles */
:root {
  --primary-color: #646cff;
  --secondary-color: #535bf2;
  --bg-color: #0f172a;
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.1);
}

body {
  margin: 0;
  background-color: var(--bg-color);
  background-image: 
    radial-gradient(at 0% 0%, rgba(100, 108, 255, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(83, 91, 242, 0.1) 0px, transparent 50%);
  min-height: 100vh;
}

#app {
  max-width: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.main-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  margin-bottom: 2rem;
  border-radius: 0 0 20px 20px;
  border-top: none;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.nav-logo {
  height: 2rem;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #646cff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.active {
  color: #fff;
  background: var(--primary-color);
  box-shadow: 0 4px 15px rgba(100, 108, 255, 0.4);
}

.app-main {
  padding: 0 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}
</style>
