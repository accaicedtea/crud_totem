<template>
  <div class="modal fade" id="productModal" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? 'Modifica Prodotto' : 'Nuovo Prodotto' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSave">
            <!-- Tab Navigation -->
            <ul class="nav nav-tabs mb-3" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="info-tab" data-bs-toggle="tab" data-bs-target="#info" type="button">
                  <i class="fas fa-info-circle me-2"></i>Informazioni Base
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="ingredients-tab" data-bs-toggle="tab" data-bs-target="#ingredients" type="button">
                  <i class="fas fa-flask me-2"></i>Ingredienti
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="allergens-tab" data-bs-toggle="tab" data-bs-target="#allergens" type="button">
                  <i class="fas fa-exclamation-triangle me-2"></i>Allergeni
                </button>
              </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Informazioni Base Tab -->
              <div class="tab-pane fade show active" id="info" role="tabpanel">
                <div class="row">
                  <div class="col-md-8">
                    <div class="mb-3">
                      <label for="productName" class="form-label">Nome Prodotto *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="productName" 
                        v-model="localForm.name"
                        placeholder="Inserisci il nome del prodotto"
                        required
                      >
                    </div>
                  </div>
                  
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label for="productPrice" class="form-label">Prezzo (€) *</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        id="productPrice" 
                        v-model.number="localForm.price"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      >
                    </div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="productDescription" class="form-label">Descrizione</label>
                  <textarea
                    placeholder="Inserisci una descrizione dettagliata del prodotto"
                    class="form-control" 
                    id="productDescription" 
                    v-model="localForm.description"
                    rows="3"
                  ></textarea>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="productCategory" class="form-label">Categoria *</label>
                      <select 
                        class="form-select" 
                        id="productCategory" 
                        v-model="localForm.category_id"
                        required
                      >
                        <option value="">Seleziona una categoria</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="productImage" class="form-label">URL Immagine</label>
                      <input 
                        type="url" 
                        class="form-control" 
                        id="productImage" 
                        v-model="localForm.image"
                        placeholder="https://esempio.com/immagine.jpg"
                      >
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="productSortOrder" class="form-label">Ordine di visualizzazione</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        id="productSortOrder" 
                        v-model.number="localForm.sort_order"
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
                          id="productActive"
                          v-model="localForm.is_active"
                        >
                        <label class="form-check-label" for="productActive">
                          Prodotto attivo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Preview immagine -->
                <div v-if="localForm.image" class="mb-3">
                  <label class="form-label">Anteprima Immagine</label>
                  <div>
                    <img :src="localForm.image" alt="Preview" class="img-thumbnail" style="max-width: 200px; max-height: 200px;">
                  </div>
                </div>
              </div>

              <!-- Ingredienti Tab -->
              <div class="tab-pane fade" id="ingredients" role="tabpanel">
                <div class="mb-3">
                  <h6>Seleziona Ingredienti</h6>
                  <div class="row">
                    <div v-for="ingredient in ingredients" :key="ingredient.id" class="col-md-4 col-sm-6 mb-2">
                      <div class="form-check">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          :id="'ingredient-' + ingredient.id"
                          :value="ingredient.id"
                          v-model="localForm.selected_ingredients"
                        >
                        <label class="form-check-label" :for="'ingredient-' + ingredient.id">
                          {{ ingredient.name }}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div v-if="ingredients.length === 0" class="text-muted">
                    Nessun ingrediente disponibile. Creane uno prima!
                  </div>
                </div>

                <!-- Lista ingredienti selezionati -->
                <div v-if="localForm.selected_ingredients.length > 0" class="mt-3">
                  <h6>Ingredienti Selezionati</h6>
                  <div class="list-group">
                    <div v-for="ingredientId in localForm.selected_ingredients" :key="ingredientId" class="list-group-item">
                      <div class="d-flex justify-content-between align-items-center">
                        <span>{{ getIngredientName(ingredientId) }}</span>
                        <button 
                          type="button" 
                          class="btn btn-sm btn-outline-danger"
                          @click="removeIngredient(ingredientId)"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Allergeni Tab -->
              <div class="tab-pane fade" id="allergens" role="tabpanel">
                <div class="mb-3">
                  <h6>Seleziona Allergeni</h6>
                  <div class="row">
                    <div v-for="allergen in allergens" :key="allergen.id" class="col-md-4 col-sm-6 mb-2">
                      <div class="form-check">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          :id="'allergen-' + allergen.id"
                          :value="allergen.id"
                          v-model="localForm.selected_allergens"
                        >
                        <label class="form-check-label" :for="'allergen-' + allergen.id">
                          <span v-if="allergen.icon">{{ allergen.icon }} </span>
                          {{ allergen.name }}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div v-if="allergens.length === 0" class="text-muted">
                    Nessun allergene disponibile. Creane uno prima!
                  </div>
                </div>

                <!-- Lista allergeni selezionati -->
                <div v-if="localForm.selected_allergens.length > 0" class="mt-3">
                  <h6>Allergeni Selezionati</h6>
                  <div class="d-flex flex-wrap gap-2">
                    <span 
                      v-for="allergenId in localForm.selected_allergens" 
                      :key="allergenId" 
                      class="badge bg-warning text-dark d-flex align-items-center"
                    >
                      {{ getAllergenName(allergenId) }}
                      <button 
                        type="button" 
                        class="btn-close btn-close-white ms-2" 
                        style="font-size: 0.6rem;"
                        @click="removeAllergen(allergenId)"
                      ></button>
                    </span>
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
          <button type="button" class="btn btn-primary" @click="handleSave">
            {{ editMode ? 'Aggiorna' : 'Crea' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductFormModal',
  props: {
    form: {
      type: Object,
      required: true
    },
    editMode: {
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
  data() {
    return {
      localForm: { ...this.form }
    }
  },
  watch: {
    form: {
      handler(newForm) {
        this.localForm = { ...newForm }
      },
      deep: true
    }
  },
  methods: {
    getIngredientName(ingredientId) {
      const ingredient = this.ingredients.find(i => i.id === ingredientId)
      return ingredient ? ingredient.name : ''
    },
    
    getAllergenName(allergenId) {
      const allergen = this.allergens.find(a => a.id === allergenId)
      return allergen ? allergen.name : ''
    },
    
    removeIngredient(ingredientId) {
      this.localForm.selected_ingredients = this.localForm.selected_ingredients.filter(id => id !== ingredientId)
    },
    
    removeAllergen(allergenId) {
      this.localForm.selected_allergens = this.localForm.selected_allergens.filter(id => id !== allergenId)
    },
    
    handleSave() {
      this.$emit('save', this.localForm)
    }
  }
}
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #6c757d;
}

.nav-tabs .nav-link.active {
  color: #0d6efd;
  font-weight: 500;
}

.list-group-item {
  border: 1px solid #dee2e6;
  margin-bottom: 0.5rem;
}
</style>
