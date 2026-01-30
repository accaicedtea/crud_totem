import { apiGet} from './api'
// Servizio per la gestione degli allergeni
export const testApi = {
  // Ottieni tutti gli allergeni
  async v_v_products_full() {
    return await apiGet('_view_v_products_full')
  },
  async v_ingredients_with_allergens() {
    return await apiGet('/views/v_ingredients_with_allergens')
  },
}
