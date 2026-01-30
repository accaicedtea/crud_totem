<template>
  <div class="modal fade" id="detailsModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-box me-2"></i>
            Dettagli Prodotto: {{ product?.name }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div v-if="product">
            <!-- Ingredienti -->
            <div class="card mb-3">
              <div class="card-header bg-success text-white">
                <i class="fas fa-flask me-2"></i>Ingredienti
                <span class="badge bg-light text-dark ms-2">{{ productIngredients.length }}</span>
              </div>
              <div class="card-body">
                <div v-if="loading" class="text-center">
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Caricamento...</span>
                  </div>
                </div>
                <div v-else-if="productIngredients.length > 0">
                  <div class="table-responsive">
                    <table class="table table-sm table-hover">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Quantità</th>
                          <th>Opzionale</th>
                        </tr>
                      </thead>
                      <tbody>
                          <tr v-for="item in productIngredients" :key="item.ingredient_id">
                            <td>
                              <strong>{{ item.name }}</strong>
                          </td>
                          <td>
                            <span v-if="item.quantity">{{ item.quantity }}</span>
                            <span v-else class="text-muted">-</span>
                          </td>
                          <td>
                            <span v-if="item.is_optional" class="badge bg-warning text-dark">
                              <i class="fas fa-check"></i> Opzionale
                            </span>
                            <span v-else class="badge bg-secondary">
                              Obbligatorio
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-else class="text-muted text-center py-3">
                  <i class="fas fa-inbox fa-2x mb-2"></i>
                  <p class="mb-0">Nessun ingrediente associato</p>
                </div>
              </div>
            </div>

            <!-- Allergeni -->
            <div class="card mb-3">
              <div class="card-header bg-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>Allergeni
                <span class="badge bg-light text-dark ms-2">{{ productAllergens.length }}</span>
              </div>
              <div class="card-body">
                <div v-if="loading" class="text-center">
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Caricamento...</span>
                  </div>
                </div>
                <div v-else-if="productAllergens.length > 0">
                  <div class="d-flex flex-wrap gap-2">
                    <div 
                      v-for="item in productAllergens" 
                      :key="item.allergen_id"
                      class="alert alert-warning d-flex align-items-center mb-0"
                      style="padding: 0.5rem 1rem;"
                    >
                      <span v-if="item.icon" class="me-2">{{ item.icon }}</span>
                      <i v-else class="fas fa-exclamation-triangle me-2"></i>
                      <strong>{{ item.name }}</strong>
                    </div>
                  </div>
                </div>
                <div v-else class="text-muted text-center py-3">
                  <i class="fas fa-inbox fa-2x mb-2"></i>
                  <p class="mb-0">Nessun allergene associato</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Chiudi
          </button>
          <button 
            type="button" 
            class="btn btn-warning" 
            @click="handleEdit"
          >
            <i class="fas fa-edit me-2"></i>Modifica
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetailsModal',
  props: {
    product: {
      type: Object,
      default: null
    },
    productIngredients: {
      type: Array,
      default: () => []
    },
    productAllergens: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array,
      default: () => []
    },
    ingredients: {
      type: Array,
      default: () => []
    },
    allergens: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name : ''
    },
    
    handleEdit() {
      // Emetti evento per aprire il modal di modifica
      this.$emit('edit', this.product)
    }
  }
}
</script>

<style scoped>
</style>
