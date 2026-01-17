<script setup>
</script>

<template>
  <div class="app-container">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">
          <i class="fas fa-utensils me-2"></i>
          Acca Totem
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/products" class="nav-link">
                <i class="fas fa-box me-1"></i>
                Prodotti
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/categories" class="nav-link">
                <i class="fas fa-folder me-1"></i>
                Categorie
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/ingredients" class="nav-link">
                <i class="fas fa-flask me-1"></i>
                Ingredienti
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/allergens" class="nav-link">
                <i class="fas fa-exclamation-triangle me-1"></i>
                Allergeni
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <div class="container-fluid py-4">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.25rem;
}

.nav-link {
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 0.25rem;
  font-weight: 500;
}
</style>
