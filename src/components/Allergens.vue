<template>
  <div class="">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2>
          <i class="fas fa-exclamation-triangle me-2"></i>
          Gestione Allergeni
        </h2>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#allergenModal" @click="openModal()">
          <i class="fas fa-plus me-2"></i>Nuovo Allergene
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="row mb-3">
      <div class="col-md-4">
        <select class="form-select" v-model="activeFilter" @change="filterAllergens">
          <option value="">Tutti gli stati</option>
          <option value="1">Attivi</option>
          <option value="0">Non attivi</option>
        </select>
      </div>
      <div class="col-md-4">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Cerca per nome..."
          v-model="searchTerm"
          @input="filterAllergens"
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

    <!-- Allergens Table -->
    <div v-else class="">
      <div class="">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th class="d-none d-md-table-cell">Icona</th>
                <th>Nome</th>
                <th class="d-none d-lg-table-cell">Descrizione</th>
                <!--
                <th>Azioni</th>
                -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="allergen in filteredAllergens" :key="allergen.id">
                <td class="d-none d-md-table-cell">
                  <span v-if="allergen.icon" class="allergen-icon" v-html="allergen.icon"></span>
                  <span v-else class="text-muted">
                    <i class="fas fa-question fa-2x"></i>
                  </span>
                </td>
                <td>
                  <strong>{{ allergen.name }}</strong>
                </td>
                <td class="d-none d-lg-table-cell">
                  <div v-if="allergen.description">{{ allergen.description }}</div>
                  <em v-else class="text-muted">Nessuna descrizione</em>
                </td>
                <!--
                  <div class="btn-group">
                    <button 
                      class="btn btn-sm btn-outline-warning" 
                      data-bs-toggle="modal" 
                      data-bs-target="#allergenModal"
                      @click="openModal(allergen)"
                      title="Modifica"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      @click="deleteAllergen(allergen)"
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
        
        <div v-if="filteredAllergens.length === 0" class="text-center text-muted py-4">
          <i class="fas fa-inbox fa-3x mb-3"></i>
          <p>Nessun allergene trovato</p>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit Allergen -->
    <div class="modal fade" id="allergenModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editMode ? 'Modifica Allergene' : 'Nuovo Allergene' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveAllergen">
              <div class="row">
                <div class="col-md-8">
                  <div class="mb-3">
                    <label for="allergenName" class="form-label">Nome *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="allergenName" 
                      v-model="form.name"
                      placeholder="Inserisci il nome dell'allergene"
                      required
                    >
                  </div>
                </div>
                
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="allergenIcon" class="form-label">Icona/Emoji</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="allergenIcon" 
                      v-model="form.icon"
                      placeholder="🥜 oppure <i class='fas fa-...'>'"
                    >
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="allergenDescription" class="form-label">Descrizione</label>
                <textarea
                  placeholder="Inserisci una descrizione dettagliata dell'allergene"
                  class="form-control" 
                  id="allergenDescription" 
                  v-model="form.description"
                  rows="3"
                ></textarea>
              </div>

              <div class="mb-3">
                <div class="form-check form-switch">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="allergenActive"
                    v-model="form.is_active"
                  >
                  <label class="form-check-label" for="allergenActive">
                    Allergene attivo
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Annulla
            </button>
            <button type="button" class="btn btn-primary" @click="saveAllergen">
              {{ editMode ? 'Aggiorna' : 'Crea' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { allergensService } from '../services/allergensService'

export default {
  name: 'Allergens',
  data() {
    return {
      allergens: [],
      filteredAllergens: [],
      loading: true,
      editMode: false,
      searchTerm: '',
      activeFilter: '',
      form: {
        name: '',
        description: '',
        icon: '',
        is_active: true
      }
    }
  },
  async created() {
    await this.loadAllergens()
  },
  methods: {
    async loadAllergens() {
      this.loading = true
      
      try {
        const result = await allergensService.getAll()
        
        this.allergens = result.data || []
        this.filteredAllergens = this.allergens
        console.log('✅ Allergeni caricati:', this.allergens.length)
      } catch (error) {
        console.error('❌ Errore caricamento allergeni:', error)
        alert('Errore nel caricamento degli allergeni: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    
    filterAllergens() {
      let filtered = this.allergens
      
      if (this.searchTerm) {
        filtered = filtered.filter(allergen => 
          allergen.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (allergen.description && allergen.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
        )
      }
      
      if (this.activeFilter !== '') {
        const filterValue = parseInt(this.activeFilter)
        filtered = filtered.filter(allergen => 
          Number(allergen.is_active) === filterValue
        )
      }
      
      this.filteredAllergens = filtered
    },
    
    clearFilters() {
      this.searchTerm = ''
      this.activeFilter = ''
      this.filteredAllergens = this.allergens
    },
    
    openModal(allergen = null) {
      this.editMode = !!allergen
      
      if (allergen) {
        this.form = { ...allergen }
      } else {
        this.form = {
          name: '',
          description: '',
          icon: '',
          is_active: true
        }
      }
    },
    
    async saveAllergen() {
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
        console.log(payload)
        const result = await allergensService.save(payload, this.editMode)
        
        // Ricarica gli allergeni
        await this.loadAllergens()
        
        // Chiudi il modal
        document.querySelector('#allergenModal [data-bs-dismiss="modal"]').click()
        
        // Mostra messaggio di successo
        const successMessage = this.editMode 
          ? `Allergene aggiornato con successo!` 
          : `Allergene creato con ID: ${result.data?.id || result.id}`
        alert(successMessage)
        
      } catch (error) {
        console.error('Error saving allergen:', error)
        alert('Errore: ' + error.message)
      }
    },
    
    async deleteAllergen(allergen) {
      if (confirm(`Sei sicuro di voler eliminare l'allergene "${allergen.name}"?`)) {
        try {
          await allergensService.delete(allergen.id)
          await this.loadAllergens()
          alert('Allergene eliminato con successo!')
        } catch (error) {
          console.error('Error deleting allergen:', error)
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

.allergen-icon {
  font-size: 2rem;
  display: inline-block;
}

/* Mobile optimizations */
@media (max-width: 767px) {
  .allergens h2 {
    font-size: 1.25rem;
  }
  
  .allergens .table {
    font-size: 0.875rem;
  }
  
  .allergens .btn-group .btn {
    padding: 0.25rem 0.4rem;
    font-size: 0.75rem;
  }
  
  .allergens .card-body {
    padding: 0.5rem;
  }
  
  .allergens .table td,
  .allergens .table th {
    padding: 0.4rem;
  }
}

@media (max-width: 575px) {
  .allergens .table {
    font-size: 0.8rem;
  }
  
  .allergens .badge {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
  
  .allergens .card-body {
    padding: 0.25rem;
  }
  
  .allergens .table td,
  .allergens .table th {
    padding: 0.3rem 0.2rem;
  }
  
  .allergens .row {
    margin-left: -0.25rem;
    margin-right: -0.25rem;
  }
  
  .allergens .row > * {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
}
</style>
