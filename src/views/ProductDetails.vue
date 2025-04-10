<template>
  <div class="product-details">
    <div class="page-header py-5">
      <b-container>
        <div class="header-content text-center">
          <h1 class="page-title">{{ product ? product.name : 'Product Details' }}</h1>
          <div class="title-decoration"></div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb justify-content-center">
              <li class="breadcrumb-item">
                <router-link to="/"><b-icon icon="house" class="mr-1"></b-icon> Home</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/products"><b-icon icon="basket" class="mr-1"></b-icon> Products</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <b-icon icon="bag" class="mr-1"></b-icon> {{ product ? product.name : 'Product Details' }}
              </li>
            </ol>
          </nav>
        </div>
      </b-container>
      <div class="header-wave"></div>
    </div>

    <b-container class="py-4">
      <b-alert show variant="danger" v-if="!product && !loading">
        Product not found. <router-link to="/products">Return to products</router-link>
      </b-alert>

      <div v-if="loading" class="text-center py-5">
        <b-spinner variant="primary" label="Loading..."></b-spinner>
        <p class="mt-3">Loading product details...</p>
      </div>

      <div v-if="product && !loading">
        <b-row>
          <!-- Product Image -->
          <b-col md="6" class="mb-4 mb-md-0">
            <div class="product-image-container">
              <div class="product-badge" v-if="product.isNew">New!</div>
              <div class="product-badge sale" v-if="product.onSale">Sale!</div>
              <b-img :src="product.image" :alt="product.name" fluid class="product-image"></b-img>
              <div class="image-decoration top-left"></div>
              <div class="image-decoration top-right"></div>
              <div class="image-decoration bottom-left"></div>
              <div class="image-decoration bottom-right"></div>
            </div>
          </b-col>

          <!-- Product Info -->
          <b-col md="6">
            <div class="product-info">
              <h1 class="product-title">{{ product.name }}</h1>
              <div class="product-rating" v-if="product.rating">
                <b-icon icon="star-fill" v-for="i in Math.floor(product.rating)" :key="'star-'+i" class="star-icon"></b-icon>
                <b-icon icon="star-half" v-if="product.rating % 1 >= 0.5" class="star-icon"></b-icon>
                <span class="rating-count" v-if="product.reviewCount">({{ product.reviewCount }} reviews)</span>
              </div>
              <div class="product-price">
                <span v-if="product.originalPrice" class="original-price">{{ product.originalPrice | currency }}</span>
                <span class="current-price">{{ product.price | currency }}</span>
              </div>
              <div class="product-category mt-3">
                <b-badge variant="teal-light" pill>{{ product.category }}</b-badge>
              </div>

              <div class="product-description mt-4">
                <h5 class="description-title">Description</h5>
                <div class="title-decoration small"></div>
                <p>{{ product.description }}</p>
              </div>

              <div class="product-inventory mt-4">
                <div class="stock-status mb-2" :class="{ 'in-stock': product.stock > 0, 'out-of-stock': product.stock === 0 }">
                  <b-icon
                    :icon="product.stock > 0 ? 'check-circle-fill' : 'x-circle-fill'"
                    class="mr-2"
                  ></b-icon>
                  {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
                </div>
                <div v-if="product.stock > 0" class="stock-quantity">
                  <b-icon icon="exclamation-triangle-fill" class="mr-1"></b-icon>
                  <small>Only {{ product.stock }} left</small>
                </div>
              </div>

              <div class="product-actions mt-4">
                <b-form-group label="Quantity" label-for="quantity-input">
                  <b-form-spinbutton
                    id="quantity-input"
                    v-model="quantity"
                    min="1"
                    :max="product.stock"
                    class="mb-3"
                    style="width: 120px;"
                  ></b-form-spinbutton>
                </b-form-group>

                <div class="d-flex flex-wrap">
                  <b-button
                    variant="primary"
                    class="mr-3 mb-2 add-to-cart-btn"
                    :disabled="product.stock === 0"
                    @click="addItemToCart"
                  >
                    <b-icon icon="cart-plus" class="mr-2"></b-icon>
                    Add to Cart
                  </b-button>
                  <b-button
                    variant="success"
                    class="mb-2 buy-now-btn"
                    :disabled="product.stock === 0"
                    @click="buyNow"
                  >
                    <b-icon icon="lightning" class="mr-2"></b-icon>
                    Buy Now
                  </b-button>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>

        <!-- Related Products -->
        <div class="related-products mt-5">
          <div class="text-center">
            <h3 class="section-title">Related Products</h3>
            <div class="title-decoration centered"></div>
          </div>
          <b-row>
            <b-col v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" cols="6" md="3" class="mb-4">
              <div class="card product-card">
                <router-link :to="`/product/${relatedProduct.id}`">
                  <b-img :src="relatedProduct.image" :alt="relatedProduct.name" fluid class="card-img-top"></b-img>
                </router-link>
                <div class="card-body">
                  <router-link :to="`/product/${relatedProduct.id}`" class="product-title">{{ relatedProduct.name }}</router-link>
                  <div class="product-price">Rs. {{ relatedProduct.price.toLocaleString() }}</div>
                  <div class="product-actions mt-3">
                    <b-button variant="primary" size="sm" class="related-product-btn" @click="addToCart(relatedProduct)" block>
                      <b-icon icon="cart-plus" class="mr-1"></b-icon> Add to Cart
                    </b-button>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ProductDetails',
  data() {
    return {
      productId: null,
      quantity: 1,
      loading: false
    }
  },
  computed: {
    ...mapState(['products']),
    product() {
      return this.products.find(p => p.id === parseInt(this.productId))
    },
    relatedProducts() {
      if (!this.product) return []

      return this.products
        .filter(p => p.category === this.product.category && p.id !== this.product.id)
        .slice(0, 4)
    }
  },
  watch: {
    '$route.params.id'() {
      this.updateProductId()
      // Reset quantity when product changes
      this.quantity = 1
    }
  },
  methods: {
    ...mapActions(['addToCart', 'fetchProducts']),
    updateProductId() {
      this.productId = parseInt(this.$route.params.id)
    },
    addItemToCart() {
      if (this.product && this.quantity > 0) {
        // Add item with specified quantity
        for (let i = 0; i < this.quantity; i++) {
          this.addToCart(this.product)
        }
        this.$bvToast.toast(`${this.quantity} ${this.product.name} added to cart`, {
          title: 'Added to Cart',
          variant: 'success',
          toaster: 'b-toaster-bottom-right',
          autoHideDelay: 3000
        })
      }
    },
    buyNow() {
      this.addItemToCart()
      this.$router.push('/cart')
    }
  },
  created() {
    this.updateProductId()
    if (this.products.length === 0) {
      this.loading = true
      this.fetchProducts().finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(135deg, var(--teal-lightest) 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  padding-bottom: 3rem;
  margin-bottom: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2381c784' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
  }
  
  .header-content {
    position: relative;
    z-index: 2;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--teal-darkest);
    position: relative;
    display: inline-block;
  }
  
  .title-decoration {
    width: 80px;
    height: 4px;
    background: var(--accent-color);
    margin: 0.5rem auto 1.5rem;
    border-radius: 4px;
    position: relative;
    
    &::before, &::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--teal-base);
      top: 50%;
      transform: translateY(-50%);
    }
    
    &::before {
      left: -15px;
    }
    
    &::after {
      right: -15px;
    }
    
    &.small {
      width: 50px;
      height: 3px;
      margin: 0.5rem 0 1rem;
      
      &::before, &::after {
        width: 7px;
        height: 7px;
      }
    }
    
    &.centered {
      margin: 0.5rem auto 2rem;
    }
  }

  .breadcrumb {
    background: transparent;
    padding: 0.5rem 1rem;
    margin: 0;
    display: inline-flex;
    border-radius: 30px;
    background-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0 3px 10px rgba(0,0,0,0.05);

    a {
      color: var(--teal-dark);
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        color: var(--accent-color);
      }
    }
    
    .breadcrumb-item.active {
      color: var(--accent-color);
    }
    
    .breadcrumb-item + .breadcrumb-item::before {
      content: '•';
      color: var(--teal-base);
    }
  }
  
  .header-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 1200 120' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'><path d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' fill='%23ffffff' opacity='1'/></svg>");
      height: 50px;
      width: 100%;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
}

.product-image-container {
  background: linear-gradient(to bottom, var(--teal-lightest) 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 450px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  }

  .product-image {
    max-height: 90%;
    max-width: 90%;
    object-fit: contain;
    transition: all 0.5s ease;
    z-index: 2;
  }
  
  .product-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background-color: var(--teal-base);
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    z-index: 3;
    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    
    &.sale {
      background-color: var(--accent-color);
      left: auto;
      right: 15px;
    }
  }
  
  .image-decoration {
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgba(var(--teal-base-rgb), 0.1);
    z-index: 1;
    
    &.top-left {
      top: 20px;
      left: 20px;
    }
    
    &.top-right {
      top: 20px;
      right: 20px;
    }
    
    &.bottom-left {
      bottom: 20px;
      left: 20px;
    }
    
    &.bottom-right {
      bottom: 20px;
      right: 20px;
    }
  }
}

.product-info {
  padding: 1rem;
  
  .product-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--teal-darkest);
    line-height: 1.3;
  }
  
  .product-rating {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    
    .star-icon {
      color: #FFD700;
      margin-right: 2px;
      font-size: 1.1rem;
    }
    
    .rating-count {
      color: #777;
      margin-left: 8px;
      font-size: 0.9rem;
    }
  }

  .product-price {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    
    .current-price {
      color: var(--accent-color);
    }
    
    .original-price {
      color: #999;
      text-decoration: line-through;
      font-size: 1.1rem;
      font-weight: 400;
      margin-right: 0.8rem;
    }
  }
  
  .product-category {
    margin-bottom: 1rem;
    
    .badge {
      background-color: var(--teal-lightest);
      color: var(--teal-dark);
      font-weight: 600;
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }
  }

  .product-description {
    background-color: rgba(var(--teal-lightest-rgb), 0.3);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    position: relative;
    
    .description-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--teal-dark);
    }

    p {
      color: #555;
      line-height: 1.7;
      margin-bottom: 0;
    }
  }

  .stock-status {
    font-weight: 600;
    font-size: 1.1rem;
    display: flex;
    align-items: center;

    &.in-stock {
      color: var(--teal-dark);
    }

    &.out-of-stock {
      color: var(--accent-color);
    }
    
    .b-icon {
      font-size: 1.1rem;
    }
  }

  .stock-quantity {
    color: var(--accent-color);
    display: flex;
    align-items: center;
    font-weight: 500;
    
    small {
      font-size: 0.9rem;
    }
  }
  
  .add-to-cart-btn {
    background-color: var(--teal-base);
    border-color: var(--teal-base);
    border-radius: 30px;
    padding: 0.7rem 1.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.15);
      background-color: var(--teal-dark);
      border-color: var(--teal-dark);
    }
    
    &:active {
      transform: translateY(-1px);
    }
    
    &:disabled {
      background-color: #ccc;
      border-color: #ccc;
      transform: none;
      box-shadow: none;
    }
  }
  
  .buy-now-btn {
    border-radius: 30px;
    padding: 0.7rem 1.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.15);
      background-color: #d96c00; /* Darker version of accent color */
      border-color: #d96c00; /* Darker version of accent color */
    }
    
    &:active {
      transform: translateY(-1px);
    }
    
    &:disabled {
      background-color: #ccc;
      border-color: #ccc;
      transform: none;
      box-shadow: none;
    }
  }
}

.related-products {
  padding-top: 2rem;
  margin-top: 3rem;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 2px;
    width: 80%;
    background: linear-gradient(90deg, transparent, var(--teal-light), transparent);
  }
  
  .section-title {
    position: relative;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    color: var(--teal-darkest);
    font-size: 1.8rem;
    font-weight: 700;
    display: inline-block;
  }
  
  .product-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.4s ease;
    border: none;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    position: relative;
    background-color: white;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    .card-img-top {
      height: 180px;
      object-fit: contain;
      padding: 1rem;
      background: linear-gradient(to bottom, var(--teal-lightest) 0%, #ffffff 100%);
    }
    
    .card-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    
    .product-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--teal-darkest);
      text-decoration: none;
      margin-bottom: 0.5rem;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 2.5em;
      line-height: 1.3;
      transition: all 0.3s ease;
      
      &:hover {
        color: var(--accent-color);
      }
    }
    
    .product-price {
      font-size: 1rem;
      font-weight: 700;
      color: var(--accent-color);
      margin-bottom: 0.75rem;
    }
    
    .related-product-btn {
      background-color: var(--teal-base);
      border-color: var(--teal-base);
      border-radius: 30px;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: var(--teal-dark);
        border-color: var(--teal-dark);
      }
    }
  }
}
</style>
