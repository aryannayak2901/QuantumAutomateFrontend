import React from 'react'
import './VerticalTimeLineSection.css'

const VerticalTimeLineSection = () => {

    const timelineSteps = [
        { id: 1, title: 'Step 1: Lead Extraction', description: 'Effortlessly extract leads from various platforms.', icon: '/path-to-icon1.png' },
        { id: 2, title: 'Step 2: AI Calling', description: 'Automate calling and engage with leads effectively.', icon: '/path-to-icon2.png' },
        { id: 3, title: 'Step 3: Analytics', description: 'Gain actionable insights to grow your business.', icon: '/path-to-icon3.png' },
    ];

    return (
        <section class="timeline">
            <div class="container">
                <div class="timeline-item" data-aos="fade-right">
                    <div class="timeline-img"></div>
                    <div class="timeline-content">
                        <h2>Founding</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    </div>
                </div>

                <div class="timeline-item" data-aos="fade-left">
                    <div class="timeline-img"></div>
                    <div class="timeline-content">
                        <h2>Growth Expansion</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    </div>
                </div>

                <div class="timeline-item" data-aos="fade-right">
                    <div class="timeline-img"></div>
                    <div class="timeline-content">
                        <h2>Major Achievements</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    </div>
                </div>

                <div class="timeline-item" data-aos="fade-left">
                    <div class="timeline-img"></div>
                    <div class="timeline-content">
                        <h2>Recent Milestones</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default VerticalTimeLineSection