<template>
  <div class="">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2>
          <i class="fas fa-box me-2"></i>
          Gestione Prodotti
        </h2>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#productModal" @click="openFormModal()">
          <i class="fas fa-plus me-2"></i>Nuovo Prodotto
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="row mb-3">
      <div class="col-md-3">
        <select class="form-select" v-model="activeFilter" @change="filterProducts">
          <option value="">Tutti gli stati</option>
          <option value="1">Attivi</option>
          <option value="0">Non attivi</option>
        </select>
      </div>
      <div class="col-md-3">
        <select class="form-select" v-model="categoryFilter" @change="filterProducts">
          <option value="">Tutte le categorie</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="col-md-4">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Cerca per nome..."
          v-model="searchTerm"
          @input="filterProducts"
        >
      </div>
      <div class="col-md-2">
        <button class="btn btn-outline-secondary w-100" @click="clearFilters">
          <i class="fas fa-times me-2"></i>Reset
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
    </div>

    <!-- Products Table -->
    <div v-else class="">
      <div class="">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th class="d-none d-md-table-cell">Immagine</th>
                <th>Nome</th>
                <th class="d-none d-lg-table-cell">Descrizione</th>
                <th class="d-none d-md-table-cell">Prezzo</th>
                <th class="d-none d-md-table-cell">Categoria</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id">
                <td class="d-none d-md-table-cell">
                  <div v-if="product.image" class="product-image">
                    <img :src="product.image" :alt="product.name" class="img-thumbnail" style="max-width: 60px; max-height: 60px;">
                  </div>
                  <span v-else class="text-muted">
                    <i class="fas fa-image fa-2x"></i>
                  </span>
                </td>
                <td>
                  <strong>{{ product.name }}</strong>
                  <div class="text-muted small d-md-none">€ {{ parseFloat(product.price).toFixed(2) }}</div>
                </td>
                <td class="d-none d-lg-table-cell">
                  <div v-if="product.description" class="text-truncate" style="max-width: 300px;">
                    {{ product.description }}
                  </div>
                  <em v-else class="text-muted">Nessuna descrizione</em>
                </td>
                <td class="d-none d-md-table-cell">
                  <strong class="text-success">€ {{ parseFloat(product.price).toFixed(2) }}</strong>
                </td>
                <td class="d-none d-md-table-cell">
                  <span 
                    v-if="product.category_name" 
                    class="badge"
                    :style="{ 
                      backgroundColor: product.category_color || '#6c757d'
                    }"
                  >
                    {{ product.category_name }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>
                  <div class="btn-group">
                    <button 
                      class="btn btn-sm btn-outline-info" 
                      data-bs-toggle="modal" 
                      data-bs-target="#detailsModal"
                      @click="openDetailsModal(product)"
                      title="Dettagli"
                    >
                      <i class="fas fa-info-circle"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-warning" 
                      data-bs-toggle="modal" 
                      data-bs-target="#productModal"
                      @click="openFormModal(product)"
                      title="Modifica"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      @click="deleteProduct(product)"
                      title="Elimina"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredProducts.length === 0" class="text-center text-muted py-4">
          <i class="fas fa-inbox fa-3x mb-3"></i>
          <p>Nessun prodotto trovato</p>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <ProductFormModal
      :form="form"
      :editMode="editMode"
      :categories="categories"
      :ingredients="ingredients"
      :allergens="allergens"
      @save="saveProduct"
    />

    <!-- Product Details Modal -->
    <ProductDetailsModal
      :product="selectedProduct"
      :productIngredients="productIngredients"
      :productAllergens="productAllergens"
      :loading="loadingDetails"
      :categories="categories"
      :ingredients="ingredients"
      :allergens="allergens"
      @edit="openFormModal"
    />
  </div>
</template>

<script>
import { productsService } from '../services/productsService'
import { categoriesService } from '../services/categoriesService'
import { ingredientsService } from '../services/ingredientsService'
import { allergensService } from '../services/allergensService'
import ProductFormModal from './products/ProductFormModal.vue'
import ProductDetailsModal from './products/ProductDetailsModal.vue'
import { transformProductFromView, extractIngredientIds, extractAllergenIds } from '../utils/productHelpers'

export default {
  name: 'Products',
  components: {
    ProductFormModal,
    ProductDetailsModal
  },
  data() {
    return {
      products: [],
      filteredProducts: [],
      categories: [],
      ingredients: [],
      allergens: [],
      loading: true,
      loadingDetails: false,
      editMode: false,
      searchTerm: '',
      activeFilter: '',
      categoryFilter: '',
      selectedProduct: null,
      productIngredients: [],
      productAllergens: [],
      form: {
        name: '',
        description: '',
        price: 0,
        category_id: '',
        image: '',
        sort_order: 0,
        is_active: true,
        selected_ingredients: [],
        selected_allergens: []
      }
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      
      try {
        // Carica tutti i dati necessari
        const [productsResult, categoriesResult, ingredientsResult, allergensResult] = await Promise.all([
          productsService.getAll(),
          categoriesService.getAll(),
          ingredientsService.getAll(),
          allergensService.getAll()
        ])
        
        // Trasforma i prodotti dalla view API al formato componente
        const rawProducts = productsResult.data || []
        this.products = rawProducts.map(p => transformProductFromView(p))
        
        this.categories = categoriesResult.data || []
        this.ingredients = ingredientsResult.data || []
        this.allergens = allergensResult.data || []
        
        // Ordina prodotti per nome (o per sort_order se disponibile)
        this.products.sort((a, b) => {
          if (a.sort_order !== b.sort_order) {
            return (a.sort_order || 0) - (b.sort_order || 0)
          }
          return a.name.localeCompare(b.name)
        })
        this.filteredProducts = this.products
        
        console.log('✅ Dati caricati:', {
          products: this.products.length,
          categories: this.categories.length,
          ingredients: this.ingredients.length,
          allergens: this.allergens.length
        })
      } catch (error) {
        console.error('❌ Errore caricamento dati:', error)
        alert('Errore nel caricamento dei dati: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    
    filterProducts() {
      let filtered = this.products
      
      if (this.searchTerm) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
        )
      }
      
      if (this.activeFilter !== '') {
        const filterValue = parseInt(this.activeFilter)
        filtered = filtered.filter(product => 
          Number(product.is_active) === filterValue
        )
      }
      
      if (this.categoryFilter !== '') {
        filtered = filtered.filter(product => 
          Number(product.category_id) === Number(this.categoryFilter)
        )
      }
      
      this.filteredProducts = filtered
    },
    
    clearFilters() {
      this.searchTerm = ''
      this.activeFilter = ''
      this.categoryFilter = ''
      this.filteredProducts = this.products
    },
    
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name : ''
    },
    
    getIngredientName(ingredientId) {
      const ingredient = this.ingredients.find(i => i.id === ingredientId)
      return ingredient ? ingredient.name : ''
    },
    
    getAllergenName(allergenId) {
      const allergen = this.allergens.find(a => a.id === allergenId)
      return allergen ? allergen.name : ''
    },
    
    getContrastColor(hexColor) {
      if (!hexColor) return '#FFFFFF'
      
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
    
    openFormModal(product = null) {
      this.editMode = !!product
      
      if (product) {
        this.form = { 
          ...product,
          selected_ingredients: extractIngredientIds(product),
          selected_allergens: extractAllergenIds(product)
        }
      } else {
        this.form = {
          name: '',
          description: '',
          price: 0,
          category_id: '',
          image: '',
          sort_order: 0,
          is_active: true,
          selected_ingredients: [],
          selected_allergens: []
        }
      }
    },
    
    openDetailsModal(product) {
      this.selectedProduct = product
      this.loadingDetails = true
      
      // I dati sono già presenti nel prodotto dalla view
      this.productIngredients = product.ingredients || []
      this.productAllergens = product.allergens || []
      
      // Simula caricamento per UX
      setTimeout(() => {
        this.loadingDetails = false
        console.log('📦 Dettagli prodotto:', {
          product: product.name,
          ingredients: this.productIngredients.length,
          allergens: this.productAllergens.length
        })
      }, 200)
    },
    
    async saveProduct(formData) {
      try {
        // Prepara il payload per l'invio
        const payload = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category_id: formData.category_id,
          image: formData.image,
          sort_order: formData.sort_order || 0,
          is_active: formData.is_active,
          // Aggiungi ingredienti e allergeni se necessario
          ingredients: formData.selected_ingredients,
          allergens: formData.selected_allergens
        }
        
        if (this.editMode) {
          payload.id = formData.id
        }
        
        // Usa il servizio per salvare (crea o aggiorna)
        const result = await productsService.save(payload, this.editMode)
        
        // Ricarica i prodotti
        await this.loadData()
        
        // Chiudi il modal
        const closeBtn = document.querySelector('#productModal [data-bs-dismiss="modal"]')
        if (closeBtn) closeBtn.click()
        
        // Mostra messaggio di successo
        const successMessage = this.editMode 
          ? `Prodotto aggiornato con successo!` 
          : `Prodotto creato con ID: ${result.data?.id || result.id}`
        alert(successMessage)
        
      } catch (error) {
        console.error('Error saving product:', error)
        alert('Errore: ' + error.message)
      }
    },
    
    async deleteProduct(product) {
      if (confirm(`Sei sicuro di voler eliminare il prodotto "${product.name}"?`)) {
        try {
          await productsService.delete(product.id)
          await this.loadData()
          alert('Prodotto eliminato con successo!')
        } catch (error) {
          console.error('Error deleting product:', error)
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

.product-image img {
  object-fit: cover;
}

/* Mobile optimizations */
@media (max-width: 767px) {
  h2 {
    font-size: 1.25rem;
  }
  
  .table {
    font-size: 0.875rem;
  }
  
  .btn-group .btn {
    padding: 0.25rem 0.4rem;
    font-size: 0.75rem;
  }
  
  .table td,
  .table th {
    padding: 0.4rem;
  }
}

@media (max-width: 575px) {
  .table {
    font-size: 0.8rem;
  }
  
  .badge {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
  
  .table td,
  .table th {
    padding: 0.3rem 0.2rem;
  }
}
</style>
