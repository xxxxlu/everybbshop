<template>
  <div id="app">
    <header>
      <b-navbar toggleable="lg" type="light" variant="teal" class="navbar-animated">
        <b-container>
          <b-navbar-brand to="/" class="brand-animated">
            <div class="logo-container">
              <span class="text-accent">every</span><span class="text-teal-dark">bb</span><span class="text-accent">shop</span>
              <div class="brand-tagline">Delicious Food Selections</div>
            </div>
          </b-navbar-brand>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="mr-auto">
              <b-nav-item to="/" exact class="nav-item-animated">
                <b-icon icon="house" class="nav-icon"></b-icon> Home
              </b-nav-item>
              <b-nav-item to="/products" class="nav-item-animated">
                <b-icon icon="egg-fried" class="nav-icon"></b-icon> Food Menu
              </b-nav-item>
              <b-nav-item to="/contact" class="nav-item-animated">
                <b-icon icon="chat" class="nav-icon"></b-icon> Contact
              </b-nav-item>
            </b-navbar-nav>
            
            <b-navbar-nav class="ml-auto">
              <b-nav-item to="/cart" class="cart-nav-item nav-item-animated">
                <span class="d-flex align-items-center">
                  <b-icon icon="cart" class="mr-1 cart-icon-animated"></b-icon> Cart
                  <b-badge v-if="cartItemCount > 0" variant="accent" pill class="ml-1 badge-bounce">{{ cartItemCount }}</b-badge>
                </span>
              </b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </b-container>
        <div class="header-decoration"></div>
      </b-navbar>
    </header>

    <main>
      <router-view/>
    </main>

    <footer class="footer bg-teal-light py-5 mt-auto">
      <div class="container">
        <div class="footer-content">
          <div class="row">
            <div class="col-md-4 mb-4 mb-md-0 footer-col">
              <div class="footer-logo mb-3">
                <span class="text-accent">every</span><span class="text-teal-dark">bb</span><span class="text-accent">shop</span>
              </div>
              <p class="footer-text">We source the freshest ingredients from local farms and global suppliers to bring you the most delicious culinary experiences at affordable prices.</p>
              <div class="social-icons mt-3">
                <a href="#" class="social-icon"><b-icon icon="facebook"></b-icon></a>
                <a href="#" class="social-icon"><b-icon icon="instagram"></b-icon></a>
                <a href="#" class="social-icon"><b-icon icon="twitter"></b-icon></a>
                <a href="#" class="social-icon"><b-icon icon="pinterest"></b-icon></a>
              </div>
            </div>
            <div class="col-md-2 mb-4 mb-md-0 footer-col">
              <h5 class="footer-heading">Quick Links</h5>
              <ul class="footer-links">
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/products">Products</router-link></li>
                <li><router-link to="/cart">My Cart</router-link></li>
                <li><router-link to="/contact">Contact Us</router-link></li>
              </ul>
            </div>
            <div class="col-md-3 mb-4 mb-md-0 footer-col">
              <h5 class="footer-heading">Categories</h5>
              <ul class="footer-links">
                <li><router-link to="/products?category=Fresh Produce">Fresh Produce</router-link></li>
                <li><router-link to="/products?category=Baked Goods">Baked Goods</router-link></li>
                <li><router-link to="/products?category=Prepared Foods">Prepared Foods</router-link></li>
                <li><router-link to="/products?category=Desserts">Desserts</router-link></li>
              </ul>
            </div>
            <div class="col-md-3 footer-col">
              <h5 class="footer-heading">Contact Us</h5>
              <div class="contact-item">
                <b-icon icon="geo-alt" class="contact-icon"></b-icon>
                <span>everybbshop Food Street, Karachi, Pakistan</span>
              </div>
              <div class="contact-item">
                <b-icon icon="envelope" class="contact-icon"></b-icon>
                <span>everybbshop@everybbshop.fun</span>
              </div>
              <div class="newsletter mt-3">
                <div class="input-group">
                  <input type="email" class="form-control" placeholder="Your email for deals">
                  <div class="input-group-append">
                    <button class="btn btn-primary" type="button">Join</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom text-center text-teal-dark mt-4 pt-4 border-top">
          <p class="mb-0">&copy; Copyright © {{ new Date().getFullYear() }} | Powered by Data Network Solutions (SMC-Private) Limited.</p>
          <div class="payment-icons mt-2">
            <img src="./assets/easypaisa.png" alt="Easypaisa" height="30">
            <img src="./assets/jazzcash.png" alt="JazzCash" height="30">
          </div>
        </div>
      </div>
      <div class="footer-wave-container">
        <div class="footer-wave"></div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['cartItemCount'])
  },
  methods: {
    ...mapActions(['initCart'])
  },
  created() {
    // 确保应用启动时加载购物车数据
    this.initCart()
  }
}
</script>

<style>
/* Lighter green color scheme variables */
:root {
  --teal-darkest: #2e7d32;
  --teal-darker: #43a047;
  --teal-dark: #66bb6a;
  --teal-base: #81c784;
  --teal-light: #a5d6a7;
  --teal-lighter: #c8e6c9;
  --teal-lightest: #e8f5e9;
  --accent-color: #ff7043;
  --accent-dark: #e64a19;
}

/* Bootstrap component overrides */
.btn-primary {
  background-color: var(--teal-base) !important;
  border-color: var(--teal-dark) !important;
  transition: all 0.3s ease-in-out !important;
}

.btn-primary:hover {
  background-color: var(--teal-dark) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-outline-primary {
  color: var(--teal-base) !important;
  border-color: var(--teal-base) !important;
}

.btn-outline-primary:hover {
  background-color: var(--teal-base) !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.badge-primary {
  background-color: var(--teal-base) !important;
}

.badge-accent {
  background-color: var(--accent-color) !important;
  color: white !important;
}

.bg-teal {
  background-color: var(--teal-base) !important;
  color: white !important;
}

.bg-teal-light {
  background-color: var(--teal-lighter) !important;
}

.text-teal {
  color: var(--teal-base) !important;
}

.text-teal-dark {
  color: var(--teal-darkest) !important;
}

.text-accent {
  color: var(--accent-color) !important;
}

/* Navbar styling */
.navbar-teal {
  background-color: var(--teal-base) !important;
}

.navbar-animated {
  background-color: var(--teal-base);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.navbar-animated:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.brand-animated {
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.6rem;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-animated:hover {
  transform: scale(1.05);
}

.logo-container {
  position: relative;
  padding: 5px 0;
  
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 5px;
    height: 25px;
    background: var(--accent-color);
    border-radius: 3px;
    animation: pulse 2s infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 5px;
    height: 25px;
    background: var(--teal-base);
    border-radius: 3px;
    animation: pulse 2s infinite 0.5s;
  }
}

.brand-tagline {
  font-size: 0.8rem;
  letter-spacing: 1px;
  opacity: 0.8;
  font-weight: 400;
  color: var(--teal-darkest);
  margin-top: 2px;
}

.nav-item-animated .nav-link {
  position: relative;
  transition: all 0.3s ease;
}

.nav-item-animated .nav-link:before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--accent-color);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-item-animated .nav-link:hover:before {
  width: 80%;
}

.cart-nav-item {
  font-weight: 600;
}

.cart-icon-animated {
  transition: all 0.3s ease;
}

.cart-nav-item:hover .cart-icon-animated {
  transform: translateY(-2px) scale(1.2);
  color: var(--accent-color);
}

.badge-bounce {
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* Main app styling */
#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  position: relative;
  overflow-x: hidden;
}

main {
  flex: 1;
  z-index: 1;
  position: relative;
}

/* Card animations */
.card {
  transition: all 0.3s ease-in-out;
  border-radius: 10px;
  overflow: hidden;
  border: none;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

/* Food theme elements */
.food-icon {
  color: var(--accent-color);
  transition: all 0.3s ease;
}

.card:hover .food-icon {
  transform: rotate(20deg) scale(1.2);
}

/* Header styling */
.header-decoration {
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 10px;
  background-image: linear-gradient(135deg, var(--teal-light) 25%, transparent 25%),
                   linear-gradient(225deg, var(--teal-light) 25%, transparent 25%),
                   linear-gradient(45deg, var(--teal-light) 25%, transparent 25%),
                   linear-gradient(315deg, var(--teal-light) 25%, transparent 25%);
  background-position: 10px 0, 10px 0, 0 0, 0 0;
  background-size: 20px 20px;
  background-repeat: repeat;
  z-index: 10;
}

.nav-icon {
  margin-right: 5px;
  transition: all 0.3s ease;
}

.nav-item-animated:hover .nav-icon {
  transform: translateY(-3px);
  color: var(--accent-color);
}

.header-search {
  position: relative;
  
  .form-control {
    border-radius: 20px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid var(--teal-lighter);
    transition: all 0.3s ease;
    box-shadow: none;
    
    &:focus {
      border-color: var(--teal-light);
      box-shadow: 0 0 0 0.2rem rgba(129, 199, 132, 0.25);
    }
  }
  
  .btn {
    border-radius: 0 20px 20px 0;
    transition: all 0.3s ease;
  }
}

/* Footer styling */
.footer {
  position: relative;
  background: linear-gradient(to bottom, var(--teal-lightest), var(--teal-lighter));
  overflow: hidden;
}

.footer-wave-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
}

.footer-wave {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 60px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 1200 120' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'><path d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' fill='%23e8f5e9' opacity='.25'/><path d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' fill='%23e8f5e9' opacity='.5'/><path d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='%23e8f5e9'/></svg>");
    background-size: cover;
    background-repeat: no-repeat;
    height: 60px;
    z-index: 1;
  }
}

.footer-col {
  position: relative;
  z-index: 2;
}

.footer-logo {
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: 0.5px;
  animation: float 6s ease-in-out infinite;
}

.footer-heading {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--teal-darkest);
  margin-bottom: 1.2rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 30px;
    height: 3px;
    background: var(--accent-color);
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    width: 50px;
  }
}

.footer-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 0.8rem;
    
    a {
      color: #555;
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
      display: inline-block;
      padding-left: 15px;
      
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--teal-light);
        transition: all 0.3s ease;
      }
      
      &:hover {
        color: var(--teal-dark);
        padding-left: 20px;
        
        &:before {
          background: var(--accent-color);
        }
      }
    }
  }
}

.social-icons {
  display: flex;
  gap: 10px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  color: var(--teal-dark);
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 3px 5px rgba(0,0,0,0.1);
  
  &:hover {
    background: var(--accent-color);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0,0,0,0.15);
  }
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #555;
  
  .contact-icon {
    color: var(--teal-dark);
    margin-right: 10px;
    transition: all 0.3s ease;
  }
  
  &:hover .contact-icon {
    color: var(--accent-color);
    transform: scale(1.2);
  }
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
  
  img {
    transition: all 0.3s ease;
    opacity: 0.8;
    
    &:hover {
      transform: translateY(-3px);
      opacity: 1;
    }
  }
}
</style>
