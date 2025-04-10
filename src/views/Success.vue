<template>
  <div class="success-page">
    <div class="page-header py-5">
      <b-container>
        <div class="header-content text-center">
          <h1 class="page-title">Order Confirmed</h1>
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
                <b-icon icon="check-circle-fill" class="mr-1"></b-icon> Success
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
        No order found. <router-link to="/products">Browse products</router-link> to start shopping.
      </b-alert>

      <div v-if="currentOrder">
        <div class="checkout-steps mb-5">
          <b-progress :value="3" :max="3" height="12px" class="mb-3" variant="success"></b-progress>
          <div class="step-labels d-flex justify-content-between">
            <div class="step-label">
              <div class="step-icon completed">
                <b-icon icon="cart-check"></b-icon>
              </div>
              <div class="step-text">Cart Summary</div>
            </div>
            <div class="step-label">
              <div class="step-icon completed">
                <b-icon icon="credit-card"></b-icon>
              </div>
              <div class="step-text">Payment</div>
            </div>
            <div class="step-label">
              <div class="step-icon active">
                <b-icon icon="check-circle"></b-icon>
              </div>
              <div class="step-text active">Complete</div>
            </div>
          </div>
        </div>

        <div class="success-container">
          <div class="success-icon">
            <div class="icon-circle">
              <b-icon icon="check-lg" font-scale="3"></b-icon>
            </div>
          </div>

          <h2 class="success-title">Thank You for Your Order!</h2>
          <div class="title-decoration mx-auto"></div>

          <p class="success-message">
            Your order has been placed successfully. We'll process it as soon as possible.
            You will receive a confirmation email with your order details.
          </p>

          <div class="order-summary-card">
            <div class="order-detail-item">
              <span class="detail-label">Order Number:</span>
              <span class="detail-value">{{ currentOrder.id }}</span>
            </div>

            <div class="order-detail-item">
              <span class="detail-label">Order Date:</span>
              <span class="detail-value">{{ formatDate(currentOrder.date) }}</span>
            </div>

            <div class="order-detail-item">
              <span class="detail-label">Order Total:</span>
              <span class="detail-value">Rs. {{ (currentOrder.total + currentOrder.shippingCost).toLocaleString() }}</span>
            </div>

            <div class="order-detail-item">
              <span class="detail-label">Payment Method:</span>
              <span class="detail-value">{{ getPaymentMethod() }}</span>
            </div>
          </div>

          <div class="shipping-details mt-5">
            <div class="section-header">
              <h5>Shipping Address</h5>
              <div class="title-decoration"></div>
            </div>
            <address>
              {{ shippingAddress.name }}<br>
              {{ shippingAddress.address }}<br>
              {{ shippingAddress.city }}, {{ shippingAddress.province }} {{ shippingAddress.postalCode }}<br>
              <strong>Phone:</strong> {{ currentOrder.shippingDetails.phone }}
            </address>
          </div>

          <div class="order-items mt-5">
            <div class="section-header">
              <h5>Order Items</h5>
              <div class="title-decoration"></div>
            </div>
            <b-table
              :items="currentOrder.items"
              :fields="orderItemFields"
              responsive
              class="order-items-table"
            >
              <template #cell(name)="data">
                <div class="d-flex align-items-center">
                  <b-img :src="data.item.image" :alt="data.item.name" fluid width="50" class="mr-3"></b-img>
                  {{ data.item.name }}
                </div>
              </template>

              <template #cell(price)="data">
                Rs. {{ data.item.price.toLocaleString() }}
              </template>

              <template #cell(total)="data">
                Rs. {{ (data.item.price * data.item.quantity).toLocaleString() }}
              </template>
            </b-table>
          </div>

          <div class="order-totals mt-5">
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

          <div class="d-flex justify-content-center mt-5 action-buttons">
            <b-button variant="accent" to="/" class="action-btn continue-btn mx-2">
              <b-icon icon="bag" class="mr-2"></b-icon>
              Continue Shopping
            </b-button>
            <b-button variant="outline-secondary" @click="printOrder" class="action-btn print-btn mx-2">
              <b-icon icon="printer" class="mr-2"></b-icon>
              Print Order
            </b-button>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Success',
  data() {
    return {
      orderItemFields: [
        { key: 'name', label: 'Product' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'price', label: 'Price' },
        { key: 'total', label: 'Total' }
      ]
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
    formatDate(dateString) {
      if (!dateString) return ''

      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    },
    getPaymentMethod() {
      // In a real app, this would come from the order data
      // For this demo, we'll return a default value
      return 'Cash on Delivery'
    },
    printOrder() {
      window.print()
    }
  },
  created() {
    // Redirect to home if no current order
    if (!this.currentOrder) {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.success-page {
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

.success-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  }

  .success-icon {
    margin-bottom: 2rem;
    
    .icon-circle {
      width: 100px;
      height: 100px;
      background: rgba(26, 159, 108, 0.1);
      color: #1a9f6c;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      position: relative;
      border: 3px solid #1a9f6c;
      animation: pulse 2s infinite;
      
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(26, 159, 108, 0.4);
        }
        70% {
          box-shadow: 0 0 0 15px rgba(26, 159, 108, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(26, 159, 108, 0);
        }
      }
    }
  }

  .success-title {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1a9f6c;
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

  .success-message {
    color: #666;
    max-width: 700px;
    margin: 0 auto 2.5rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }
}

.order-summary-card {
  display: inline-block;
  text-align: left;
  padding: 1.5rem 2rem;
  background-color: rgba(26, 159, 108, 0.05);
  border-radius: 12px;
  margin-bottom: 2.5rem;
  border-left: 4px solid #1a9f6c;

  .order-detail-item {
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;

    &:last-child {
      margin-bottom: 0;
    }

    .detail-label {
      font-weight: 600;
      margin-right: 0.75rem;
      color: #444;
      min-width: 120px;
    }
    
    .detail-value {
      color: #1a9f6c;
      font-weight: 500;
    }
  }
}

.section-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
  
  h5 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #1a9f6c;
  }
  
  .title-decoration {
    height: 3px;
    width: 50px;
    background: linear-gradient(90deg, #f77f00, #fcbf49);
    margin-bottom: 0.75rem;
    position: relative;
    border-radius: 2px;
    
    &:before, &:after {
      content: '';
      position: absolute;
      height: 5px;
      width: 5px;
      border-radius: 50%;
      background-color: #fcbf49;
      top: -1px;
    }
    
    &:before {
      left: -3px;
    }
    
    &:after {
      right: -3px;
    }
  }
}

.shipping-details, .order-items, .order-totals {
  text-align: left;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  
  address {
    color: #666;
    line-height: 1.6;
    font-style: normal;
  }
}

.order-items-table {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  
  th {
    background-color: rgba(26, 159, 108, 0.1);
    color: #1a9f6c;
    font-weight: 600;
  }
  
  img {
    max-height: 60px;
    object-fit: contain;
    border-radius: 6px;
    border: 1px solid #eee;
  }
}

.order-totals {
  margin-left: auto;
  max-width: 350px;
  border-top: 3px solid #1a9f6c;
  
  hr {
    border-color: rgba(0, 0, 0, 0.1);
    margin: 0.75rem 0;
  }
}

.action-buttons {
  margin-top: 3rem;
  
  .action-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    min-width: 180px;
    
    &.continue-btn {
      background-color: #f77f00;
      border-color: #f77f00;
      color: white;
      
      &:hover {
        background-color: #e67700; /* Darker version of #f77f00 */
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(247, 127, 0, 0.3);
      }
    }
    
    &.print-btn {
      border-color: #ddd;
      
      &:hover {
        background-color: #f5f5f5;
        transform: translateY(-3px);
      }
    }
  }
}

@media print {
  .page-header, .checkout-steps, .success-icon, .action-buttons {
    display: none !important;
  }

  .success-container {
    box-shadow: none;
    padding: 0;
  }
  
  .title-decoration {
    display: none;
  }
  
  .shipping-details, .order-items, .order-totals {
    box-shadow: none;
    border: 1px solid #ddd;
    page-break-inside: avoid;
  }
}
</style>
