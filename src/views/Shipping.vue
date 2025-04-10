<template>
  <div class="shipping-page">
    <div class="page-header py-5">
      <b-container>
        <div class="header-content text-center">
          <h1 class="page-title">Payment Method</h1>
          <div class="title-decoration"></div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb justify-content-center">
              <li class="breadcrumb-item">
                <router-link to="/"><b-icon icon="house" class="mr-1"></b-icon> Home</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/cart"><b-icon icon="cart3" class="mr-1"></b-icon> Cart</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/checkout"><b-icon icon="truck" class="mr-1"></b-icon> Checkout</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <b-icon icon="credit-card" class="mr-1"></b-icon> Payment
              </li>
            </ol>
          </nav>
        </div>
      </b-container>
      <div class="header-wave"></div>
    </div>

    <b-container class="py-5">
      <!-- No Order Warning -->
      <b-alert show variant="warning" v-if="!currentOrder">
        No active order found. <router-link to="/cart">Return to cart</router-link> to start the checkout process.
      </b-alert>

      <div v-if="currentOrder">
        <div class="checkout-steps mb-5">
          <b-progress :value="2" :max="3" height="12px" class="mb-3" variant="success"></b-progress>
          <div class="step-labels d-flex justify-content-between">
            <div class="step-label">
              <div class="step-icon completed">
                <b-icon icon="cart-check"></b-icon>
              </div>
              <div class="step-text">Cart Summary</div>
            </div>
            <div class="step-label">
              <div class="step-icon active">
                <b-icon icon="credit-card"></b-icon>
              </div>
              <div class="step-text active">Payment</div>
            </div>
            <div class="step-label">
              <div class="step-icon">
                <b-icon icon="check-circle"></b-icon>
              </div>
              <div class="step-text">Complete</div>
            </div>
          </div>
        </div>

        <b-row>
          <!-- Payment Methods -->
          <b-col lg="8" order="2" order-lg="1" class="mb-4">
            <div class="checkout-section">
              <div class="section-header">
                <h2 class="section-title">Select Payment Method</h2>
                <div class="title-decoration"></div>
              </div>
              <p class="section-description mb-4">Choose your preferred payment method to complete your order</p>

              <b-form @submit.prevent="processPayment">
                <div class="payment-methods">
                  <div
                    v-for="method in paymentMethods"
                    :key="method.id"
                    class="payment-method-option"
                    :class="{ 'active': selectedPaymentMethod === method.id }"
                    @click="selectedPaymentMethod = method.id"
                  >
                    <div class="payment-method-radio">
                      <b-form-radio
                        v-model="selectedPaymentMethod"
                        :value="method.id"
                        name="payment-method"
                      ></b-form-radio>
                    </div>
                    <div class="payment-logo">
                      <img v-if="method.image" :src="method.image" :alt="method.name" />
                      <b-icon v-else :icon="method.icon" font-scale="1.5"></b-icon>
                    </div>
                    <div class="payment-method-details">
                      <div class="payment-method-name">{{ method.name }}</div>
                      <div class="payment-method-description text-muted small">{{ method.description }}</div>
                    </div>
                  </div>
                </div>

                <!-- JazzCash Form -->
                <div v-if="selectedPaymentMethod === 'jazzcash'" class="payment-form mt-4">
                  <h5>JazzCash Payment</h5>
                  <b-form-group label="JazzCash Mobile Number" label-for="jazzcash-number">
                    <b-form-input
                      id="jazzcash-number"
                      v-model="paymentDetails.jazzcash.mobileNumber"
                      placeholder="Enter JazzCash mobile number"
                      required
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group label="CNIC (Last 6 digits)" label-for="jazzcash-cnic">
                    <b-form-input
                      id="jazzcash-cnic"
                      v-model="paymentDetails.jazzcash.cnic"
                      placeholder="Enter last 6 digits of CNIC"
                      required
                      maxlength="6"
                    ></b-form-input>
                  </b-form-group>
                </div>

                <!-- EasyPaisa Form -->
                <div v-if="selectedPaymentMethod === 'easypaisa'" class="payment-form mt-4">
                  <h5>EasyPaisa Payment</h5>
                  <b-form-group label="EasyPaisa Mobile Number" label-for="easypaisa-number">
                    <b-form-input
                      id="easypaisa-number"
                      v-model="paymentDetails.easypaisa.mobileNumber"
                      placeholder="Enter EasyPaisa mobile number"
                      required
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group label="Email (for receipt)" label-for="easypaisa-email">
                    <b-form-input
                      id="easypaisa-email"
                      v-model="paymentDetails.easypaisa.email"
                      type="email"
                      placeholder="Enter email for receipt"
                      required
                    ></b-form-input>
                  </b-form-group>
                </div>

                <div class="form-actions d-flex justify-content-between mt-5">
                  <b-button variant="outline-secondary" class="back-btn" to="/checkout">
                    <b-icon icon="arrow-left" class="mr-2"></b-icon>
                    Back to Shipping
                  </b-button>

                  <b-button variant="accent" class="next-btn" type="submit" :disabled="!selectedPaymentMethod">
                    <span>Complete Order</span>
                    <b-icon icon="check2" class="ml-2"></b-icon>
                  </b-button>
                </div>
              </b-form>
            </div>
          </b-col>

          <!-- Order Summary -->
          <b-col lg="4" order="1" order-lg="2" class="mb-4">
            <div class="order-summary">
              <div class="section-header">
                <h2 class="section-title">Order Summary</h2>
                <div class="title-decoration"></div>
              </div>

              <div class="order-details">
                <div class="order-id mb-3">
                  <strong>Order ID:</strong> {{ currentOrder.id }}
                </div>

                <div class="order-shipping-info mb-3">
                  <h5>Shipping Address</h5>
                  <address class="mb-0">
                    {{ shippingAddress.name }}<br>
                    {{ shippingAddress.address }}<br>
                    {{ shippingAddress.city }}, {{ shippingAddress.province }} {{ shippingAddress.postalCode }}<br>
                    <strong>Phone:</strong> {{ currentOrder.shippingDetails.phone }}
                  </address>
                </div>

                <hr />

                <div class="order-items-count mb-3">
                  <strong>Items:</strong> {{ currentOrder.items.length }} item(s)
                </div>

                <div class="order-summary-totals">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>Rs. {{ currentOrder.total.toLocaleString() }}</span>
                  </div>

                  <div class="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>{{ currentOrder.shippingCost > 0 ? 'Rs. ' + currentOrder.shippingCost.toLocaleString() : 'Free' }}</span>
                  </div>

                  <hr />

                  <div class="d-flex justify-content-between mb-2 font-weight-bold">
                    <span>Total:</span>
                    <span>Rs. {{ (currentOrder.total + currentOrder.shippingCost).toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import JazzCash from '../assets/jazzcash.png'
import EasyPaisa from '../assets/easypaisa.png'

export default {
  name: 'Shipping',
  data() {
    return {
      selectedPaymentMethod: null,
      paymentMethods: [
        {
          id: 'jazzcash',
          name: 'JazzCash',
          description: 'Pay with your JazzCash mobile account',
          image: JazzCash
        },
        {
          id: 'easypaisa',
          name: 'EasyPaisa',
          description: 'Pay with your EasyPaisa mobile account',
          image: EasyPaisa
        }
      ],
      paymentDetails: {
        jazzcash: {
          mobileNumber: '',
          cnic: ''
        },
        easypaisa: {
          mobileNumber: '',
          email: ''
        }
      }
    }
  },
  computed: {
    ...mapState(['currentOrder']),
    shippingAddress() {
      if (!this.currentOrder) return {}

      const details = this.currentOrder.shippingDetails
      return {
        name: `${details.firstName} ${details.lastName}`,
        address: details.address,
        city: details.city,
        province: details.province,
        postalCode: details.postalCode
      }
    }
  },
  methods: {
    ...mapActions(['completeOrder']),
    processPayment() {
      // In a real implementation, this would handle payment processing
      // For this demo, we'll just simulate a successful payment

      // Add a loading state
      this.loading = true

      // Simulate API call to payment gateway
      setTimeout(() => {
        this.completeOrder()
        this.$router.push('/checkout/success')
      }, 1500)
    }
  },
  created() {
    // Redirect to checkout if no current order
    if (!this.currentOrder) {
      this.$router.push('/checkout')
    }

    // Pre-fill customer email if available
    if (this.currentOrder && this.currentOrder.shippingDetails.email) {
      this.paymentDetails.easypaisa.email = this.currentOrder.shippingDetails.email
    }
  }
}
</script>

<style lang="scss" scoped>
.shipping-page {
  background-color: #f9f9f9;
}

.page-header {
  background-color: #1a9f6c;
  color: white;
  position: relative;
  padding-bottom: 4rem;
  margin-bottom: 1rem;
  
  .header-content {
    padding: 2rem 0 1rem;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .title-decoration {
    height: 3px;
    width: 80px;
    background: linear-gradient(90deg, #f77f00, #fcbf49);
    margin: 0 auto 1.5rem;
    position: relative;
    border-radius: 2px;
    
    &:before, &:after {
      content: '';
      position: absolute;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background-color: #fcbf49;
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
    font-size: 1rem;

    a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #fcbf49;
      }
    }
    
    .breadcrumb-item.active {
      color: rgba(255, 255, 255, 0.7);
    }
    
    .breadcrumb-item + .breadcrumb-item::before {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  
  .header-wave {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23f9f9f9'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%23f9f9f9'%3E%3C/path%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='%23f9f9f9'%3E%3C/path%3E%3C/svg%3E");
    background-size: cover;
  }
}

.section-header {
  margin-bottom: 2rem;
  
  .section-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #1a9f6c;
    margin-bottom: 1rem;
  }
  
  .title-decoration {
    height: 3px;
    width: 60px;
    background: linear-gradient(90deg, #f77f00, #fcbf49);
    margin-bottom: 1.5rem;
    position: relative;
    border-radius: 2px;
    
    &:before, &:after {
      content: '';
      position: absolute;
      height: 6px;
      width: 6px;
      border-radius: 50%;
      background-color: #fcbf49;
      top: -1.5px;
    }
    
    &:before {
      left: -4px;
    }
    
    &:after {
      right: -4px;
    }
  }
}

.section-description {
  color: #666;
  font-size: 1.05rem;
}

.checkout-section, .order-summary {
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
}

// Checkout Steps
.checkout-steps {
  margin-bottom: 2.5rem;
  
  .progress {
    height: 12px;
    border-radius: 12px;
    background-color: rgba(26, 159, 108, 0.1);
    
    .progress-bar {
      background-color: #1a9f6c;
      border-radius: 12px;
    }
  }
  
  .step-labels {
    padding: 0 1rem;
  }
  
  .step-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100px;
    position: relative;
    
    .step-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #f8f8f8;
      color: #aaa;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
      font-size: 1.5rem;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      
      &.active {
        background-color: rgba(26, 159, 108, 0.15);
        color: #1a9f6c;
        border-color: #1a9f6c;
      }
      
      &.completed {
        background-color: #1a9f6c;
        color: white;
      }
    }
    
    .step-text {
      font-size: 0.95rem;
      font-weight: 500;
      color: #777;
      
      &.active {
        color: #1a9f6c;
        font-weight: 600;
      }
    }
  }
}

// Payment Methods
.payment-methods {
  margin-bottom: 2rem;
}

.payment-method-option {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(26, 159, 108, 0.5);
    transform: translateX(5px);
  }
  
  &.active {
    border-color: #1a9f6c;
    background-color: rgba(26, 159, 108, 0.05);
    transform: translateX(5px);
  }

  .payment-method-radio {
    margin-right: 1.25rem;
    
    .custom-control-input:checked ~ .custom-control-label::before {
      background-color: #1a9f6c;
      border-color: #1a9f6c;
    }
  }

  .payment-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 50px;
    margin-right: 1.25rem;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    padding: 0.5rem;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .payment-method-details {
    flex: 1;
  }

  .payment-method-name {
    font-weight: 600;
    font-size: 1.1rem;
    color: #1a9f6c;
    margin-bottom: 0.25rem;
  }
  
  .payment-method-description {
    color: #777;
  }
}

// Payment Forms
.payment-form {
  background-color: rgba(26, 159, 108, 0.03);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 3px solid #1a9f6c;
  margin-top: 1.5rem;
  
  h5 {
    color: #1a9f6c;
    margin-bottom: 1.25rem;
    font-weight: 600;
  }
  
  .form-group label {
    font-weight: 500;
    color: #444;
  }
  
  .form-control {
    border-radius: 8px;
    border: 1px solid #ddd;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: #1a9f6c;
      box-shadow: 0 0 0 0.2rem rgba(26, 159, 108, 0.15);
    }
  }
}

// Buttons
.back-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-color: #ddd;
  
  &:hover {
    background-color: #f5f5f5;
    transform: translateX(-5px);
  }
}

.next-btn {
  background-color: #f77f00;
  border-color: #f77f00;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: #e67700; /* Darker version of #f77f00 */
    border-color: #e67700; /* Darker version of #f77f00 */
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(247, 127, 0, 0.3);
  }
  
  &:disabled {
    background-color: lighten(#f77f00, 20%);
    border-color: lighten(#f77f00, 20%);
    cursor: not-allowed;
  }
}

// Order Summary
.order-summary {
  .order-details {
    margin-top: 1.5rem;
  }
  
  .order-id {
    color: #666;
  }
  
  .order-shipping-info {
    h5 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a9f6c;
      margin-bottom: 0.75rem;
    }

    address {
      color: #666;
      line-height: 1.5;
      font-style: normal;
    }
  }
  
  hr {
    margin: 1.5rem 0;
    border-color: rgba(0, 0, 0, 0.1);
  }
  
  .price-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    color: #555;
    
    &.total {
      font-weight: 600;
      font-size: 1.1rem;
      color: #1a9f6c;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      margin-top: 0.75rem;
      padding-top: 0.75rem;
    }
  }
}
</style>
