import { apiGet, apiPost, apiPut, apiDelete } from './api'

// Servizio per la gestione degli allergeni
export const allergensService = {
  // Ottieni tutti gli allergeni
  async getAll() {
    return await apiGet('allergens')
  },

  // Ottieni un allergene specifico
  async getById(id) {
    return await apiGet(`allergens/${id}`)
  },

  // Crea un nuovo allergene
  async create(allergenData) {
    return await apiPost('allergens', allergenData)
  },

  // Aggiorna un allergene esistente
  async update(id, allergenData) {
    return await apiPut(`allergens/${id}`, allergenData)
  },

  // Elimina un allergene
  async delete(id) {
    return await apiDelete(`allergens/${id}`)
  },

  // Salva (crea o aggiorna) un allergene
  async save(allergenData, isEdit = false) {
    if (isEdit && allergenData.id) {
      return await this.update(allergenData.id, allergenData)
    } else {
      return await this.create(allergenData)
    }
  }
}
