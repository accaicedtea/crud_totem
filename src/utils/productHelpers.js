// Funzioni helper per il parsing dei dati dei prodotti

/**
 * Parsa la stringa degli ingredienti dal formato API
 * Formato: "id:nome:quantity:is_optional|id:nome:quantity:is_optional"
 * @param {string} ingredientsString - Stringa degli ingredienti
 * @returns {Array} Array di oggetti ingrediente
 */
export function parseIngredients(ingredientsString) {
  if (!ingredientsString || ingredientsString === 'null') {
    return []
  }

  return ingredientsString.split('|').map(item => {
    const [ingredient_id, name, quantity, is_optional] = item.split(':')
    return {
      ingredient_id: parseInt(ingredient_id),
      name: name,
      quantity: parseFloat(quantity),
      is_optional: parseInt(is_optional) === 1
    }
  })
}

/**
 * Parsa la stringa degli allergeni dal formato API
 * Formato: "id:nome:icon|id:nome:icon"
 * @param {string} allergensString - Stringa degli allergeni
 * @returns {Array} Array di oggetti allergene
 */
export function parseAllergens(allergensString) {
  if (!allergensString || allergensString === 'null') {
    return []
  }

  return allergensString.split('|').map(item => {
    const [allergen_id, name, icon] = item.split(':')
    return {
      allergen_id: parseInt(allergen_id),
      name: name,
      icon: icon !== '?' ? icon : null
    }
  })
}

/**
 * Trasforma un prodotto dalla view API al formato utilizzato dal componente
 * @param {Object} apiProduct - Prodotto dalla API view
 * @returns {Object} Prodotto nel formato del componente
 */
export function transformProductFromView(apiProduct) {
  return {
    id: parseInt(apiProduct.product_id),
    name: apiProduct.product_name,
    slug: apiProduct.product_slug,
    description: apiProduct.product_description,
    price: parseFloat(apiProduct.price),
    image: apiProduct.image,
    category_id: parseInt(apiProduct.category_id),
    category_name: apiProduct.category_name,
    category_color: apiProduct.category_color,
    is_active: parseInt(apiProduct.is_available) === 1,
    is_featured: parseInt(apiProduct.is_featured) === 1,
    sort_order: 0, // non presente nella view, default
    stock: apiProduct.stock,
    notes: apiProduct.notes,
    // Parsa ingredienti e allergeni
    ingredients: parseIngredients(apiProduct.ingredients),
    allergens: parseAllergens(apiProduct.allergens),
    created_at: apiProduct.created_at,
    updated_at: apiProduct.updated_at
  }
}

/**
 * Estrae gli ID degli ingredienti da un prodotto
 * @param {Object} product - Prodotto
 * @returns {Array} Array di ID ingredienti
 */
export function extractIngredientIds(product) {
  if (!product.ingredients) return []
  return product.ingredients.map(i => i.ingredient_id)
}

/**
 * Estrae gli ID degli allergeni da un prodotto
 * @param {Object} product - Prodotto
 * @returns {Array} Array di ID allergeni
 */
export function extractAllergenIds(product) {
  if (!product.allergens) return []
  return product.allergens.map(a => a.allergen_id)
}
