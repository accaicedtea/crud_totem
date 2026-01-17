<template>
    <div class="login min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div class="login-container">
            <div class="card shadow-lg border-0">
                <div class="card-body p-5">
                    <h2 class="text-center mb-4 text-primary">
                        <i class="fas fa-sign-in-alt me-2"></i>Accedi
                    </h2>
                    
                    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>{{ errorMessage }}
                    </div>

                    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                        <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
                    </div>

                    <form @submit.prevent="handleLogin">
                        <div class="mb-3">
                            <label for="email" class="form-label fw-bold">Email</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                                <input 
                                    v-model="email" 
                                    type="email" 
                                    id="email"
                                    class="form-control"
                                    placeholder="utente@example.com" 
                                    required 
                                    :disabled="loading"
                                />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label fw-bold">Password</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                <input 
                                    v-model="password" 
                                    type="password" 
                                    id="password"
                                    class="form-control"
                                    placeholder="Inserisci la password" 
                                    required 
                                    :disabled="loading"
                                />
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-2 mb-3" :disabled="loading">
                            <span v-if="loading">
                                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Accesso in corso...
                            </span>
                            <span v-else>
                                <i class="fas fa-sign-in-alt me-2"></i>Login
                            </span>
                        </button>
                    </form>

                    <div v-if="hasToken" class="api-test-section mt-4">
                        <div class="card bg-light">
                            <div class="card-header bg-info text-white">
                                <h5 class="mb-0"><i class="fas fa-flask me-2"></i>Test API</h5>
                            </div>
                            <div class="card-body">
                                <p class="text-muted small mb-3">
                                    <i class="fas fa-key me-1"></i>Token salvato: 
                                    <code>{{ savedToken ? savedToken.substring(0, 20) + '...' : 'N/A' }}</code>
                                </p>
                                <button @click="testProductsAPI" class="btn btn-info w-100" :disabled="loadingProducts">
                                    <span v-if="loadingProducts">
                                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Caricamento...
                                    </span>
                                    <span v-else>
                                        <i class="fas fa-download me-2"></i>Carica Prodotti con Promozioni
                                    </span>
                                </button>
                                
                                <div v-if="productsData" class="mt-3">
                                    <h6 class="text-success"><i class="fas fa-check-circle me-2"></i>Risultati API:</h6>
                                    <div class="bg-dark text-white p-3 rounded" style="max-height: 400px; overflow-y: auto;">
                                        <pre class="mb-0 text-white">{{ JSON.stringify(productsData, null, 2) }}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-info mt-4 mb-0" role="alert">
                        <i class="fas fa-info-circle me-2"></i><strong>Token valido per:</strong> 24 ore
                    </div>
                </div>
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

<style scoped>
.login-container {
    width: 100%;
    max-width: 500px;
    padding: 20px;
}

.card {
    border-radius: 15px;
}

.input-group-text {
    background-color: #f8f9fa;
    border-right: none;
}

.form-control {
    border-left: none;
}

.form-control:focus {
    border-left: none;
    box-shadow: none;
}

.input-group:focus-within .input-group-text {
    border-color: #86b7fe;
}

pre {
    font-size: 0.85rem;
    margin: 0;
}

code {
    background-color: #e9ecef;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
}
</style>
