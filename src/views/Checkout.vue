<template>
  <div class="checkout-page">
    <div class="page-header py-5">
      <b-container>
        <div class="header-content text-center">
          <h1 class="page-title">Checkout</h1>
          <div class="title-decoration"></div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb justify-content-center">
              <li class="breadcrumb-item">
                <router-link to="/"><b-icon icon="house" class="mr-1"></b-icon> Home</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/cart"><b-icon icon="cart3" class="mr-1"></b-icon> Cart</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <b-icon icon="credit-card" class="mr-1"></b-icon> Checkout
              </li>
            </ol>
          </nav>
        </div>
      </b-container>
      <div class="header-wave"></div>
    </div>

    <b-container class="py-4">
      <!-- Empty Cart Warning -->
      <b-alert show variant="warning" v-if="cart.length === 0" class="empty-cart-alert">
        <b-icon icon="exclamation-triangle-fill" class="mr-2"></b-icon>
        Your cart is empty. <router-link to="/products">Browse our delicious products</router-link> to add items to your cart.
      </b-alert>

      <div v-if="cart.length > 0">
        <div class="checkout-steps mb-5">
          <b-progress :value="1" :max="3" height="8px" class="mb-3 progress-bar-custom"></b-progress>
          <div class="d-flex justify-content-between">
            <div class="step active">
              <div class="step-icon"><b-icon icon="cart-check"></b-icon></div>
              <div class="step-text">1. Cart Summary</div>
            </div>
            <div class="step">
              <div class="step-icon"><b-icon icon="credit-card"></b-icon></div>
              <div class="step-text">2. Payment</div>
            </div>
            <div class="step">
              <div class="step-icon"><b-icon icon="check-circle"></b-icon></div>
              <div class="step-text">3. Complete</div>
            </div>
          </div>
        </div>

        <b-row>
          <!-- Shipping Details Form -->
          <b-col lg="8" order="2" order-lg="1" class="mb-4">
            <div class="checkout-section">
              <div class="section-header">
                <h2 class="checkout-section-title">Shipping Details</h2>
                <div class="title-decoration"></div>
              </div>

              <b-form @submit.prevent="proceedToPayment" class="checkout-form">
                <b-row>
                  <b-col md="6">
                    <b-form-group label="First Name" label-for="firstName">
                      <b-form-input
                        id="firstName"
                        v-model="form.firstName"
                        placeholder="Enter first name"
                        required
                      ></b-form-input>
                    </b-form-group>
                  </b-col>

                  <b-col md="6">
                    <b-form-group label="Last Name" label-for="lastName">
                      <b-form-input
                        id="lastName"
                        v-model="form.lastName"
                        placeholder="Enter last name"
                        required
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-form-group label="Email" label-for="email">
                  <b-form-input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="Enter email"
                    required
                  ></b-form-input>
                </b-form-group>

                <b-form-group label="Phone Number" label-for="phone">
                  <b-form-input
                    id="phone"
                    v-model="form.phone"
                    placeholder="Enter phone number"
                    required
                  ></b-form-input>
                </b-form-group>

                <b-form-group label="Address" label-for="address">
                  <b-form-input
                    id="address"
                    v-model="form.address"
                    placeholder="Enter street address"
                    required
                  ></b-form-input>
                </b-form-group>

                <b-row>
                  <b-col md="6">
                    <b-form-group label="City" label-for="city">
                      <b-form-input
                        id="city"
                        v-model="form.city"
                        placeholder="Enter city"
                        required
                      ></b-form-input>
                    </b-form-group>
                  </b-col>

                  <b-col md="6">
                    <b-form-group label="Province" label-for="province">
                      <b-form-select
                        id="province"
                        v-model="form.province"
                        :options="pakistanProvinces"
                        required
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-form-group label="Postal Code" label-for="postalCode">
                  <b-form-input
                    id="postalCode"
                    v-model="form.postalCode"
                    placeholder="Enter postal code"
                    required
                  ></b-form-input>
                </b-form-group>

                <b-form-group>
                  <b-form-checkbox
                    id="saveInfo"
                    v-model="form.saveInfo"
                  >
                    Save this information for next time
                  </b-form-checkbox>
                </b-form-group>

                <div class="form-actions d-flex justify-content-between mt-4">
                  <b-button variant="outline-teal" to="/cart" class="return-btn">
                    <b-icon icon="arrow-left" class="mr-2"></b-icon>
                    Return to Cart
                  </b-button>

                  <b-button variant="accent" type="submit" class="payment-btn">
                    Continue to Payment
                    <b-icon icon="arrow-right" class="ml-2"></b-icon>
                  </b-button>
                </div>
              </b-form>
            </div>
          </b-col>

          <!-- Order Summary -->
          <b-col lg="4" order="1" order-lg="2" class="mb-4">
            <div class="order-summary">
              <div class="section-header">
                <h2 class="checkout-section-title">Order Summary</h2>
                <div class="title-decoration"></div>
              </div>

              <div class="order-items">
                <div
                  v-for="item in cart"
                  :key="item.id"
                  class="order-item d-flex align-items-center py-2"
                >
                  <div class="order-item-image">
                    <img :src="item.image" :alt="item.name" />
                  </div>
                  <div class="order-item-info ml-3 flex-grow-1">
                    <div class="order-item-name">
                      {{ item.name }}
                    </div>
                    <div class="item-quantity">
                      <b-badge variant="light-teal" pill>Qty: {{ item.quantity }}</b-badge>
                    </div>
                  </div>
                  <div class="order-item-price">
                    {{ (item.price * item.quantity) | currency }}
                  </div>
                </div>
              </div>

              <div class="order-summary-totals mt-4">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>{{ cartTotal | currency }}</span>
                </div>

                <div class="summary-row">
                  <span>Shipping:</span>
                  <span class="shipping-cost">
                    {{ shippingCost === 0 ? 'Free' : (shippingCost | currency) }}
                    <b-badge v-if="shippingCost === 0" variant="success" pill class="free-badge">FREE</b-badge>
                  </span>
                </div>

                <div class="summary-row total">
                  <span>Total:</span>
                  <span class="grand-total">{{ (cartTotal + shippingCost) | currency }}</span>
                </div>
              </div>

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
                  <div class="payment-method-icon">
                    <b-icon icon="credit-card" font-scale="1.5"></b-icon>
                  </div>
                  <div class="payment-method-icon">
                    <b-icon icon="cash" font-scale="1.5"></b-icon>
                  </div>
                </div>
                <p class="text-center payment-info small mt-2">
                  We accept multiple payment methods for your convenience
                </p>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Checkout',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: null,
        postalCode: '',
        saveInfo: false
      },
      pakistanProvinces: [
        { value: null, text: 'Select Province' },
        { value: 'Punjab', text: 'Punjab' },
        { value: 'Sindh', text: 'Sindh' },
        { value: 'KPK', text: 'Khyber Pakhtunkhwa' },
        { value: 'Balochistan', text: 'Balochistan' },
        { value: 'GB', text: 'Gilgit-Baltistan' },
        { value: 'AJK', text: 'Azad Jammu & Kashmir' },
        { value: 'ICT', text: 'Islamabad Capital Territory' }
      ],
      shippingCost: 0
    }
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartTotal'])
  },
  methods: {
    ...mapActions(['createOrder']),
    proceedToPayment() {
      // Save shipping details in localStorage
      if (this.form.saveInfo) {
        localStorage.setItem('shipping_details', JSON.stringify(this.form))
      }

      // Create order and proceed to shipping page
      const orderDetails = {
        shippingDetails: { ...this.form },
        shippingCost: this.shippingCost
      }

      this.createOrder(orderDetails)
      this.$router.push('/checkout/shipping')
    }
  },
  watch: {
    cartTotal(newTotal) {
      // Free shipping for orders above Rs. 2000
      this.shippingCost = newTotal >= 2000 ? 0 : 200
    }
  },
  filters: {
    currency(value) {
      return `Rs. ${value.toLocaleString()}`
    }
  },
  created() {
    // Calculate shipping cost on page load
    if (this.cartTotal >= 2000) {
      this.shippingCost = 0
    } else {
      this.shippingCost = 200
    }

    // Redirect to cart page if cart is empty
    if (this.cart.length === 0) {
      this.$router.push('/cart')
    }

    // Load saved shipping details if available
    const savedDetails = localStorage.getItem('shipping_details')
    if (savedDetails) {
      this.form = { ...JSON.parse(savedDetails), saveInfo: true }
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

.checkout-section, .order-summary {
  background: white;
  border-radius: $border-radius;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  height: 100%;
  position: relative;
  
  .checkout-section {
    border-top: 4px solid $primary-color;
    
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
  
  .order-summary {
    border-top: 4px solid $primary-color;
    
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
  }
}

.checkout-section-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: $secondary-color;
  position: relative;
  display: inline-block;
}

.title-decoration {
  height: 3px;
  width: 50px;
  background-color: $accent-color;
  margin-bottom: 1.5rem;
  position: relative;
  
  &:before, &:after {
    content: '';
    position: absolute;
    height: 6px;
    width: 6px;
    background-color: $accent-color;
    border-radius: 50%;
    top: -1.5px;
  }
  
  &:before {
    left: -4px;
  }
  
  &:after {
    right: -4px;
  }
}

.checkout-steps {
  .progress-bar-custom {
    height: 8px;
    border-radius: 20px;
    overflow: hidden;
    background-color: $light-color;
    
    .progress-bar {
      background-color: $primary-color;
      box-shadow: 0 0 10px rgba($primary-color, 0.5);
    }
  }
  
  .step {
    font-weight: 500;
    color: #95a5a6;
    position: relative;
    text-align: center;
    padding: 0 10px;
    
    .step-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #f0f0f0;
      margin: 0 auto 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #aaa;
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }
    
    .step-text {
      font-size: 0.9rem;
    }

    &.active {
      color: $primary-color;
      font-weight: 600;
      
      .step-icon {
        background-color: $primary-color;
        color: white;
        box-shadow: 0 0 0 3px rgba($primary-color, 0.2);
      }
    }
  }
}

.order-item {
  padding: 0.75rem 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    transform: translateX(5px);
  }
  
  &-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background-color: $light-color;
    border-radius: 50%;
    padding: 8px;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }
    
    &:hover img {
      transform: scale(1.1);
    }
  }

  &-name {
    font-weight: 600;
    font-size: 0.95rem;
    color: $secondary-color;
    margin-bottom: 0.3rem;
  }
  
  .item-quantity {
    margin-top: 0.3rem;
    
    .badge {
      background-color: $light-color;
      color: $primary-color;
      font-weight: 500;
      font-size: 0.7rem;
    }
  }

  &-price {
    font-weight: 600;
    color: $accent-color;
    font-size: 0.95rem;
    min-width: 90px;
    text-align: right;
  }
}

.order-summary-totals {
  margin-top: 2rem;
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0;
    border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
    font-size: 1rem;
    color: $text-color;
    
    &:last-child {
      border-bottom: none;
    }
    
    .shipping-cost {
      display: flex;
      align-items: center;
      
      .free-badge {
        margin-left: 0.5rem;
        background: $primary-color;
        font-size: 0.7rem;
        padding: 0.25rem 0.5rem;
      }
    }
    
    &.total {
      border-top: 2px solid $light-color;
      border-bottom: none;
      padding-top: 1rem;
      margin-top: 0.5rem;
      font-weight: 700;
      font-size: 1.2rem;
      color: $secondary-color;
      
      .grand-total {
        color: $accent-color;
      }
    }
  }
}

.payment-methods {
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
  
  .payment-info {
    color: $text-color;
    font-weight: 500;
  }
}

.checkout-form {
  .form-group {
    margin-bottom: 1.2rem;
    
    label {
      font-weight: 600;
      color: $secondary-color;
      margin-bottom: 0.5rem;
    }
    
    .form-control, .custom-select {
      border: 1px solid #e0e0e0;
      border-radius: $border-radius;
      padding: 0.6rem 1rem;
      height: auto;
      transition: all 0.3s ease;
      
      &:focus {
        border-color: $primary-color;
        box-shadow: 0 0 0 0.2rem rgba($primary-color, 0.15);
      }
    }
  }
  
  .form-actions {
    .return-btn {
      border-color: $primary-color;
      color: $primary-color;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: $primary-color;
        color: white;
      }
    }
    
    .payment-btn {
      background-color: $accent-color;
      border-color: $accent-color;
      font-weight: 600;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: #e67700; /* Darker version of accent color */
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba($accent-color, 0.3);
      }
    }
  }
}

.empty-cart-alert {
  background-color: #fff3cd;
  border-color: #ffeeba;
  color: #856404;
  border-radius: $border-radius;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  
  a {
    color: $accent-color;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: #d96c00; /* Darker version of accent color */
      text-decoration: underline;
    }
  }
}
</style>
