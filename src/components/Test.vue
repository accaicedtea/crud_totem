<template>
  <div>
    <h2>Risultati Ingredienti con Allergeni</h2>
    <div class="mb-3">
      <div>
        <strong>Risposta originale:</strong>
        <pre style="background:#f8f9fa; border-radius:4px; padding:8px; max-height:300px; overflow:auto;">
          {{ originalJson }}
        </pre>
      </div>
      <div>
        <strong>Risposta modificata:</strong>
        <pre style="background:#f8f9fa; border-radius:4px; padding:8px; max-height:300px; overflow:auto;">
          {{ modifiedJson }}
        </pre>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-hover">
        <thead class="table-dark">
          <tr>
            <th>Nome Prodotto</th>
            <th>Categoria</th>
            <th>Prezzo</th>
            <th>Ingredienti</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in results" :key="item.product_id">
            <td>{{ item.product_name }}</td>
            <td>
              <span class="badge" :style="{ backgroundColor: item.category_color || '#6c757d' }">
                {{ item.category_name }}
              </span>
            </td>
            <td>€ {{ parseFloat(item.price).toFixed(2) }}</td>
            <td>
              <ul class="mb-0">
                <li v-for="ing in item.parsed_ingredients" :key="ing.id">
                  {{ ing.nome }} ({{ ing.prezzo }}) <span v-if="ing.boo" class="text-success">✔</span>
                </li>
              </ul>
            </td>
          </tr>
          <tr v-if="results.length === 0">
            <td colspan="4" class="text-center text-muted">Nessun dato trovato</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { testApi } from '../services/testApi'
import helpers from '../services/helpers'

const results = ref([])
const originalData = ref([])

const originalJson = computed(() => {
  try {
    return JSON.stringify(originalData.value, null, 2)
  } catch {
    return ''
  }
})
const modifiedJson = computed(() => {
  try {
    return JSON.stringify(results.value, null, 2)
  } catch {
    return ''
  }
})

onMounted(async () => {
  const result = await testApi.v_v_products_full()
  originalData.value = result.data || []
  results.value = originalData.value.map(item => {
    item = { ...item }
    item.parsed_allergens = helpers.parseIngredients(item.ingredients)
    return item
  })
  console.log('Risultato v_ingredients_with_allergens:', results.value)
})
</script>