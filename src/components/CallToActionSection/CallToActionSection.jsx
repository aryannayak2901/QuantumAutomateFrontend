import React from 'react'
// import './CallToActionSection.css'

const CallToActionSection = () => {
    return (
        <section className="cta-section">
            <div className="cta-container">
                <div className="cta-text">
                    <h1>Unlock Your Potential</h1>
                    <p>Discover the tools and resources to elevate your skills and achieve your goals in no time.</p>
                </div>
                <div className="cta-form">
                    <div className="input-group">
                        <label htmlFor="user-input" className="input-label">Your Focus Area</label>
                        <input
                            type="text"
                            id="user-input"
                            placeholder="Enter your area of interest"
                            className="input-field"
                        />
                        <button className="cta-button">Get Started</button>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default CallToActionSection