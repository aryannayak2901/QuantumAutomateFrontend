import React from 'react'
import './FooterSection.css'
import CallToActionSection from '../CallToActionSection/CallToActionSection'

const FooterSection = () => {
    return (
        <footer className="footer-section">
            <div className="cta-placeholder">
                {/* <!-- Space reserved for Call-to-Action Component --> */}
                <CallToActionSection />
            </div>
            <div className="footer-container">
                <div className="footer-brand">
                    <h2>Quantum Automate</h2>
                    <p>Quantum Automate is your go-to platform for unlocking opportunities and enhancing your potential.</p>
                </div>
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Products</h4>
                        <ul>
                            <li><a href="#">Get the App</a></li>
                            <li><a href="#">Features</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">Integrations</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Community</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Guides</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Follow Us</h4>
                        <ul className="social-links">
                            <li><a href="#"><i className="fab fa-instagram"></i> Instagram</a></li>
                            <li><a href="#"><i className="fab fa-linkedin"></i> LinkedIn</a></li>
                            <li><a href="#"><i className="fab fa-facebook"></i> Facebook</a></li>
                            <li><a href="#"><i className="fab fa-twitter"></i> Twitter</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 YourBrand Inc. All rights reserved. <a href="#">Privacy Policy</a> &amp; <a href="#">Terms of Use</a>.</p>
                </div>
            </div>
        </footer>

    )
}

export default FooterSection