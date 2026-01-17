<template>
  <div class="ingredients">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2>
          <i class="fas fa-carrot me-2"></i>
          Gestione Ingredienti
        </h2>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ingredientModal" @click="openModal()">
          <i class="fas fa-plus me-2"></i>Nuovo Ingrediente
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="row mb-3">
      <div class="col-md-4">
        <select class="form-select" v-model="availabilityFilter" @change="filterIngredients">
          <option value="">Tutti gli stati</option>
          <option value="1">Disponibili</option>
          <option value="0">Non disponibili</option>
        </select>
      </div>
      <div class="col-md-4">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Cerca per nome..."
          v-model="searchTerm"
          @input="filterIngredients"
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

    <!-- Ingredients Table -->
    <div v-else class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th class="d-none d-md-table-cell">Immagine</th>
                <th>Nome</th>
                <th class="d-none d-lg-table-cell">Descrizione</th>
                <th>Prezzo</th>
                <th class="d-none d-md-table-cell">Unità</th>
                <th class="d-none d-sm-table-cell">Disponibilità</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ingredient in filteredIngredients" :key="ingredient.id">
                <td class="d-none d-md-table-cell">
                  <img 
                    v-if="ingredient.image" 
                    :src="ingredient.image" 
                    :alt="ingredient.name"
                    class="ingredient-image"
                  >
                  <span v-else class="text-muted">
                    <i class="fas fa-image fa-2x"></i>
                  </span>
                </td>
                <td>
                  <strong>{{ ingredient.name }}</strong>
                </td>
                <td class="d-none d-lg-table-cell">
                  <div v-if="ingredient.description">{{ ingredient.description }}</div>
                  <em v-else class="text-muted">Nessuna descrizione</em>
                </td>
                <td>
                  <span class="fw-bold text-success">
                    {{ ingredient.price }}{{ ingredient.price && !ingredient.price.includes('€') ? ' €' : '' }}
                  </span>
                </td>
                <td class="d-none d-md-table-cell">
                  <span class="badge bg-info">
                    {{ ingredient.unit || 'N/D' }}
                  </span>
                </td>
                <td class="d-none d-sm-table-cell">
                  <span 
                    :class="ingredient.is_available ? 'badge bg-success' : 'badge bg-danger'"
                  >
                    {{ ingredient.is_available ? 'Disponibile' : 'Non disponibile' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group">
                    <button 
                      class="btn btn-sm btn-outline-warning" 
                      data-bs-toggle="modal" 
                      data-bs-target="#ingredientModal"
                      @click="openModal(ingredient)"
                      title="Modifica"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      @click="deleteIngredient(ingredient)"
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
        
        <div v-if="filteredIngredients.length === 0" class="text-center text-muted py-4">
          <i class="fas fa-inbox fa-3x mb-3"></i>
          <p>Nessun ingrediente trovato</p>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit Ingredient -->
    <div class="modal fade" id="ingredientModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editMode ? 'Modifica Ingrediente' : 'Nuovo Ingrediente' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveIngredient">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="ingredientName" class="form-label">Nome *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="ingredientName" 
                      v-model="form.name"
                      placeholder="Inserisci il nome dell'ingrediente"
                      required
                    >
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="ingredientPrice" class="form-label">Prezzo *</label>
                    <div class="input-group">
                      <input 
                        type="text" 
                        class="form-control" 
                        id="ingredientPrice" 
                        v-model="form.price"
                        @input="formatPrice"
                        placeholder="es: 12,50"
                        required
                      >
                      <span class="input-group-text">€</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="ingredientUnit" class="form-label">Unità</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="ingredientUnit" 
                  v-model="form.unit"
                  placeholder="es: kg, pz, lt..."
                >
              </div>
              
              <div class="mb-3">
                <label for="ingredientDescription" class="form-label">Descrizione</label>
                <textarea
                  placeholder="Inserisci una descrizione dettagliata dell'ingrediente"
                  class="form-control" 
                  id="ingredientDescription" 
                  v-model="form.description"
                  rows="3"
                ></textarea>
              </div>
              
              <div class="mb-3">
                <label for="ingredientImage" class="form-label">URL Immagine</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="ingredientImage" 
                  v-model="form.image"
                  placeholder="https://esempio.com/immagine.jpg"
                >
              </div>

              <div class="mb-3">
                <div class="form-check form-switch">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="ingredientAvailable"
                    v-model="form.is_available"
                  >
                  <label class="form-check-label" for="ingredientAvailable">
                    Ingrediente disponibile
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Annulla
            </button>
            <button type="button" class="btn btn-primary" @click="saveIngredient">
              {{ editMode ? 'Aggiorna' : 'Crea' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Ingredients',
  data() {
    return {
      ingredients: [],
      filteredIngredients: [],
      loading: true,
      editMode: false,
      searchTerm: '',
      availabilityFilter: '',
      form: {
        name: '',
        description: '',
        image: '',
        price: '',
        unit: '',
        is_available: true
      }
    }
  },
  async created() {
    await this.loadIngredients()
  },
  methods: {
    async loadIngredients() {
      console.log('=== INIZIO CARICAMENTO INGREDIENTI ===')
      
      const token = localStorage.getItem('token')
      console.log('Token trovato:', token ? token.substring(0, 20) + '...' : 'NESSUN TOKEN')
      
      this.loading = true
      
      try {
        const baseUrl = import.meta.env.DEV ? '/api/' : 'https://thisisnotmysite.altervista.org/mymenu/api/'
        const url = `${baseUrl}ingredients`
        console.log('URL chiamata:', url)
        
        const headers = {
          'Content-Type': 'application/json'
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
          console.log('Header Authorization aggiunto')
        }
        
        const response = await fetch(url, {
          method: 'GET',
          headers: headers
        })
        
        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)
        console.log('Response headers:', response.headers)
        
        // Leggi la risposta come testo prima
        const responseText = await response.text()
        console.log('Response TEXT:', responseText)
        console.log('Response TEXT length:', responseText.length)
        console.log('Response primi 500 caratteri:', responseText.substring(0, 500))
        
        // Prova a parsare come JSON
        let result
        try {
          result = JSON.parse(responseText)
          console.log('JSON parsing riuscito!')
        } catch (parseError) {
          console.error('❌ Errore parsing JSON:', parseError)
          console.error('Response non è JSON valido!')
          throw new Error('Risposta server non valida (non è JSON)')
        }
        
        console.log('Response completa:', result)
        console.log('Result status:', result.status)
        console.log('Result data:', result.data)
        
        if (response.ok && result.status === 200) {
          console.log('✅ Ingredienti caricati con successo!')
          console.log('Numero ingredienti:', result.data ? result.data.length : 0)
          
          this.ingredients = result.data || []
          this.filteredIngredients = this.ingredients
          console.log('Ingredienti assegnati:', this.ingredients.length)
        } else {
          console.log('❌ Caricamento fallito')
          console.log('Response status:', response.status)
          console.log('Result:', result)
          throw new Error(result.message || 'Errore nel caricamento degli ingredienti')
        }
      } catch (error) {
        console.error('❌ ERRORE CATCH:', error)
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        alert('Errore nel caricamento degli ingredienti: ' + error.message)
      } finally {
        this.loading = false
        console.log('Loading impostato a false')
        console.log('=== FINE CARICAMENTO INGREDIENTI ===')
      }
    },
    
    filterIngredients() {
      let filtered = this.ingredients
      
      if (this.searchTerm) {
        filtered = filtered.filter(ingredient => 
          ingredient.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (ingredient.description && ingredient.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
        )
      }
      
      if (this.availabilityFilter !== '') {
        const filterValue = parseInt(this.availabilityFilter)
        filtered = filtered.filter(ingredient => 
          Number(ingredient.is_available) === filterValue
        )
      }
      
      this.filteredIngredients = filtered
    },
    
    clearFilters() {
      this.searchTerm = ''
      this.availabilityFilter = ''
      this.filteredIngredients = this.ingredients
    },
    
    formatPrice(event) {
      let value = event.target.value
      
      // Rimuovi tutto tranne numeri, virgole e punti
      value = value.replace(/[^\d,\.]/g, '')
      
      // Sostituisci punti con virgole per consistenza
      value = value.replace(/\./g, ',')
      
      // Limita a massimo una virgola
      const parts = value.split(',')
      if (parts.length > 2) {
        value = parts[0] + ',' + parts.slice(1).join('')
      }
      
      // Limita i decimali a 2 cifre
      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + ',' + parts[1].substring(0, 2)
      }
      
      this.form.price = value
    },
    
    openModal(ingredient = null) {
      this.editMode = !!ingredient
      
      if (ingredient) {
        this.form = { ...ingredient }
      } else {
        this.form = {
          name: '',
          description: '',
          image: '',
          price: '',
          unit: '',
          is_available: true
        }
      }
    },
    
    async saveIngredient() {
      try {
        const payload = {
          ...this.form,
          price: this.form.price.replace(',', '.')
        }
        
        const baseUrl = import.meta.env.DEV ? '/api/' : 'https://thisisnotmysite.altervista.org/mymenu/api/'
        const url = this.editMode ? `${baseUrl}ingredients/${this.form.id}` : `${baseUrl}ingredients`
        
        const token = localStorage.getItem('token')
        const headers = {
          'Content-Type': 'application/json'
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch(url, {
          method: this.editMode ? 'PUT' : 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        })
        
        if (!response.ok) throw new Error('Network response was not ok')
        
        await this.loadIngredients()
        
        // Chiudi il modal usando l'attributo data-bs-dismiss
        document.querySelector('#ingredientModal [data-bs-dismiss="modal"]').click()
        
        alert(this.editMode ? 'Ingrediente aggiornato!' : 'Ingrediente creato!')
      } catch (error) {
        console.error('Error saving ingredient:', error)
        alert('Errore nel salvataggio dell\'ingrediente')
      }
    },
    
    async deleteIngredient(ingredient) {
      if (confirm(`Sei sicuro di voler eliminare l'ingrediente "${ingredient.name}"?`)) {
        try {
          const baseUrl = import.meta.env.DEV ? '/api/' : 'https://thisisnotmysite.altervista.org/mymenu/api/'
          const token = localStorage.getItem('token')
          const headers = {}
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
          
          const response = await fetch(`${baseUrl}ingredients/${ingredient.id}`, {
            method: 'DELETE',
            headers: headers
          })
          
          if (!response.ok) throw new Error('Network response was not ok')
          
          await this.loadIngredients()
          alert('Ingrediente eliminato!')
        } catch (error) {
          console.error('Error deleting ingredient:', error)
          alert('Errore nell\'eliminazione dell\'ingrediente')
        }
      }
    }
  }
}
</script>
<style scoped>
.ingredients .table th {
  border-top: none;
}

.btn-group .btn {
  border-radius: 0.375rem;
  margin-right: 2px;
}

.badge {
  font-size: 0.75rem;
}

.ingredient-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 0.25rem;
}

/* Mobile optimizations */
@media (max-width: 767px) {
  .ingredients h2 {
    font-size: 1.25rem;
  }
  
  .ingredients .table {
    font-size: 0.875rem;
  }
  
  .ingredients .btn-group .btn {
    padding: 0.25rem 0.4rem;
    font-size: 0.75rem;
  }
  
  /* Riduci padding del card per più spazio laterale */
  .ingredients .card-body {
    padding: 0.5rem;
  }
  
  /* Riduci padding delle celle della tabella */
  .ingredients .table td,
  .ingredients .table th {
    padding: 0.4rem;
  }
}

@media (max-width: 575px) {
  .ingredients .table {
    font-size: 0.8rem;
  }
  
  .ingredients .badge {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
  
  /* Ancora meno padding per schermi molto piccoli */
  .ingredients .card-body {
    padding: 0.25rem;
  }
  
  .ingredients .table td,
  .ingredients .table th {
    padding: 0.3rem 0.2rem;
  }
  
  /* Riduci margini tra righe e colonne */
  .ingredients .row {
    margin-left: -0.25rem;
    margin-right: -0.25rem;
  }
  
  .ingredients .row > * {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
}
</style>