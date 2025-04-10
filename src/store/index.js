import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 从 localStorage 获取购物车数据（使用Publlshop前缀避免冲突）
const CART_STORAGE_KEY = 'publlshop_cart'
const savedCart = localStorage.getItem(CART_STORAGE_KEY)

export default new Vuex.Store({
  state: {
    cart: savedCart ? JSON.parse(savedCart) : [],
    products: [],
    loading: false,
    currentOrder: null
  },
  getters: {
    cartTotal(state) {
      return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    cartItemCount(state) {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    }
  },
  mutations: {
    setProducts(state, products) {
      state.products = products
    },
    addToCart(state, product) {
      const existingItem = state.cart.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.cart.push({
          ...product,
          quantity: 1
        })
      }
      // Save to localStorage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart))
    },
    removeFromCart(state, productId) {
      state.cart = state.cart.filter(item => item.id !== productId)
      // Save to localStorage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart))
    },
    updateCartItemQuantity(state, { productId, quantity }) {
      const item = state.cart.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
      }
      // Save to localStorage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart))
    },
    clearCart(state) {
      state.cart = []
      localStorage.removeItem(CART_STORAGE_KEY)
    },
    loadCart(state) {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        state.cart = JSON.parse(savedCart)
      }
    },
    setLoading(state, isLoading) {
      state.loading = isLoading
    },
    setCurrentOrder(state, order) {
      state.currentOrder = order
      localStorage.setItem('currentOrder', JSON.stringify(order))
    }
  },
  actions: {
    fetchProducts({ commit }) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        // We're using local data for this example
        // In a real app, you'd fetch from an API
        
        // 使用动态导入，但添加更完善的错误处理和图片验证
        import('@/data/products.js')
          .then(module => {
            const products = module.default;
            
            // 验证每个产品的图片URL
            const validatedProducts = products.map(product => {
              // 确保图片URL有效，如果无效则使用占位图
              if (!product.image || product.image.trim() === '') {
                product.image = 'https://via.placeholder.com/300x200?text=Product+Image'
              }
              return product
            })
            
            commit('setProducts', validatedProducts)
            commit('setLoading', false)
            console.log('成功加载产品数据，数量:', validatedProducts.length)
            resolve(validatedProducts)
          })
          .catch(error => {
            console.error('Error loading products:', error)
            commit('setLoading', false)
            reject(error)
          })
      })
    },
    addToCart({ commit }, product) {
      commit('addToCart', product)
    },
    removeFromCart({ commit }, productId) {
      commit('removeFromCart', productId)
    },
    updateCartItemQuantity({ commit }, payload) {
      commit('updateCartItemQuantity', payload)
    },
    clearCart({ commit }) {
      commit('clearCart')
    },
    initCart({ commit }) {
      commit('loadCart')
    },
    createOrder({ commit, state }, orderDetails) {
      const order = {
        id: 'ORDER-' + Date.now(),
        items: [...state.cart],
        total: state.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        ...orderDetails,
        status: 'pending',
        date: new Date().toISOString()
      }
      commit('setCurrentOrder', order)
      return order
    },
    completeOrder({ commit }) {
      commit('clearCart')
      const currentOrder = JSON.parse(localStorage.getItem('currentOrder'))
      currentOrder.status = 'completed'
      commit('setCurrentOrder', currentOrder)
      return currentOrder
    }
  }
})
