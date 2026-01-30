<template>
  <div class="">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2>
          <i class="fas fa-folder me-2"></i>
          Gestione Categorie
        </h2>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#categoryModal" @click="openModal()">
          <i class="fas fa-plus me-2"></i>Nuova Categoria
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="row mb-3">
      <div class="col-md-4">
        <select class="form-select" v-model="activeFilter" @change="filterCategories">
          <option value="">Tutti gli stati</option>
          <option value="1">Attive</option>
          <option value="0">Non attive</option>
        </select>
      </div>
      <div class="col-md-4">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Cerca per nome..."
          v-model="searchTerm"
          @input="filterCategories"
        >
      </div>
      <div class="col-md-4">
        <button class="btn btn-outline-secondary" @click="clearFilters">
          <i class="fas fa-times me-2"></i>Reset Filtri
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
    </div>

    <!-- Categories Table -->
    <div v-else class="">
      <div class="">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th class="d-none d-md-table-cell">Icona</th>
                <th>Nome</th>
                <th class="d-none d-lg-table-cell">Descrizione</th>
                <th class="d-none d-md-table-cell">Colore</th>
                <th class="d-none d-sm-table-cell">Ordine</th>
                <!--
                <th>Azioni</th>
                -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in filteredCategories" :key="category.id">
                <td class="d-none d-md-table-cell">
                  <span v-if="category.icon" class="category-icon" v-html="category.icon"></span>
                  <span v-else class="text-muted">
                    <i class="fas fa-folder fa-2x"></i>
                  </span>
                </td>
                <td>
                  <strong>{{ category.name }}</strong>
                  <div class="text-muted small">{{ category.slug }}</div>
                </td>
                <td class="d-none d-lg-table-cell">
                  <div v-if="category.description">{{ category.description }}</div>
                  <em v-else class="text-muted">Nessuna descrizione</em>
                </td>
                <td class="d-none d-md-table-cell">
                  <span 
                    v-if="category.color" 
                    class="badge" 
                    :style="{ backgroundColor: category.color, color: getContrastColor(category.color) }"
                  >
                    {{ category.color }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="d-none d-sm-table-cell">
                  <span class="badge bg-secondary">
                    {{ category.sort_order || 0 }}
                  </span>
                </td>
                <!--
                <td>
                  <div class="btn-group">
                    <button 
                      class="btn btn-sm btn-outline-warning" 
                      data-bs-toggle="modal" 
                      data-bs-target="#categoryModal"
                      @click="openModal(category)"
                      title="Modifica"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      @click="deleteCategory(category)"
                      title="Elimina"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
                -->
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredCategories.length === 0" class="text-center text-muted py-4">
          <i class="fas fa-inbox fa-3x mb-3"></i>
          <p>Nessuna categoria trovata</p>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit Category -->
    <div class="modal fade" id="categoryModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editMode ? 'Modifica Categoria' : 'Nuova Categoria' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCategory">
              <div class="row">
                <div class="col-md-8">
                  <div class="mb-3">
                    <label for="categoryName" class="form-label">Nome *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="categoryName" 
                      v-model="form.name"
                      @input="generateSlug"
                      placeholder="Inserisci il nome della categoria"
                      required
                    >
                  </div>
                </div>
                
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="categoryIcon" class="form-label">Icona/Emoji</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="categoryIcon" 
                      v-model="form.icon"
                      placeholder="🍕 oppure <i class='...'>'"
                    >
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-8">
                  <div class="mb-3">
                    <label for="categorySlug" class="form-label">Slug *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="categorySlug" 
                      v-model="form.slug"
                      placeholder="slug-categoria"
                      required
                    >
                    <small class="text-muted">URL amichevole (auto-generato dal nome)</small>
                  </div>
                </div>
                
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="categoryColor" class="form-label">Colore</label>
                    <input 
                      type="color" 
                      class="form-control form-control-color" 
                      id="categoryColor" 
                      v-model="form.color"
                      title="Scegli un colore"
                    >
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="categoryDescription" class="form-label">Descrizione</label>
                <textarea
                  placeholder="Inserisci una descrizione dettagliata della categoria"
                  class="form-control" 
                  id="categoryDescription" 
                  v-model="form.description"
                  rows="3"
                ></textarea>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="categorySortOrder" class="form-label">Ordine di visualizzazione</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="categorySortOrder" 
                      v-model.number="form.sort_order"
                      placeholder="0"
                      min="0"
                    >
                    <small class="text-muted">Numeri più bassi appaiono per primi</small>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label d-block">&nbsp;</label>
                    <div class="form-check form-switch">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="categoryActive"
                        v-model="form.is_active"
                      >
                      <label class="form-check-label" for="categoryActive">
                        Categoria attiva
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Annulla
            </button>
            <button type="button" class="btn btn-primary" @click="saveCategory">
              {{ editMode ? 'Aggiorna' : 'Crea' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { categoriesService } from '../services/categoriesService'

export default {
  name: 'Categories',
  data() {
    return {
      categories: [],
      filteredCategories: [],
      loading: true,
      editMode: false,
      searchTerm: '',
      activeFilter: '',
      form: {
        name: '',
        slug: '',
        description: '',
        icon: '',
        color: '#3498db',
        sort_order: 0,
        is_active: true
      }
    }
  },
  async created() {
    await this.loadCategories()
  },
  methods: {
    async loadCategories() {
      this.loading = true
      
      try {
        const result = await categoriesService.getAll()
        
        this.categories = result.data || []
        // Ordina per sort_order
        this.categories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        this.filteredCategories = this.categories
        console.log('✅ Categorie caricate:', this.categories.length)
      } catch (error) {
        console.error('❌ Errore caricamento categorie:', error)
        alert('Errore nel caricamento delle categorie: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    
    filterCategories() {
      let filtered = this.categories
      
      if (this.searchTerm) {
        filtered = filtered.filter(category => 
          category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (category.description && category.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (category.slug && category.slug.toLowerCase().includes(this.searchTerm.toLowerCase()))
        )
      }
      
      if (this.activeFilter !== '') {
        const filterValue = parseInt(this.activeFilter)
        filtered = filtered.filter(category => 
          Number(category.is_active) === filterValue
        )
      }
      
      this.filteredCategories = filtered
    },
    
    clearFilters() {
      this.searchTerm = ''
      this.activeFilter = ''
      this.filteredCategories = this.categories
    },
    
    generateSlug() {
      if (!this.editMode) {
        this.form.slug = this.form.name
          .toLowerCase()
          .trim()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ñ]/g, 'n')
          .replace(/[ç]/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }
    },
    
    getContrastColor(hexColor) {
      if (!hexColor) return '#000000'
      
      // Rimuovi il # se presente
      const hex = hexColor.replace('#', '')
      
      // Converti in RGB
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      // Calcola la luminosità
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      
      return luminance > 0.5 ? '#000000' : '#FFFFFF'
    },
    
    openModal(category = null) {
      this.editMode = !!category
      
      if (category) {
        this.form = { ...category }
      } else {
        this.form = {
          name: '',
          slug: '',
          description: '',
          icon: '',
          color: '#3498db',
          sort_order: 0,
          is_active: true
        }
      }
    },
    
    async saveCategory() {
      try {
        // Prepara il payload per l'invio
        const payload = { ...this.form }
        // Estrai l'id azienda dal token salvato (assumendo JWT in localStorage)
        let aziendaId = null
        const token = localStorage.getItem('token')
        if (token) {
          try {
            const payloadBase64 = token.split('.')[1]
            const decoded = JSON.parse(atob(payloadBase64))
            if (decoded.azienda_id) {
              aziendaId = decoded.azienda_id
              payload.azienda_id = aziendaId
            }
          } catch (e) {
            console.warn('Impossibile estrarre azienda_id dal token:', e)
          }
        }
        // Usa il servizio per salvare (crea o aggiorna)
        const result = await categoriesService.save(payload, this.editMode)
        
        // Ricarica le categorie
        await this.loadCategories()
        
        // Chiudi il modal
        document.querySelector('#categoryModal [data-bs-dismiss="modal"]').click()
        
        // Mostra messaggio di successo
        const successMessage = this.editMode 
          ? `Categoria aggiornata con successo!` 
          : `Categoria creata con ID: ${result.data?.id || result.id}`
        alert(successMessage)
        
      } catch (error) {
        console.error('Error saving category:', error)
        alert('Errore: ' + error.message)
      }
    },
    
    async deleteCategory(category) {
      if (confirm(`Sei sicuro di voler eliminare la categoria "${category.name}"?`)) {
        try {
          await categoriesService.delete(category.id)
          await this.loadCategories()
          alert('Categoria eliminata con successo!')
        } catch (error) {
          console.error('Error deleting category:', error)
          alert('Errore: ' + error.message)
        }
      }
    }
  }
}
</script>

<style scoped>
.btn-group .btn {
  border-radius: 0.375rem;
  margin-right: 2px;
}

.badge {
  font-size: 0.75rem;
}

.category-icon {
  font-size: 2rem;
  display: inline-block;
}

.form-control-color {
  width: 100%;
  height: 38px;
}

/* Mobile optimizations */
@media (max-width: 767px) {
  .categories h2 {
    font-size: 1.25rem;
  }
  
  .categories .table {
    font-size: 0.875rem;
  }
  
  .categories .btn-group .btn {
    padding: 0.25rem 0.4rem;
    font-size: 0.75rem;
  }
  
  .categories .card-body {
    padding: 0.5rem;
  }
  
  .categories .table td,
  .categories .table th {
    padding: 0.4rem;
  }
}

@media (max-width: 575px) {
  .categories .table {
    font-size: 0.8rem;
  }
  
  .categories .badge {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
  
  .categories .card-body {
    padding: 0.25rem;
  }
  
  .categories .table td,
  .categories .table th {
    padding: 0.3rem 0.2rem;
  }
  
  .categories .row {
    margin-left: -0.25rem;
    margin-right: -0.25rem;
  }
  
  .categories .row > * {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
}
</style>
