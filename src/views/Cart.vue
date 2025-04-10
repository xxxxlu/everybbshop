<template>
  <div class="cart-page">
    <div class="page-header py-5">
      <b-container>
        <div class="header-content text-center">
          <h1 class="page-title">Your Shopping Cart</h1>
          <div class="title-decoration"></div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb justify-content-center">
              <li class="breadcrumb-item">
                <router-link to="/"><b-icon icon="house" class="mr-1"></b-icon> Home</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <b-icon icon="cart3" class="mr-1"></b-icon> Shopping Cart
              </li>
            </ol>
          </nav>
        </div>
      </b-container>
      <div class="header-wave"></div>
    </div>

    <b-container class="py-4">
      <b-row v-if="cart.length > 0">
        <!-- Cart Items -->
        <b-col lg="8" class="mb-4 mb-lg-0">
          <div class="cart-items-container">
            <div class="section-header">
              <h2 class="cart-section-title">Cart Items <span class="item-count">({{ cart.length }})</span></h2>
              <div class="title-decoration"></div>
            </div>

            <div class="cart-items">
              <b-card v-for="item in cart" :key="item.id + Math.random()" class="cart-item mb-4">
                <b-row>
                  <b-col sm="3" class="mb-3 mb-sm-0">
                    <router-link :to="`/product/${item.id}`">
                      <b-img :src="item.image" :alt="item.name" fluid class="cart-item-image"></b-img>
                    </router-link>
                  </b-col>
                  <b-col sm="9">
                    <div class="d-flex justify-content-between align-items-start">
                      <router-link :to="`/product/${item.id}`" class="cart-item-title">
                        {{ item.name }}
                      </router-link>
                      <b-button
                        variant="link"
                        class="remove-btn p-0"
                        title="Remove item"
                        @click="removeFromCart(item.id)"
                      >
                        <b-icon icon="trash"></b-icon>
                      </b-button>
                    </div>

                    <div class="cart-item-price mt-2">
                      <b-badge variant="teal-light" pill>{{ item.category }}</b-badge>
                      <div class="price-value mt-2">{{ item.price | currency }}</div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3">
                      <div class="cart-item-quantity">
                        <div class="quantity-controls">
                          <button 
                            class="qty-btn minus-btn"
                            @click="decrementQuantity(item)"
                            :disabled="item.quantity <= 1"
                          >
                            <b-icon icon="dash"></b-icon>
                          </button>
                          
                          <input
                            v-model="item.quantity"
                            type="number"
                            min="1"
                            class="qty-input"
                            @change="updateCartItemQuantity({ productId: item.id, quantity: parseInt(item.quantity) })"
                          />
                          
                          <button 
                            class="qty-btn plus-btn"
                            @click="incrementQuantity(item)"
                          >
                            <b-icon icon="plus"></b-icon>
                          </button>
                        </div>
                      </div>

                      <div class="cart-item-total font-weight-bold">
                        {{ (item.price * item.quantity) | currency }}
                      </div>
                    </div>
                  </b-col>
                </b-row>
              </b-card>
            </div>

            <div class="cart-actions mt-4">
              <b-button variant="outline-teal" to="/products" class="continue-btn">
                <b-icon icon="arrow-left" class="mr-2"></b-icon>
                Continue Shopping
              </b-button>
              <b-button variant="outline-danger" @click="confirmClearCart" class="ml-3 clear-btn">
                <b-icon icon="trash" class="mr-2"></b-icon>
                Clear Cart
              </b-button>
            </div>
          </div>
        </b-col>

        <!-- Cart Summary -->
        <b-col lg="4">
          <div class="cart-summary">
            <div class="section-header">
              <h2 class="cart-section-title">Order Summary</h2>
              <div class="title-decoration"></div>
            </div>

            <div class="summary-detail d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>Rs. {{ cartTotal.toLocaleString() }}</span>
            </div>

            <div class="summary-detail d-flex justify-content-between mb-2">
              <span>Shipping:</span>
              <span>{{ shippingCost > 0 ? 'Rs. ' + shippingCost.toLocaleString() : 'Free' }}</span>
            </div>

            <hr />

            <div class="summary-total d-flex justify-content-between mb-3">
              <span class="font-weight-bold">Total:</span>
              <span class="font-weight-bold">Rs. {{ (cartTotal + shippingCost).toLocaleString() }}</span>
            </div>

            <b-button
              variant="success"
              block
              size="lg"
              to="/checkout"
              class="checkout-btn"
              :disabled="cart.length === 0"
            >
              <b-icon icon="credit-card" class="mr-2"></b-icon>
              Proceed to Checkout
            </b-button>

            <div class="payment-methods mt-4">
              <div class="secure-payment-banner">
                <b-icon icon="shield-lock" class="shield-icon"></b-icon>
                <span>SECURE CHECKOUT</span>
              </div>
              <div class="d-flex justify-content-center mt-3">
                <div class="payment-method-icon">
                  <img src="../assets/jazzcash.png" alt="JazzCash" height="30" />
                </div>
                <div class="payment-method-icon">
                  <img src="../assets/easypaisa.png" alt="Easypaisa" height="30" />
                </div>
              </div>
              <p class="text-center payment-info small mt-2">
                We accept multiple payment methods for your convenience
              </p>
            </div>
          </div>
        </b-col>
      </b-row>

      <!-- Empty Cart Message -->
      <div v-else class="empty-cart-container text-center py-5">
        <div class="empty-cart-icon mb-4">
          <b-icon icon="cart-x" font-scale="5"></b-icon>
        </div>
        <h3>Your Cart is Empty</h3>
        <p class="text-muted">Looks like you haven't added any delicious products to your cart yet.</p>
        <b-button variant="teal" to="/products" class="mt-4 start-shopping-btn">
          <b-icon icon="basket" class="mr-2"></b-icon>
          Browse Our Products
        </b-button>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Cart',
  data() {
    return {
      shippingCost: 0
    }
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartTotal']),
    isEmpty() {
      return this.cart.length === 0
    }
  },
  methods: {
    ...mapActions(['removeFromCart', 'updateCartItemQuantity', 'clearCart']),
    incrementQuantity(item) {
      const newQuantity = item.quantity + 1
      this.updateCartItemQuantity({
        productId: item.id,
        quantity: newQuantity
      })
    },
    decrementQuantity(item) {
      if (item.quantity > 1) {
        const newQuantity = item.quantity - 1
        this.updateCartItemQuantity({
          productId: item.id,
          quantity: newQuantity
        })
      }
    },
    confirmClearCart() {
      this.$bvModal.msgBoxConfirm('Are you sure you want to clear your cart?', {
        title: 'Clear Cart',
        okVariant: 'danger',
        okTitle: 'Yes, clear cart',
        cancelTitle: 'Cancel',
        centered: true
      }).then(value => {
        if (value) {
          this.clearCart()
          this.$bvToast.toast('Your cart has been cleared', {
            title: 'Cart Cleared',
            variant: 'success',
            toaster: 'b-toaster-bottom-right',
            autoHideDelay: 3000
          })
        }
      })
    }
  },
  filters: {
    currency(value) {
      return `Rs. ${value.toLocaleString()}`
    }
  },
  watch: {
    cartTotal(newTotal) {
      // Free shipping for orders above Rs. 2000
      this.shippingCost = newTotal >= 2000 ? 0 : 200
    }
  },
  created() {
    // Calculate shipping cost on page load
    if (this.cartTotal >= 2000) {
      this.shippingCost = 0
    } else {
      this.shippingCost = 200
    }
  }
}
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #2a9d8f; // Teal green
$secondary-color: #264653; // Dark blue-green
$accent-color: #e76f51; // Orange
$light-color: #e9f5f3; // Light teal
$text-color: #333;
$border-radius: 8px;

.page-header {
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  color: white;
  position: relative;
  overflow: hidden;
  
  .header-content {
    position: relative;
    z-index: 2;
  }
  
  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
    display: inline-block;
  }
  
  .title-decoration {
    height: 3px;
    width: 80px;
    background-color: $accent-color;
    margin: 0.5rem auto 1.5rem;
    position: relative;
    
    &:before, &:after {
      content: '';
      position: absolute;
      height: 8px;
      width: 8px;
      background-color: $accent-color;
      border-radius: 50%;
      top: -2.5px;
    }
    
    &:before {
      left: -5px;
    }
    
    &:after {
      right: -5px;
    }
  }
  
  .breadcrumb {
    background: transparent;
    padding: 0;
    margin: 0;
    display: inline-flex;
    
    .breadcrumb-item {
      color: rgba(255, 255, 255, 0.9);
      font-weight: 400;
      
      a {
        color: white;
        text-decoration: none;
        transition: all 0.3s ease;
        
        &:hover {
          color: $accent-color;
        }
      }
      
      &.active {
        color: rgba(255, 255, 255, 0.8);
      }
      
      & + .breadcrumb-item::before {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
  
  .header-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23FFFFFF'/%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%23FFFFFF'/%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='%23FFFFFF'/%3E%3C/svg%3E");
    background-size: cover;
  }
}

.section-header {
  margin-bottom: 1.75rem;
  position: relative;
}

.cart-section-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: $secondary-color;
  position: relative;
  display: inline-block;
  
  .item-count {
    font-size: 1.2rem;
    color: $accent-color;
    font-weight: 500;
  }
}

.cart-items-container {
  background: white;
  border-radius: $border-radius;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  border-top: 4px solid $primary-color;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: -4px;
    left: 0;
    width: 30%;
    height: 4px;
    background-color: $accent-color;
    border-top-left-radius: $border-radius;
  }
}

.cart-item {
  border: none;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  &-image {
    max-height: 120px;
    object-fit: contain;
    transition: transform 0.5s ease;
    padding: 0.5rem;
    
    &:hover {
      transform: scale(1.05);
    }
  }

  &-title {
    font-weight: 700;
    color: $secondary-color;
    text-decoration: none;
    font-size: 1.15rem;
    transition: color 0.3s ease;

    &:hover {
      color: $primary-color;
      text-decoration: none;
    }
  }

  &-price {
    font-size: 0.95rem;
    
    .badge {
      background-color: $light-color;
      color: $primary-color;
      font-weight: 500;
      padding: 0.35rem 0.8rem;
    }
    
    .price-value {
      font-weight: 600;
      color: $accent-color;
      font-size: 1.1rem;
    }
  }

  &-total {
    color: $secondary-color;
    font-size: 1.2rem;
    font-weight: 700;
  }
  
  .remove-btn {
    color: $accent-color;
    opacity: 0.7;
    transition: all 0.3s ease;
    
    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }
  
  .quantity-controls {
    display: flex;
    align-items: center;
    height: 36px;
    width: 100px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid $primary-color;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }

  .qty-btn {
    background: none;
    border: none;
    color: $primary-color;
    height: 100%;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s ease;
    flex-shrink: 0;
    
    &:hover:not(:disabled) {
      background-color: $primary-color;
      color: white;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &:focus {
      outline: none;
    }
  }
  
  .qty-input {
    width: 40px;
    border: none;
    border-left: 1px solid rgba($primary-color, 0.2);
    border-right: 1px solid rgba($primary-color, 0.2);
    color: $secondary-color;
    font-weight: 600;
    padding: 0;
    height: 100%;
    text-align: center;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    appearance: textfield;
    background: white;
    font-size: 0.9rem;
    
    &:focus {
      box-shadow: none;
      outline: none;
    }
    
    // 隐藏数字输入的上下箭头
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}

.cart-summary {
  background: white;
  border-radius: $border-radius;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  border-top: 4px solid $primary-color;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: -4px;
    right: 0;
    width: 30%;
    height: 4px;
    background-color: $accent-color;
    border-top-right-radius: $border-radius;
  }

  .summary-detail {
    font-size: 1rem;
    color: $text-color;
    padding: 0.5rem 0;
    border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
    
    &:last-of-type {
      border-bottom: none;
    }
  }

  .summary-total {
    font-size: 1.3rem;
    color: $secondary-color;
    font-weight: 700;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
    border-top: 2px solid $light-color;
  }
  
  .checkout-btn {
    background: $accent-color;
    border-color: $accent-color;
    font-weight: 600;
    padding: 0.8rem;
    margin-top: 1rem;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      background: #e67700; /* Darker version of accent color */
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba($accent-color, 0.4);
    }
    
    &:disabled {
      background-color: #ccc;
      border-color: #ccc;
    }
  }
  
  .secure-payment-banner {
    background-color: $light-color;
    color: $primary-color;
    font-weight: 600;
    padding: 0.5rem;
    text-align: center;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .shield-icon {
      margin-right: 0.5rem;
    }
  }
  
  .payment-info {
    color: $text-color;
    font-weight: 500;
  }
}

.payment-methods {
  .payment-method-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    margin: 0 0.5rem;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }

    img {
      max-height: 30px;
    }
  }
}

.empty-cart-container {
  background: white;
  border-radius: $border-radius;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 3.5rem;
  border-top: 4px solid $primary-color;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: -4px;
    left: 30%;
    right: 30%;
    height: 4px;
    background-color: $accent-color;
  }

  h3 {
    font-weight: 700;
    margin-bottom: 1rem;
    color: $secondary-color;
    font-size: 1.8rem;
  }
  
  .empty-cart-icon {
    color: $primary-color;
    opacity: 0.7;
    margin-bottom: 1.5rem;
    position: relative;
    
    &:before {
      content: '';
      position: absolute;
      width: 100px;
      height: 100px;
      background-color: $light-color;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
    }
  }
  
  .start-shopping-btn {
    background-color: $primary-color;
    border-color: $primary-color;
    padding: 0.8rem 1.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #158f5f; /* Darker version of primary color */
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba($primary-color, 0.4);
    }
  }
}
</style>
