import { apiGet, apiPost, apiPut, apiDelete } from './api'

// Servizio per la gestione degli ingredienti
export const ingredientsService = {
  // Ottieni tutti gli ingredienti
  async getAll() {
    return await apiGet('ingredients')
  },

  // Ottieni un ingrediente specifico
  async getById(id) {
    return await apiGet(`ingredients/${id}`)
  },

  // Crea un nuovo ingrediente
  async create(ingredientData) {
    return await apiPost('ingredients', ingredientData)
  },

  // Aggiorna un ingrediente esistente
  async update(id, ingredientData) {
    return await apiPut(`ingredients/${id}`, ingredientData)
  },

  // Elimina un ingrediente
  async delete(id) {
    return await apiDelete(`ingredients/${id}`)
  },

  // Salva (crea o aggiorna) un ingrediente
  async save(ingredientData, isEdit = false) {
    if (isEdit && ingredientData.id) {
      return await this.update(ingredientData.id, ingredientData)
    } else {
      return await this.create(ingredientData)
    }
  }
}
