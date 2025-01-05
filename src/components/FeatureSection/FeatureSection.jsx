import React from 'react'
import './FeatureSection.css'
import LearnMoreButton from '../Buttons/LearnMoreButton/LearnMoreButton';

const FeatureSection = () => {

    const features = [
        { id: 1, title: 'Lead Extraction', description: 'Effortlessly extract leads from various platforms.', icon: '/path-to-icon1.png' },
        { id: 2, title: 'AI Calling', description: 'Automate calling and engage with leads effectively.', icon: '/path-to-icon2.png' },
        { id: 3, title: 'Analytics', description: 'Gain actionable insights to grow your business.', icon: '/path-to-icon3.png' },
    ];

    return (
        <section className="features-section">
            <h2 className="features-heading">Our Features</h2>
            <div className="features-grid">
                {features.map((feature) => (
                    <div key={feature.id} className="feature-card">
                        <img src={feature.icon} alt={feature.title} className="feature-icon" />
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-description">{feature.description}</p>
                    </div>
                ))}
            </div>
            <div className="features-learn-button">
                <LearnMoreButton />
            </div>

        </section>
    )
}

export default FeatureSection