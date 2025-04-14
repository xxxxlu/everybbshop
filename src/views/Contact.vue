<template>
  <div class="contact-page">
    <div class="page-header py-5">
      <b-container>
        <div class="header-content text-center">
          <h1 class="page-title">Contact Us</h1>
          <div class="title-decoration"></div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb justify-content-center">
              <li class="breadcrumb-item">
                <router-link to="/"><b-icon icon="house" class="mr-1"></b-icon> Home</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <b-icon icon="chat-dots" class="mr-1"></b-icon> Contact
              </li>
            </ol>
          </nav>
        </div>
      </b-container>
      <div class="header-wave"></div>
    </div>

    <b-container class="py-5">
      <b-row>
        <!-- Contact Information -->
        <b-col lg="4" class="mb-4 mb-lg-0">
          <div class="contact-info">
            <div class="section-header">
              <h2 class="section-title">Get in Touch</h2>
              <div class="title-decoration"></div>
            </div>
            <p class="mb-4">
              Have questions about our products, services, or need assistance?
              We're here to help! Contact us using any of the methods below.
            </p>

            <div class="contact-method d-flex align-items-start mb-4">
              <div class="contact-icon mr-3">
                <b-icon icon="envelope" font-scale="1.5"></b-icon>
              </div>
              <div class="contact-details">
                <h5>Email Us</h5>
                <p class="text-muted mb-0">
                  publlshop@publlshop.com<br>
                </p>
              </div>
            </div>

            <div class="contact-method d-flex align-items-start">
              <div class="contact-icon mr-3">
                <b-icon icon="clock" font-scale="1.5"></b-icon>
              </div>
              <div class="contact-details">
                <h5>Business Hours</h5>
                <p class="text-muted mb-0">
                  Monday - Friday: 9am - 6pm<br>
                  Saturday: 10am - 4pm<br>
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div class="social-icons mt-4">
              <h5>Follow Us</h5>
              <div class="d-flex social-links">
                <a href="#" class="social-icon">
                  <b-icon icon="facebook" font-scale="1.2"></b-icon>
                </a>
                <a href="#" class="social-icon">
                  <b-icon icon="instagram" font-scale="1.2"></b-icon>
                </a>
                <a href="#" class="social-icon">
                  <b-icon icon="twitter" font-scale="1.2"></b-icon>
                </a>
                <a href="#" class="social-icon">
                  <b-icon icon="whatsapp" font-scale="1.2"></b-icon>
                </a>
              </div>
            </div>
          </div>
        </b-col>

        <!-- Contact Form -->
        <b-col lg="8">
          <div class="contact-form-container">
            <div class="section-header">
              <h2 class="section-title">Send Us a Message</h2>
              <div class="title-decoration"></div>
            </div>
            <p class="mb-4">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <b-form @submit.prevent="submitForm">
              <b-row>
                <b-col md="6">
                  <b-form-group label="Your Name" label-for="name">
                    <b-form-input
                      id="name"
                      v-model="form.name"
                      placeholder="Enter your name"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Your Email" label-for="email">
                    <b-form-input
                      id="email"
                      v-model="form.email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>

              <b-form-group label="Phone Number" label-for="phone">
                <b-form-input
                  id="phone"
                  v-model="form.phone"
                  placeholder="Enter your phone number"
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Subject" label-for="subject">
                <b-form-input
                  id="subject"
                  v-model="form.subject"
                  placeholder="What is this regarding?"
                  required
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Message" label-for="message">
                <b-form-textarea
                  id="message"
                  v-model="form.message"
                  placeholder="Enter your message here..."
                  rows="6"
                  required
                ></b-form-textarea>
              </b-form-group>

              <div class="text-right">
                <b-button type="submit" variant="accent" size="lg" class="send-btn" :disabled="submitting">
                  <b-spinner small v-if="submitting" class="mr-2"></b-spinner>
                  <b-icon icon="send" class="mr-2" v-if="!submitting"></b-icon>
                  {{ submitting ? 'Sending...' : 'Send Message' }}
                </b-button>
              </div>
            </b-form>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <!-- Map Section -->
    <!-- <div class="map-section py-5">
      <b-container>
        <div class="section-header text-center">
          <h2 class="section-title">Find Us</h2>
          <div class="title-decoration mx-auto"></div>
        </div>
        <div class="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.5553921555834!2d74.35043937558968!3d31.51532674774296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391905f7f66a7607%3A0xaef8bc4282c7b1!2sGulberg%20III%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1712354558493!5m2!1sen!2s"
            width="100%"
            height="400"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </b-container>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      submitting: false
    }
  },
  methods: {
    submitForm() {
      // In a real app, this would submit to an API endpoint
      // For this demo, we'll just simulate a submission

      this.submitting = true

      // Simulate API call
      setTimeout(() => {
        this.submitting = false

        // Show success message
        this.$bvToast.toast('Your message has been sent successfully. We\'ll get back to you soon!', {
          title: 'Message Sent',
          variant: 'success',
          toaster: 'b-toaster-bottom-right',
          autoHideDelay: 5000
        })

        // Reset form
        this.form = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        }
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
.contact-page {
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
    font-size: 2rem;
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

.contact-info, .contact-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  }

  p {
    color: #666;
    line-height: 1.6;
  }
}

.contact-method {
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 1rem;
  }
  
  .contact-icon {
    color: #1a9f6c;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(26, 159, 108, 0.1);
    border-radius: 50%;
    margin-right: 1rem;
  }

  .contact-details {
    h5 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1a9f6c;
      margin-bottom: 0.5rem;
    }
    
    p {
      margin-bottom: 0;
      line-height: 1.5;
    }
  }
}

.social-icons {
  margin-top: 2rem;
  
  h5 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a9f6c;
    margin-bottom: 1rem;
  }

  .social-links {
    display: flex;
    gap: 0.75rem;
  }
  
  .social-icon {
    width: 40px;
    height: 40px;
    background: rgba(26, 159, 108, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1a9f6c;
    transition: all 0.3s ease;

    &:hover {
      background: #f77f00;
      color: white;
      transform: translateY(-3px);
    }
  }
}

// Form styling
.contact-form-container {
  .form-group label {
    font-weight: 600;
    color: #1a9f6c;
    margin-bottom: 0.5rem;
  }
  
  .form-control {
    border-radius: 8px;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    
    &:focus {
      border-color: #1a9f6c;
      box-shadow: 0 0 0 0.2rem rgba(26, 159, 108, 0.15);
    }
  }
  
  .send-btn {
    background-color: #f77f00;
    border-color: #f77f00;
    color: white;
    border-radius: 8px;
    padding: 0.75rem 2rem;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      background-color: #e67500;
      border-color: #e67500;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(247, 127, 0, 0.3);
    }
    
    &:focus {
      box-shadow: 0 0 0 0.25rem rgba(247, 127, 0, 0.25);
    }
    
    &:disabled {
      background-color: #f7ae69;
      border-color: #f7ae69;
    }
  }
}

.map-section {
  position: relative;
  padding: 4rem 0 5rem;
  background-color: rgba(26, 159, 108, 0.05);
  margin-top: 3rem;
  
  &:before {
    content: '';
    position: absolute;
    top: -40px;
    left: 0;
    width: 100%;
    height: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='rgba(26, 159, 108, 0.05)'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='rgba(26, 159, 108, 0.05)'%3E%3C/path%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='rgba(26, 159, 108, 0.05)'%3E%3C/path%3E%3C/svg%3E");
    background-size: cover;
    transform: rotate(180deg);
  }
  
  .section-header {
    margin-bottom: 2.5rem;
  }
}

.map-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
}
</style>
