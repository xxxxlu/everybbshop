<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <b-container>
        <b-row class="align-items-center">
          <b-col md="6" class="mb-4 mb-md-0">
            <div class="hero-content animate-fade-in">
              <h1 class="hero-title">
                <span class="text-accent">every</span><span class="text-teal-dark">bb</span><span class="text-accent">shop</span>
              </h1>
              <h2 class="hero-subtitle">Delicious Food Marketplace</h2>
              <p class="hero-text">
                Your one-stop food marketplace with fresh ingredients and delicious meals. Quality culinary experiences at affordable prices delivered to your doorstep.
              </p>
              <b-button to="/products" variant="primary" size="lg" class="mt-3 pulse-button">Taste Now <b-icon icon="arrow-right" class="ml-2"></b-icon></b-button>
            </div>
          </b-col>
          <b-col md="6">
            <div class="hero-image-container animate-float">
              <b-img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Delicious Food" fluid rounded class="hero-image"></b-img>
              <div class="hero-image-badge">Top Quality Foods</div>
              <div class="food-icon-float food-icon-1"><b-icon icon="egg-fried" font-scale="2"></b-icon></div>
              <div class="food-icon-float food-icon-2"><b-icon icon="cup-hot" font-scale="2"></b-icon></div>
              <div class="food-icon-float food-icon-3"><b-icon icon="basket" font-scale="2"></b-icon></div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <!-- Categories Section -->
    <section class="categories py-5 bg-teal-lightest">
      <b-container>
        <div class="section-header">
          <h2 class="section-title text-teal-dark animate-title">Explore Food Categories</h2>
          <div class="section-title-decoration"></div>
          <p class="section-subtitle text-center mb-4">Find your favorite food types and discover new culinary delights</p>
        </div>
        <b-row>
          <b-col v-for="category in categories" :key="category.id" cols="6" md="4" lg="3" class="mb-4">
            <router-link :to="`/products?category=${category.name}`" class="category-card">
              <div class="card product-card h-100 category-animate">
                <div class="category-img">
                  <b-img :src="category.image" :alt="category.name" fluid></b-img>
                  <div class="category-overlay">
                    <b-icon icon="search" font-scale="1.5" class="category-icon"></b-icon>
                  </div>
                </div>
                <div class="card-body text-center">
                  <h5 class="category-name">{{ category.name }}</h5>
                  <small class="text-muted">Explore delicious options</small>
                </div>
              </div>
            </router-link>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <!-- Featured Products -->
    <section class="featured-products py-5">
      <b-container>
        <div class="section-header">
          <h2 class="section-title text-teal-dark animate-title">Featured Delicacies</h2>
          <div class="section-title-decoration"></div>
          <p class="section-subtitle text-center mb-4">Our most loved and highly rated food items</p>
        </div>
        
        <!-- 加载中状态 -->
        <div v-if="isLoading" class="text-center py-5">
          <b-spinner variant="primary" label="Loading..."></b-spinner>
          <p class="mt-3 text-muted">Loading delicious items for you...</p>
        </div>
        
        <!-- 加载失败状态 -->
        <div v-else-if="loadError" class="text-center py-5">
          <b-icon icon="exclamation-circle" variant="danger" font-scale="3"></b-icon>
          <p class="mt-3 text-danger">{{ loadError }}</p>
          <b-button variant="outline-primary" @click="retryLoadProducts" class="mt-2">
            <b-icon icon="arrow-clockwise" class="mr-2"></b-icon> Retry
          </b-button>
        </div>
        
        <!-- 无数据状态 -->
        <div v-else-if="featuredProducts.length === 0" class="text-center py-5">
          <b-icon icon="basket" variant="secondary" font-scale="3"></b-icon>
          <p class="mt-3 text-muted">No featured products available at the moment.</p>
        </div>
        
        <!-- 产品数据展示 -->
        <b-row v-else>
          <b-col v-for="product in featuredProducts" :key="product.id" cols="6" md="4" lg="3" class="mb-4">
            <div class="card product-card h-100 product-animate">
              <div class="product-badge" v-if="product.id % 3 === 0">BEST SELLER</div>
              <div class="product-badge sale" v-else-if="product.id % 4 === 0">SALE</div>
              <!-- 这里将router-link改为div，使用@click来处理导航，确保能正确响应 -->
              <div class="product-img-container" @click="goToProduct(product.id)">
                <!-- 添加图片错误处理 -->
                <b-img 
                  :src="product.image" 
                  :alt="product.name" 
                  fluid 
                  class="card-img-top" 
                  @error="handleImageError($event, product)"
                ></b-img>
                <div class="product-overlay">
                  <span class="quick-view">Quick View</span>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <div class="product-rating mb-2">
                  <b-icon icon="star-fill" class="rating-star" v-for="n in Math.floor(3 + (product.id % 3))" :key="n"></b-icon>
                  <b-icon icon="star" class="rating-star-empty" v-for="n in (5 - Math.floor(3 + (product.id % 3)))" :key="`empty-${n}`"></b-icon>
                  <small class="text-muted ml-1">({{ 10 + (product.id * 3) % 90 }})</small>
                </div>
                <router-link :to="`/product/${product.id}`" class="product-title">{{ product.name }}</router-link>
                <div class="product-price">
                  <span class="current-price">Rs. {{ product.price.toLocaleString() }}</span>
                </div>
                <p class="product-category small text-muted flex-grow-1">{{ product.category }}</p>
                <div class="product-actions mt-auto">
                  <b-button variant="primary" @click="addToCart(product)" class="btn-add-to-cart">
                    <b-icon icon="cart-plus" class="mr-1"></b-icon> Add to Cart
                  </b-button>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
        <div class="text-center mt-4">
          <b-button to="/products" variant="outline-primary" size="lg" class="btn-view-all">
            Explore All Delicacies <b-icon icon="arrow-right" class="ml-2"></b-icon>
          </b-button>
        </div>
      </b-container>
    </section>

    <!-- Advantages Section -->
    <section class="advantages py-5 bg-teal-lightest">
      <b-container>
        <div class="section-header">
          <h2 class="section-title text-teal-dark animate-title">Why Food Lovers Choose <span class="text-accent">every</span><span class="text-teal-dark">bb</span><span class="text-accent">shop</span></h2>
          <div class="section-title-decoration"></div>
          <p class="section-subtitle text-center mb-5">We're committed to providing the best culinary experience</p>
        </div>
        <b-row>
          <b-col md="3" class="mb-4 mb-md-0">
            <div class="advantage-card text-center benefit-animate">
              <div class="advantage-icon food-icon">
                <b-icon icon="truck" font-scale="3"></b-icon>
              </div>
              <h4 class="mt-3">Fast Delivery</h4>
              <p>Food delivered fresh and hot to your doorstep</p>
            </div>
          </b-col>
          <b-col md="3" class="mb-4 mb-md-0">
            <div class="advantage-card text-center benefit-animate">
              <div class="advantage-icon food-icon">
                <b-icon icon="shield-check" font-scale="3"></b-icon>
              </div>
              <h4 class="mt-3">Premium Quality</h4>
              <p>Farm-fresh ingredients and gourmet selections</p>
            </div>
          </b-col>
          <b-col md="3" class="mb-4 mb-md-0">
            <div class="advantage-card text-center benefit-animate">
              <div class="advantage-icon food-icon">
                <b-icon icon="award" font-scale="3"></b-icon>
              </div>
              <h4 class="mt-3">Chef's Choice</h4>
              <p>Curated by professional chefs for ultimate taste</p>
            </div>
          </b-col>
          <b-col md="3">
            <div class="advantage-card text-center benefit-animate">
              <div class="advantage-icon food-icon">
                <b-icon icon="headset" font-scale="3"></b-icon>
              </div>
              <h4 class="mt-3">24/7 Support</h4>
              <p>Food experts ready to assist you anytime</p>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>
    
    <!-- Testimonials Section -->
    <section class="testimonials py-5">
      <b-container>
        <h2 class="section-title text-teal-dark animate-title">What Food Lovers Say</h2>
        <p class="section-subtitle text-center mb-5">Real experiences from our satisfied customers</p>
        <b-carousel
          id="testimonial-carousel"
          :interval="4000"
          controls
          :indicators="false"
          background="#f8f9fa"
          img-width="1024"
          img-height="480"
          class="testimonial-carousel"
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
          ref="testimonialCarousel"
        >
          <!-- 自定义指示器 -->
          <div class="custom-indicators">
            <span 
              v-for="(_, index) in 3" 
              :key="index"
              :class="['custom-indicator', { active: currentSlide === index }]"
              @click="goToSlide(index)"
            ></span>
          </div>
          <b-carousel-slide>
            <template #img>
              <div class="testimonial-content">
                <div class="testimonial-icon"><b-icon icon="chat-quote" font-scale="2"></b-icon></div>
                <p class="testimonial-text">"The food selection is amazing! Everything I've ordered has been fresh and delicious. The delivery is always on time too!"</p>
                <div class="testimonial-author">
                  <h5>Emma Wilson</h5>
                  <p class="text-muted">Food Enthusiast</p>
                </div>
              </div>
            </template>
          </b-carousel-slide>
          <b-carousel-slide>
            <template #img>
              <div class="testimonial-content">
                <div class="testimonial-icon"><b-icon icon="chat-quote" font-scale="2"></b-icon></div>
                <p class="testimonial-text">"I've tried many food delivery services, but this one stands out for quality and variety. Their customer service is exceptional!"</p>
                <div class="testimonial-author">
                  <h5>Michael Brown</h5>
                  <p class="text-muted">Regular Customer</p>
                </div>
              </div>
            </template>
          </b-carousel-slide>
          <b-carousel-slide>
            <template #img>
              <div class="testimonial-content">
                <div class="testimonial-icon"><b-icon icon="chat-quote" font-scale="2"></b-icon></div>
                <p class="testimonial-text">"From gourmet meals to everyday essentials, everything is top-notch. The chef-prepared meals have made my dinner parties a huge success!"</p>
                <div class="testimonial-author">
                  <h5>Sarah Johnson</h5>
                  <p class="text-muted">Home Chef</p>
                </div>
              </div>
            </template>
          </b-carousel-slide>
        </b-carousel>
      </b-container>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      categories: [
        { id: 1, name: 'Fresh Produce', image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
        { id: 2, name: 'Baked Goods', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
        { id: 3, name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
        { id: 4, name: 'Meat & Seafood', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
        { id: 5, name: 'Prepared Foods', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
        { id: 6, name: 'Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
        { id: 7, name: 'Beverages', image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
        { id: 8, name: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }
      ],
      isLoading: false,
      loadError: null,
      currentSlide: 0 // 添加当前轮播幻灯片索引
    }
  },
  computed: {
    ...mapState(['products']),
    featuredProducts() {
      // 确保products是数组，并且有数据
      if (!this.products || !Array.isArray(this.products) || this.products.length === 0) {
        console.log('无产品数据可展示');
        return [];
      }
      
      // 检查每个产品是否有必要的字段
      const validProducts = this.products.filter(p => p && p.id && p.name && p.price);
      console.log('有效产品数量:', validProducts.length);
      
      // 取前8个有效产品
      return validProducts.slice(0, 8);
    }
  },
  methods: {
    ...mapActions(['addToCart', 'fetchProducts']),
    
    // 在新方法中使用编程式导航
    goToProduct(productId) {
      console.log('Navigating to product:', productId);
      this.$router.push(`/product/${productId}`);
    },
    
    // 处理图片加载错误
    handleImageError(event, product) {
      console.error(`Image failed to load for product ${product.id}: ${product.name}`);
      // 设置替代图片
      event.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
    },
    
    retryLoadProducts() {
      this.loadProducts();
    },
    
    loadProducts() {
      this.isLoading = true;
      this.loadError = null;
      
      this.fetchProducts()
        .then((products) => {
          this.isLoading = false;
          // 验证数据是否正确加载，添加额外日志
          console.log('产品加载成功，总数:', products ? products.length : 0);
          console.log('当前展示特色产品数量:', this.featuredProducts.length);
        })
        .catch(error => {
          this.isLoading = false;
          this.loadError = 'Failed to load featured products. Please try again.';
          console.error('Error loading products:', error);
        });
    },
    
    // 轮播幻灯片控制方法
    onSlideStart() {
      // 幻灯片开始切换时的处理
    },
    
    onSlideEnd(slide) {
      // 更新当前幻灯片索引
      this.currentSlide = slide;
    },
    
    goToSlide(index) {
      // 点击指示器时切换到相应幻灯片
      this.$refs.testimonialCarousel.setSlide(index);
    },
    initScrollAnimations() {
      // Select all elements with animation classes
      const categoryItems = document.querySelectorAll('.category-animate');
      const productItems = document.querySelectorAll('.product-animate');
      const benefitItems = document.querySelectorAll('.benefit-animate');
      
      // 立即使所有产品卡片可见，而不用等待滚动
      productItems.forEach((item, index) => {
        item.style.opacity = '1';
        item.style.transform = 'none';
        item.style.transitionDelay = `${index * 0.1}s`;
      });
      
      // Create intersection observer for animations (仅用于其他元素)
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // If element is visible on screen
          if (entry.isIntersecting) {
            // Add animation with staggered delay based on index
            const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
            entry.target.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
            entry.target.style.opacity = '1';
            // Stop observing after animation is added
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 }); // Trigger when 10% of element is visible
      
      // Observe all animated elements
      categoryItems.forEach(item => observer.observe(item));
      productItems.forEach(item => observer.observe(item));
      benefitItems.forEach(item => observer.observe(item));
    }
  },
  mounted() {
    // 延迟初始化滚动动画，确保DOM已完全渲染和产品已加载
    setTimeout(() => {
      this.initScrollAnimations();
      // 强制所有产品卡片可见
      document.querySelectorAll('.product-animate').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 500);
  },
  created() {
    // 总是重新加载产品数据，以确保数据的新鲜和可用性
    this.loadProducts();
  }
}
</script>

<style lang="scss" scoped>
/* Section styling */
.section-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.section-title {
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-size: 2.2rem;
  display: inline-block;
  position: relative;
}

.section-title-decoration {
  width: 80px;
  height: 4px;
  background: var(--accent-color);
  margin: 0.8rem auto 1.5rem;
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

/* Hero Section */
.hero {
  padding: 5rem 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
  background-color: white;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2381c784' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
    z-index: 0;
  }
  
  &-title {
    font-size: 3.5rem;
    font-weight: 700;
    color: var(--teal-darkest);
    margin-bottom: 1rem;
    line-height: 1.2;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 60px;
      height: 4px;
      background: var(--accent-color);
      border-radius: 4px;
    }
  }
  
  &-subtitle {
    font-size: 1.8rem;
    font-weight: 500;
    color: var(--teal-dark);
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
  }
  
  &-text {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #666;
    margin-bottom: 2rem;
  }
  
  &-content {
    position: relative;
    z-index: 1;
  }
  
  &-image-container {
    position: relative;
    z-index: 1;
    
    .hero-image {
      box-shadow: var(--card-shadow);
      transform: translateY(0);
      transition: all 0.3s ease;
      border: 8px solid white;
    }
    
    .hero-image-badge {
      position: absolute;
      top: 20px;
      right: -10px;
      background: var(--accent-color);
      color: white;
      font-weight: 600;
      padding: 8px 15px;
      border-radius: 0 20px 20px 20px;
      font-size: 0.9rem;
      box-shadow: 0 5px 10px rgba(0,0,0,0.1);
      transform: rotate(5deg);
      z-index: 2;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -10px;
        width: 10px;
        height: 10px;
        background: #c62828; /* Darker version of #ff7043 */
        border-radius: 0 10px 0 0;
        z-index: -1;
      }
    }
  }
}

/* Categories Section */
.categories {
  .category-card {
    text-decoration: none;
    color: inherit;
    display: block;
    height: 100%;
  }

  .category-img {
    position: relative;
    overflow: hidden;
    border-radius: 12px;

    img {
      transition: all 0.5s ease;
      height: 180px;
      object-fit: cover;
      width: 100%;
    }

    .category-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.3s ease;
      border-radius: 12px;

      .category-icon {
        color: white;
        transform: scale(0.8);
        transition: all 0.3s ease;
      }
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30%;
      background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
      border-radius: 0 0 12px 12px;
    }
  }

  .category-name {
    margin-top: 0.5rem;
    font-weight: 600;
    color: var(--teal-darkest);
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--accent-color);
      transition: all 0.3s ease;
    }
  }

  .card:hover {
    .category-img img {
      transform: scale(1.1);
    }

    .category-overlay {
      opacity: 1;

      .category-icon {
        transform: scale(1);
      }
    }

    .category-name {
      color: var(--accent-color);
      
      &::after {
        width: 100%;
      }
    }
  }
}

.featured-products {
  padding: 5rem 0;
  
  .product-card {
    border-radius: 10px;
    transition: all 0.3s ease;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    position: relative;
    background: white;
    display: block;
    visibility: visible;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
    
    .product-badge {
      position: absolute;
      top: 15px;
      left: -5px;
      background-color: var(--teal-base);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 5px 15px 5px 10px;
      border-radius: 0 20px 20px 0;
      z-index: 2;
      box-shadow: 0 3px 6px rgba(0,0,0,0.1);
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: -5px;
        border-top: 5px solid #388e3c; /* Darker version of #81c784 */
        border-left: 5px solid transparent;
      }
      
      &.sale {
        background-color: var(--accent-color);
        
        &::before {
          border-top-color: #c62828; /* Darker version of #ff7043 */
        }
      }
    }
    
    .product-img-container {
      position: relative;
      overflow: hidden;
      display: block;
      
      .card-img-top {
        height: 200px;
        object-fit: cover;
        transition: all 0.5s ease;
        width: 100%;
      }
      
      .product-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.3s ease;
        
        .quick-view {
          background-color: white;
          color: var(--teal-darkest);
          padding: 8px 18px;
          border-radius: 25px;
          font-size: 0.85rem;
          font-weight: 600;
          transform: translateY(20px);
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          
          &:hover {
            background-color: var(--accent-color);
            color: white;
          }
        }
      }
      
      &:hover {
        .card-img-top {
          transform: scale(1.1);
        }
        
        .product-overlay {
          opacity: 1;
          
          .quick-view {
            transform: translateY(0);
          }
        }
      }
    }
    
    .card-body {
      padding: 1.25rem;
    }
    
    .product-title {
      font-weight: 600;
      color: var(--teal-darkest);
      margin-bottom: 0.7rem;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      position: relative;
      display: inline-block;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--accent-color);
        transition: all 0.3s ease;
      }
      
      &:hover {
        color: var(--accent-color);
        
        &::after {
          width: 100%;
        }
      }
    }
    
    .product-price {
      color: var(--teal-dark);
      font-weight: 700;
      margin-bottom: 0.8rem;
      font-size: 1.1rem;
      
      .product-original-price {
        text-decoration: line-through;
        opacity: 0.6;
        margin-right: 8px;
        font-size: 0.95rem;
      }
    }
    
    .product-rating {
      margin-bottom: 1.2rem;
      display: flex;
      align-items: center;
      
      .rating-star {
        color: #ffc107;
        margin-right: 2px;
      }
    }
    
    .btn-add-to-cart {
      border-radius: 25px;
      padding: 0.6rem 1.2rem;
      font-weight: 600;
      width: 100%;
      transition: all 0.3s ease;
      transform: translateY(0);
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      background-color: var(--teal-base);
      border-color: var(--teal-base);
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.15);
        background-color: var(--teal-dark);
        border-color: var(--teal-dark);
      }
      
      .b-icon {
        transition: all 0.3s ease;
      }
      
      &:hover .b-icon {
        transform: translateX(3px);
      }
    }
  }
  
  .btn-view-all {
    padding: 0.9rem 2.2rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    border-radius: 30px;
    transition: all 0.3s ease;
    border-color: var(--teal-base);
    color: var(--teal-dark);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      background-color: var(--teal-base);
      color: white;
      border-color: var(--teal-base);
    }
    
    .b-icon {
      transition: all 0.3s ease;
    }
    
    &:hover .b-icon {
      transform: translateX(5px);
    }
  }
}

/* Advantages Section */
.advantages {
  .advantage-card {
    padding: 2.5rem 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    height: 100%;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    z-index: 1;
    
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(to right, var(--accent-color), var(--teal-base));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.5s ease;
      z-index: -1;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
      z-index: -2;
    }
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
      
      &::before {
        transform: scaleX(1);
      }
      
      .advantage-icon {
        transform: scale(1.2);
        color: var(--accent-color);
      }
    }

    .advantage-icon {
      color: var(--teal-base);
      margin-bottom: 1.5rem;
      transition: all 0.5s ease;
      position: relative;
      display: inline-block;
      
      &::after {
        content: '';
        position: absolute;
        width: 50px;
        height: 50px;
        background: rgba(129, 199, 132, 0.1);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
      }
    }

    h4 {
      font-weight: 600;
      font-size: 1.3rem;
      margin-bottom: 0.8rem;
      color: var(--teal-darkest);
      position: relative;
      display: inline-block;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 30px;
        height: 2px;
        background: var(--teal-light);
        transition: all 0.3s ease;
      }
    }

    p {
      color: #666;
      margin-bottom: 0;
      line-height: 1.5;
    }
  }
}

/* Testimonials Section */
.testimonials {
  padding: 5rem 0;
  background-color: white;
  position: relative;
  overflow: hidden;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(178, 250, 180, 0.1);
    z-index: 0;
  }
  
  &::before {
    top: -50px;
    left: -50px;
  }
  
  &::after {
    bottom: -50px;
    right: -50px;
  }
  
  .testimonial-carousel {
    max-width: 800px;
    margin: 0 auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    z-index: 1;
    
    /* 自定义轮播指示器 */
    .custom-indicators {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      position: absolute;
      bottom: 15px;
      width: 100%;
      z-index: 10;
      
      .custom-indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: rgba(129, 199, 132, 0.3);
        margin: 0 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-block;
        
        &.active {
          background-color: var(--teal-base);
          transform: scale(1.2);
        }
      }
    }
    
    &::before {
      content: '"';
      position: absolute;
      top: 30px;
      left: 30px;
      font-size: 120px;
      line-height: 0;
      font-family: Georgia, serif;
      color: rgba(129, 199, 132, 0.1);
      z-index: 0;
    }
  }
  
  .testimonial-content {
    padding: 4rem 3rem;
    text-align: center;
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  
  .testimonial-icon {
    color: var(--accent-color);
    margin-bottom: 2rem;
    background: rgba(255, 112, 67, 0.1);
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .testimonial-text {
    font-size: 1.3rem;
    line-height: 1.8;
    font-style: italic;
    color: #555;
    margin-bottom: 2.5rem;
    max-width: 700px;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: linear-gradient(to right, var(--teal-light), var(--accent-color));
      border-radius: 3px;
    }
  }
  
  .testimonial-author {
    h5 {
      font-weight: 600;
      color: var(--teal-darkest);
      margin-bottom: 0.3rem;
      font-size: 1.1rem;
    }
    
    p {
      margin-bottom: 0;
      color: var(--teal-dark);
      font-size: 0.9rem;
    }
    
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 1rem;
      border: 3px solid white;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
  }
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 1s ease-in-out;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-title {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.2s;
}

.food-icon-float {
  position: absolute;
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  z-index: 2;
  
  &.food-icon-1 {
    top: 10%;
    right: 5%;
    animation: float 4s ease-in-out infinite;
  }
  
  &.food-icon-2 {
    bottom: 10%;
    right: 20%;
    animation: float 5s ease-in-out infinite 1s;
  }
  
  &.food-icon-3 {
    top: 50%;
    left: 5%;
    animation: float 6s ease-in-out infinite 0.5s;
  }
  
  .b-icon {
    color: var(--accent-color);
  }
}

.category-animate, /* 移除会导致卡片不可见的动画初始状态 */
.product-animate, .benefit-animate {
  opacity: 1; /* 改为1，确保卡片始终可见 */
  transform: none; /* 移除可能导致位移的变换 */
}

.pulse-button {
  animation: pulse 2s infinite;
}

/* Animation Keyframes */
@keyframes fadeIn {
  from { opacity: 0.5; } /* 减少不可见的程度 */
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { 
    opacity: 0.7; /* 减少不可见的程度 */
    transform: translateY(10px); /* 减少位移幅度 */
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(129, 199, 132, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(129, 199, 132, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(129, 199, 132, 0);
  }
}

/* Media Queries */
@media (max-width: 768px) {
  .hero {
    padding: 3rem 0;
    
    &-title {
      font-size: 2.2rem;
    }
    
    &-subtitle {
      font-size: 1.3rem;
    }
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .testimonial-text {
    font-size: 1rem;
  }
  
  /* 响应式调整自定义轮播指示器 */
  .testimonial-carousel .custom-indicators {
    bottom: 10px;
    
    .custom-indicator {
      width: 8px;
      height: 8px;
      margin: 0 3px;
    }
  }
}
</style>
