<template>
  <div class="products-page">
    <div class="page-header py-5">
      <b-container>
        <div class="header-content text-center">
          <h1 class="page-title">Our Delicious Products</h1>
          <div class="title-decoration"></div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb justify-content-center">
              <li class="breadcrumb-item">
                <router-link to="/"><b-icon icon="house" class="mr-1"></b-icon> Home</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <b-icon icon="basket" class="mr-1"></b-icon> Products
              </li>
            </ol>
          </nav>
        </div>
      </b-container>
      <div class="header-wave"></div>
    </div>

    <b-container class="py-4">
      <b-row>
        <!-- Filters Sidebar -->
        <b-col md="3" class="mb-4 mb-md-0">
          <div class="filters-sidebar">
            <div class="sidebar-header">
              <b-icon icon="funnel" class="mr-2 filter-icon"></b-icon>
              <h3>Filter Options</h3>
            </div>
            <div class="filter-section">
              <h4 class="filter-header">Categories</h4>
              <div class="filter-decoration"></div>
              <b-form-group>
                <b-form-checkbox-group
                  v-model="selectedCategories"
                  stacked
                  class="custom-category-checkboxes"
                >
                  <b-form-checkbox
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                    class="category-checkbox-item custom-checkbox"
                  >
                    <span class="checkbox-label">{{ category }}</span>
                    <span class="category-item-count">({{ getCategoryCount(category) }})</span>
                  </b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
            </div>

            <div class="filter-section">
              <h4 class="filter-header">Price Range</h4>
              <div class="filter-decoration"></div>
              <b-form-group>
                <b-row>
                  <b-col cols="6">
                    <b-form-input
                      v-model="priceRange.min"
                      type="number"
                      min="0"
                      placeholder="Min"
                    ></b-form-input>
                  </b-col>
                  <b-col cols="6">
                    <b-form-input
                      v-model="priceRange.max"
                      type="number"
                      min="0"
                      placeholder="Max"
                    ></b-form-input>
                  </b-col>
                </b-row>
              </b-form-group>
            </div>

            <b-button
              variant="primary"
              block
              class="mt-4 apply-btn"
              @click="applyFilters"
            >
              <b-icon icon="filter-circle" class="mr-2"></b-icon> Apply Filters
            </b-button>

            <b-button
              variant="outline-secondary"
              block
              class="mt-2 reset-btn"
              @click="resetFilters"
            >
              <b-icon icon="arrow-repeat" class="mr-2"></b-icon> Reset Filters
            </b-button>
          </div>
        </b-col>

        <!-- Products Grid -->
        <b-col md="9">
          <div class="products-controls mb-4">
            <b-row align-v="center">
              <b-col sm="6" class="mb-2 mb-sm-0">
                <div class="search-wrapper">
                  <b-form-input
                    v-model="searchQuery"
                    placeholder="Search delicious products..."
                    @input="applyFilters"
                    class="search-input"
                  ></b-form-input>
                  <b-icon icon="search" class="search-icon"></b-icon>
                </div>
              </b-col>
              <b-col sm="6">
                <div class="d-flex justify-content-sm-end">
                  <div class="sort-wrapper">
                    <b-icon icon="sort-down-alt" class="sort-icon"></b-icon>
                    <b-form-select
                      v-model="sortBy"
                      :options="sortOptions"
                      class="sort-select"
                      @change="applyFilters"
                    ></b-form-select>
                  </div>
                </div>
              </b-col>
            </b-row>
          </div>

          <b-alert :show="filteredProducts.length === 0" variant="info">
            No products found matching your criteria. Try adjusting your filters.
          </b-alert>

          <b-row v-if="filteredProducts.length > 0">
            <b-col v-for="product in filteredProducts" :key="product.id" cols="6" md="4" lg="4" class="mb-4">
              <div class="card product-card" :data-product-id="product.id">
                <div class="product-badge" v-if="product.isNew">New!</div>
                <div class="product-badge sale" v-if="product.onSale">Sale!</div>
                <router-link :to="`/product/${product.id}`" class="product-img-wrapper">
                  <b-img :src="product.image" :alt="product.name" fluid class="card-img-top"></b-img>
                  <div class="hover-overlay">
                    <div class="overlay-content">
                      <span>View Details</span>
                      <b-icon icon="eye" class="ml-2"></b-icon>
                    </div>
                  </div>
                </router-link>
                <div class="card-body">
                  <div class="product-category-tag">{{ product.category }}</div>
                  <router-link :to="`/product/${product.id}`" class="product-title">{{ product.name }}</router-link>
                  <div class="product-price">
                    <span class="current-price">Rs. {{ product.price.toLocaleString() }}</span>
                  </div>
                  <div class="rating-wrapper" v-if="product.rating">
                    <div class="stars">
                      <b-icon icon="star-fill" v-for="i in Math.floor(product.rating)" :key="'star-'+i"></b-icon>
                      <b-icon icon="star-half" v-if="product.rating % 1 >= 0.5"></b-icon>
                    </div>
                    <small class="rating-count" v-if="product.reviewCount">({{ product.reviewCount }})</small>
                  </div>
                  <div class="product-actions">
                    <b-button variant="primary" @click="addToCartWithNotification(product)" class="add-to-cart-btn" block>
                      <b-icon icon="cart-plus" class="mr-2"></b-icon> Add to Cart
                    </b-button>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  
  <!-- 加入购物车提示 -->
  <div class="position-fixed" style="bottom: 20px; right: 20px; z-index: 9999">
    <b-toast id="cart-toast" title="Added to Cart!" auto-hide-delay="6000" variant="success" solid>
      <template #toast-title>
        <div class="d-flex align-items-center">
          <b-icon icon="check-circle-fill" class="mr-2 toast-icon"></b-icon>
          <strong class="mr-auto">Added to Cart!</strong>
        </div>
      </template>
      <div class="d-flex align-items-center">
        <div v-if="lastAddedProduct" class="toast-product-image mr-2">
          <img :src="lastAddedProduct.image" :alt="lastAddedProduct.name">
        </div>
        <div>
          <div v-if="lastAddedProduct" class="toast-product-name">{{ lastAddedProduct.name }}</div>
          <div class="toast-message">Item successfully added to your cart</div>
          <router-link to="/cart" class="view-cart-link">View Cart <b-icon icon="arrow-right"></b-icon></router-link>
        </div>
      </div>
    </b-toast>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Products',
  data() {
    return {
      selectedCategories: [],
      priceRange: {
        min: '',
        max: ''
      },
      searchQuery: '',
      sortBy: 'price-high',
      currentPage: 1,
      itemsPerPage: 12,
      lastAddedProduct: null,
      sortOptions: [
        { value: 'price-low', text: 'Price (Low to High)' },
        { value: 'price-high', text: 'Price (High to Low)' },
        { value: 'name-asc', text: 'Name (A to Z)' },
        { value: 'name-desc', text: 'Name (Z to A)' }
      ]
    }
  },
  computed: {
    ...mapState(['products']),
    categories() {
      // Get unique categories from products
      const uniqueCategories = [...new Set(this.products.map(product => product.category))]
      return uniqueCategories.sort()
    },
    filteredProducts() {
      let result = [...this.products]

      // Apply category filter
      if (this.selectedCategories.length > 0) {
        result = result.filter(product =>
          this.selectedCategories.includes(product.category)
        )
      }

      // Apply price filter
      if (this.priceRange.min) {
        result = result.filter(product =>
          product.price >= Number(this.priceRange.min)
        )
      }
      if (this.priceRange.max) {
        result = result.filter(product =>
          product.price <= Number(this.priceRange.max)
        )
      }

      // Apply search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        )
      }

      // Apply sorting
      switch(this.sortBy) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          result.sort((a, b) => b.price - a.price)
          break
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name))
          break
      }

      return result
    },
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredProducts.slice(startIndex, endIndex)
    }
  },
  methods: {
    ...mapActions(['addToCart', 'fetchProducts']),
    getCategoryCount(category) {
      // 确保products存在并且是数组
      if (!this.products || !Array.isArray(this.products)) {
        return 0;
      }
      return this.products.filter(product => product.category === category).length;
    },
    applyFilters() {
      // Reset to first page when filters change
      this.currentPage = 1
    },
    resetFilters() {
      this.selectedCategories = []
      this.priceRange.min = ''
      this.priceRange.max = ''
      this.searchQuery = ''
      this.sortBy = 'price-low'
      this.currentPage = 1
    },
    
    addToCartWithNotification(product) {
      // 添加商品到购物车
      this.addToCart(product)
      
      // 保存最后添加的商品用于显示
      this.lastAddedProduct = product
      
      // 显示提示
      this.$bvToast.show('cart-toast')
      
      // 播放添加到购物车的动画效果
      const productCards = document.querySelectorAll('.product-card')
      productCards.forEach(card => {
        if (card.dataset.productId == product.id) {
          card.classList.add('added-to-cart-animation')
          setTimeout(() => {
            card.classList.remove('added-to-cart-animation')
          }, 700)
        }
      })
    }
  },
  created() {
    // Apply category filter from URL query if exists
    const categoryParam = this.$route.query.category
    if (categoryParam) {
      this.selectedCategories = [categoryParam]
    }

    // Load products if not already loaded
    if (this.products.length === 0) {
      this.fetchProducts()
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

.filters-sidebar {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, #1a9f6c, #f77f00);
  }
  
  .sidebar-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid rgba(26, 159, 108, 0.1);
    
    .filter-icon {
      color: #1a9f6c;
      font-size: 1.25rem;
      margin-right: 0.75rem;
    }
    
    h3 {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
      color: #333;
    }
  }
  
  .filter-section {
    margin-bottom: 1.5rem;
    
    .filter-header {
      font-size: 1rem;
      font-weight: 600;
      color: #1a9f6c;
      margin-bottom: 0.5rem;
    }
    
    .filter-decoration {
      height: 3px;
      width: 40px;
      background: linear-gradient(90deg, #f77f00, #fcbf49);
      margin-bottom: 1rem;
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
  
  .custom-category-checkboxes {
    margin-top: 0.75rem;
    
    .category-checkbox-item {
      margin-bottom: 0.75rem;
      position: relative;
      transition: all 0.2s ease;
      padding-left: 0;
      
      &:hover {
        transform: translateX(3px);
      }
      
      .custom-control-label {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        padding: 0.25rem 0;
        font-size: 0.95rem;
        cursor: pointer;
        
        &::before {
          background-color: rgba(26, 159, 108, 0.1);
          border-color: rgba(26, 159, 108, 0.3);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 0 0.2rem rgba(26, 159, 108, 0.05);
        }
        
        &::after {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='20 6 9 17 4 12'%3e%3c/polyline%3e%3c/svg%3e");
          transition: transform 0.2s ease-in-out;
        }
      }
      
      .checkbox-label {
        flex-grow: 1;
        font-weight: 500;
        color: #444;
        transition: all 0.2s ease;
      }
      
      .category-item-count {
        font-size: 0.8rem;
        color: #999;
        font-weight: 400;
        padding: 0.15rem 0.5rem;
        background-color: #f5f5f5;
        border-radius: 10px;
        transition: all 0.2s ease;
        margin-left: 0.5rem;
      }
    }
    
    .custom-control-input:checked ~ .custom-control-label {
      .checkbox-label {
        color: #1a9f6c;
        font-weight: 600;
      }
      
      .category-item-count {
        background-color: rgba(26, 159, 108, 0.1);
        color: #1a9f6c;
      }
      
      &::before {
        background: linear-gradient(135deg, #1a9f6c 0%, #f77f00 100%);
        border-color: #1a9f6c;
        box-shadow: 0 0 0 0.2rem rgba(26, 159, 108, 0.15);
      }
      
      &::after {
        transform: scale(1.1);
      }
    }
  }
  
  // Price range input styling
  .form-control {
    border-radius: 8px;
    border-color: rgba(26, 159, 108, 0.2);
    padding: 0.6rem;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: #1a9f6c;
      box-shadow: 0 0 0 0.2rem rgba(26, 159, 108, 0.1);
    }
    
    &::placeholder {
      color: #aaa;
    }
  }
  
  .apply-btn {
    background-color: #1a9f6c;
    border-color: #1a9f6c;
    font-weight: 600;
    border-radius: 8px;
    padding: 0.6rem;
    transition: all 0.3s ease;
    box-shadow: 0 3px 10px rgba(26, 159, 108, 0.2);
    
    &:hover {
      background-color: #158f5f;
      border-color: #158f5f;
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(26, 159, 108, 0.3);
    }
  }
  .reset-btn {
    font-weight: 500;
    border-radius: 8px;
    border-color: #ddd;
    color: #666;
    padding: 0.6rem;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #f5f5f5;
      transform: translateY(-2px);
      box-shadow: 0 3px 8px rgba(0,0,0,0.05);
    }
  }
  
  .form-check {
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  // 全局自定义复选框样式
  .b-form-checkbox.custom-checkbox, .custom-checkbox {
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
    position: relative;
    
    .custom-control-input:checked ~ .custom-control-label::before {
      background: linear-gradient(135deg, #1a9f6c 0%, #f77f00 100%);
      border-color: #1a9f6c;
    }
    
    .custom-control-input:focus ~ .custom-control-label::before {
      box-shadow: 0 0 0 0.2rem rgba(26, 159, 108, 0.15);
    }
    
    .custom-control-label::before {
      width: 1.25rem;
      height: 1.25rem;
      left: -1.5rem;
      top: 0.15rem;
      border-radius: 4px;
      border: 2px solid rgba(26, 159, 108, 0.3);
      background-color: rgba(26, 159, 108, 0.05);
      transition: all 0.3s ease;
    }
    
    .custom-control-label::after {
      width: 1.25rem;
      height: 1.25rem;
      left: -1.5rem;
      top: 0.15rem;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='20 6 9 17 4 12'%3e%3c/polyline%3e%3c/svg%3e");
      background-size: 65%;
      transition: transform 0.2s ease-in-out;
    }
    
    .custom-control-input:checked ~ .custom-control-label::after {
      transform: scale(1.1);
    }
    
    &:hover .custom-control-label::before {
      border-color: #1a9f6c;
      box-shadow: 0 0 0 0.15rem rgba(26, 159, 108, 0.1);
    }
  }
  
  // 适配Bootstrap-Vue特定的选择器
  .b-form-checkbox.form-check {
    &.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
      background: linear-gradient(135deg, #1a9f6c 0%, #f77f00 100%) !important;
      border-color: #1a9f6c !important;
    }
  }
}

.products-controls {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.25rem;
  margin-bottom: 2rem;
  
  .search-wrapper {
    position: relative;
    
    .search-input {
      padding-left: 2.5rem;
      border-radius: 30px;
      border-color: var(--teal-light);
      transition: all 0.3s ease;
      
      &:focus {
        box-shadow: 0 0 0 0.2rem rgba(var(--teal-base-rgb), 0.25);
        border-color: var(--teal-base);
      }
      
      &::placeholder {
        color: #aaa;
        font-style: italic;
      }
    }
    
    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--teal-base);
    }
  }
  
  .sort-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--teal-lightest);
    border-radius: 30px;
    padding: 0.1rem 0.5rem 0.1rem 1rem;
    
    .sort-select {
      border: none;
      background: transparent;
      padding-left: 0.5rem;
      font-weight: 500;
      color: var(--teal-dark);
      width: auto;
      
      &:focus {
        box-shadow: none;
        outline: none;
      }
    }
    
    .sort-icon {
      color: var(--accent-color);
    }
  }
}

// 产品卡片样式
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
    
    .hover-overlay {
      opacity: 1;
    }
  }
  
  .product-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background-color: var(--teal-base);
    color: white;
    font-weight: 600;
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    z-index: 2;
    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    
    &.sale {
      background-color: var(--accent-color);
      left: auto;
      right: 15px;
    }
  }
  
  .product-img-wrapper {
    position: relative;
    overflow: hidden;
    
    .card-img-top {
      height: 220px; // 固定图片高度
      object-fit: contain; // 保持图片比例
      padding: 1.5rem;
      background: linear-gradient(to bottom, var(--teal-lightest) 0%, #ffffff 100%);
      transition: all 0.5s ease;
    }
    
    .hover-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(var(--teal-base-rgb), 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.4s ease;
      
      .overlay-content {
        color: white;
        font-weight: 600;
        background-color: rgba(0,0,0,0.25);
        padding: 0.6rem 1.2rem;
        border-radius: 30px;
        display: flex;
        align-items: center;
        transform: translateY(20px);
        transition: all 0.3s 0.1s ease;
      }
    }
    
    &:hover .overlay-content {
      transform: translateY(0);
    }
  }
  
  .card-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
  }
  
  .product-category-tag {
    display: inline-block;
    background-color: var(--teal-lightest);
    color: var(--teal-dark);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    margin-bottom: 0.7rem;
  }
  
  .product-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--teal-darkest);
    text-decoration: none;
    margin-bottom: 0.7rem;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    height: 2.8em;
    line-height: 1.4;
    transition: all 0.3s ease;
    
    &:hover {
      color: var(--accent-color);
    }
  }
  
  .product-price {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    
    .current-price {
      color: var(--accent-color);
    }
    
    .original-price {
      color: #999;
      text-decoration: line-through;
      font-size: 0.9rem;
      font-weight: 400;
      margin-right: 0.6rem;
    }
  }
  
  .rating-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    flex-grow: 1;
    
    .stars {
      color: #FFD700;
      display: flex;
      gap: 2px;
    }
    
    .rating-count {
      color: #777;
      margin-left: 5px;
    }
  }
  
  .product-actions {
    margin-top: auto;
    
    .add-to-cart-btn {
      border-radius: 30px;
      padding: 0.6rem;
      font-weight: 600;
      transition: all 0.3s ease;
      background-color: var(--teal-base);
      border-color: var(--teal-base);
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
    }
  }
}

// 购物车提示样式
.toast-icon {
  color: #1a9f6c;
  font-size: 1.25rem;
}

.toast-product-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(26, 159, 108, 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.toast-product-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.toast-message {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.view-cart-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1a9f6c;
  text-decoration: none;
  
  &:hover {
    color: #f77f00;
    text-decoration: none;
  }
  
  .b-icon {
    transition: transform 0.3s ease;
  }
  
  &:hover .b-icon {
    transform: translateX(3px);
  }
}

.b-toast-success {
  .toast {
    background-color: white !important;
    border: none !important;
    border-left: 4px solid #1a9f6c !important;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    
    .toast-header {
      background-color: transparent !important;
      border-bottom: 1px solid rgba(26, 159, 108, 0.1) !important;
      color: #1a9f6c !important;
    }
    
    .toast-body {
      padding: 0.75rem !important;
    }
  }
}

.added-to-cart-animation {
  animation: addToCartPulse 0.7s ease;
}

@keyframes addToCartPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 10px 25px rgba(26, 159, 108, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }
}

// 对不同屏幕尺寸调整卡片尺寸
@media (max-width: 767.98px) {
  .product-card {
    .card-img-top {
      height: 180px;
    }
    
    .product-title {
      font-size: 0.9rem;
    }
    
    .product-price {
      font-size: 1.1rem;
    }
  }
}
</style>
