// Configurazione base API
const getBaseUrl = () => {
  return import.meta.env.DEV 
    ? '/api/' 
    : 'https://thisisnotmysite.altervista.org/mymenu/api/'
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

// Funzione generica per gestire le risposte
const handleResponse = async (response) => {
  // Leggi la risposta come testo prima
  const responseText = await response.text()
  console.log('Response status:', response.status)
  console.log('Response text:', responseText)
  
  // Prova a parsare come JSON
  let result
  try {
    result = JSON.parse(responseText)
  } catch (parseError) {
    console.error('❌ Errore parsing JSON:', parseError)
    console.error('Response non è JSON valido:', responseText.substring(0, 500))
    throw new Error('Risposta server non valida (non è JSON)')
  }
  
  if (response.ok) {
    return result
  } else {
    throw new Error(result.message || 'Errore nella richiesta')
  }
}

// Metodi HTTP generici
export const apiGet = async (endpoint) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    throw new Error('Token mancante, devi fare login')
  }
  
  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  
  return handleResponse(response)
}

export const apiPost = async (endpoint, data) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    throw new Error('Token mancante, devi fare login')
  }
  
  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  
  return handleResponse(response)
}

export const apiPut = async (endpoint, data) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    throw new Error('Token mancante, devi fare login')
  }
  
  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  
  return handleResponse(response)
}

export const apiDelete = async (endpoint) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    throw new Error('Token mancante, devi fare login')
  }
  
  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  
  return handleResponse(response)
}
