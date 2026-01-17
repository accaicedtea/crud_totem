import { apiGet, apiPost, apiPut, apiDelete } from './api'

// Servizio per la gestione dei prodotti
export const productsService = {
  // Ottieni tutti i prodotti con dettagli completi (dalla view)
  async getAll() {
    return await apiGet('_view_v_products_full')
  },

  // Ottieni un prodotto specifico con dettagli completi
  async getById(id) {
    const result = await apiGet('_view_v_products_full')
    const products = result.data || []
    const product = products.find(p => p.product_id == id)
    return { data: product }
  },

  // Crea un nuovo prodotto
  async create(productData) {
    return await apiPost('products', productData)
  },

  // Aggiorna un prodotto esistente
  async update(id, productData) {
    return await apiPut(`products/${id}`, productData)
  },

  // Elimina un prodotto
  async delete(id) {
    return await apiDelete(`products/${id}`)
  },

  // Salva (crea o aggiorna) un prodotto
  async save(productData, isEdit = false) {
    if (isEdit && productData.id) {
      return await this.update(productData.id, productData)
    } else {
      return await this.create(productData)
    }
  },

  // Gestione allergeni del prodotto
  async addAllergen(productId, allergenId) {
    return await apiPost(`products/${productId}/allergens`, { allergen_id: allergenId })
  },

  async removeAllergen(productId, allergenId) {
    return await apiDelete(`products/${productId}/allergens/${allergenId}`)
  },

  // Gestione ingredienti del prodotto
  async addIngredient(productId, ingredientData) {
    return await apiPost(`products/${productId}/ingredients`, ingredientData)
  },

  async updateIngredient(productId, ingredientId, ingredientData) {
    return await apiPut(`products/${productId}/ingredients/${ingredientId}`, ingredientData)
  },

  async removeIngredient(productId, ingredientId) {
    return await apiDelete(`products/${productId}/ingredients/${ingredientId}`)
  },

  // Gestione promozioni del prodotto
  async addPromotion(productId, promotionId) {
    return await apiPost(`products/${productId}/promotions`, { promotion_id: promotionId })
  },

  async removePromotion(productId, promotionId) {
    return await apiDelete(`products/${productId}/promotions/${promotionId}`)
  }
}
