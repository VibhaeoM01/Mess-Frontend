import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer"> 
      <a 
        href="https://wa.me/917058461105" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="Chat with us on WhatsApp"
      >
        <img src="/assets/whatsapp.png" alt="WhatsApp" className="whatsapp-icon" />
      </a>

      <div className="footer-container">
        <div className="footer-section">
          <div className="brand">
            <h3>MessMaster</h3>
            <p>Revolutionizing mess management with smart technology and efficient solutions.</p>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="links-grid">
            <ScrollLink className="footer-link" to="home" smooth={true} duration={500}>
              Home
            </ScrollLink>
            <ScrollLink className="footer-link" to="features" smooth={true} duration={500}>
              Features
            </ScrollLink>
            <ScrollLink className="footer-link" to="Faqs" smooth={true} duration={500}>
              FAQs
            </ScrollLink>
            <ScrollLink className="footer-link" to="contact" smooth={true} duration={500}>
              Contact Us
            </ScrollLink>
          </div>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <div className="contact-info">
            <div className="contact-item">
              <span className="icon">📧</span>
              <span>messmaster@gmail.com</span>
            </div>
            <div className="contact-item">
              <span className="icon">📱</span>
              <span>+91 7058461105</span>
            </div>
            <div className="contact-item">
              <span className="icon">📍</span>
              <span>Your Institution Address</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
           <div>
             <a href="#" className="social-link">
              <img src="/assets/fb.png" alt="" height={40} />
            </a>
            <a href="#" className="social-link">
               <img src="/assets/insta.png" alt=""  height={40} />
            </a>
           </div>
           <div>
             <a href="#" className="social-link">
               <img src="/assets/X.png" alt=""  height={40} />
            </a>
            <a href="#" className="social-link">
               <img src="/assets/LI.png" alt=""  height={40} />
            </a>
           </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2025 MessMaster. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
