<template>
    <div class="login">
        <div class="login-container">
            <h2>Accedi</h2>
            
            <div v-if="errorMessage" class="alert alert-error">
                {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="alert alert-success">
                {{ successMessage }}
            </div>

            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input 
                        v-model="email" 
                        type="email" 
                        id="email"
                        placeholder="utente@example.com" 
                        required 
                        :disabled="loading"
                    />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                        v-model="password" 
                        type="password" 
                        id="password"
                        placeholder="Inserisci la password" 
                        required 
                        :disabled="loading"
                    />
                </div>

                <button type="submit" :disabled="loading">
                    <span v-if="loading">Accesso in corso...</span>
                    <span v-else>Login</span>
                </button>
            </form>

            <div v-if="hasToken" class="api-test-section">
                <h3>Test API</h3>
                <p class="token-info">Token salvato: {{ savedToken ? savedToken.substring(0, 20) + '...' : 'N/A' }}</p>
                <button @click="testProductsAPI" :disabled="loadingProducts">
                    <span v-if="loadingProducts">Caricamento...</span>
                    <span v-else>Carica Prodotti con Promozioni</span>
                </button>
                
                <div v-if="productsData" class="api-results">
                    <h4>Risultati API:</h4>
                    <pre>{{ JSON.stringify(productsData, null, 2) }}</pre>
                </div>
            </div>

            <div class="info-box">
                <p><strong>Token valido per:</strong> 24 ore</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            loading: false,
            loadingProducts: false,
            errorMessage: '',
            successMessage: '',
            productsData: null,
            // In dev usa proxy locale (/api), in produzione URL completo
            baseUrl: import.meta.env.DEV ? '/api/' : 'https://thisisnotmysite.altervista.org/mymenu/api',
            hasToken: false,
            savedToken: null
        }
    },
    mounted() {
        // Controllo se c'è un token
        const token = localStorage.getItem('token')
        if (token) {
            console.log('Token trovato:', token)
            this.hasToken = true
            this.savedToken = token
        }
    },
    methods: {
        async handleLogin() {
            console.log('=== INIZIO LOGIN ===')
            console.log('Email inserita:', this.email)
            console.log('Password inserita:', this.password)
            
            this.errorMessage = ''
            this.successMessage = ''
            this.loading = true

            try {
                const requestData = { 
                    email: this.email, 
                    password: this.password 
                }
                console.log('Dati richiesta:', requestData)

                const url = `${this.baseUrl}auth/login`
                console.log('URL chiamata:', url)

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(requestData)
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
                console.log('Result message:', result.message)

                if (response.ok && result.status === 200) {
                    console.log('✅ Login riuscito!')
                    console.log('Token ricevuto:', result.data.token)
                    console.log('User data:', result.data.user)
                    
                    // Salva il token
                    localStorage.setItem('token', result.data.token)
                    console.log('Token salvato in localStorage')
                    
                    // Salva le info utente
                    localStorage.setItem('user', JSON.stringify(result.data.user))
                    console.log('User salvato in localStorage')
                    
                    // Aggiorna stato reattivo
                    this.hasToken = true
                    this.savedToken = result.data.token
                    
                    this.successMessage = result.message || 'Login effettuato con successo! Ora puoi testare le API.'
                    console.log('Success message impostato:', this.successMessage)
                } else {
                    console.log('❌ Login fallito')
                    console.log('Response status:', response.status)
                    console.log('Result:', result)
                    this.errorMessage = result.message || 'Credenziali non valide'
                    console.log('Error message impostato:', this.errorMessage)
                }
            } catch (error) {
                console.error('❌ ERRORE CATCH:', error)
                console.error('Error name:', error.name)
                console.error('Error message:', error.message)
                console.error('Error stack:', error.stack)
                this.errorMessage = 'Errore di connessione. Riprova.'
            } finally {
                this.loading = false
                console.log('Loading impostato a false')
                console.log('=== FINE LOGIN ===')
            }
        },
        
        async testProductsAPI() {
            const token = localStorage.getItem('token')
            if (!token) {
                console.error('Token non trovato')
                this.errorMessage = 'Devi prima effettuare il login'
                return
            }

            this.loadingProducts = true
            this.errorMessage = ''
            this.productsData = null

            try {
                const url = `${this.baseUrl}_view_v_products_full`
                console.log('=== TEST API ===')
                console.log('URL:', url)
                console.log('Token:', token)
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                console.log('Response status:', response.status)
                console.log('Response ok:', response.ok)

                const responseText = await response.text()
                console.log('Response text:', responseText)

                if (response.ok) {
                    const data = JSON.parse(responseText)
                    console.log('✅ Dati ricevuti:', data)
                    this.productsData = data
                } else {
                    console.error('❌ Errore nella richiesta:', response.status)
                    this.errorMessage = `Errore API: ${response.status} - ${responseText}`
                }
            } catch (error) {
                console.error('❌ Errore durante la chiamata API:', error)
                this.errorMessage = `Errore: ${error.message}`
            } finally {
                this.loadingProducts = false
            }
        }
    }
}
</script>

