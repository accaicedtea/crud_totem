import { apiGet, apiPost, apiPut, apiDelete } from './api'

// Servizio per la gestione delle categorie
export const categoriesService = {
  // Ottieni tutte le categorie
  async getAll() {
    return await apiGet('categories')
  },

  // Ottieni una categoria specifica
  async getById(id) {
    return await apiGet(`categories/${id}`)
  },

  // Crea una nuova categoria
  async create(categoryData) {
    return await apiPost('categories', categoryData)
  },

  // Aggiorna una categoria esistente
  async update(id, categoryData) {
    return await apiPut(`categories/${id}`, categoryData)
  },

  // Elimina una categoria
  async delete(id) {
    return await apiDelete(`categories/${id}`)
  },

  // Salva (crea o aggiorna) una categoria
  async save(categoryData, isEdit = false) {
    if (isEdit && categoryData.id) {
      return await this.update(categoryData.id, categoryData)
    } else {
      return await this.create(categoryData)
    }
  }
}
