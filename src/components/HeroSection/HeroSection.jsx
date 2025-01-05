import React from 'react'
import HeroSectionVideo from "../../static/HeroSectionVideo.mp4"
import './HeroSection.css'
import GetStartedButton from '../Buttons/GetStartedButton/GetStartedButton'
import LearnMoreButton from '../Buttons/LearnMoreButton/LearnMoreButton'

const HeroSection = () => {
    return (
        <div className="hero-container">
            <video className="background-video" autoPlay loop muted>
                <source src={HeroSectionVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="hero-content">
                <h1>Transform Your Business with AI Automation</h1>
                <p>
                    From lead extraction to AI-driven calls and actionable analytics—streamline your business with our cutting-edge tools.
                </p>
                <div className="hero-buttons">
                    <GetStartedButton />
                    <LearnMoreButton />
                </div>
            </div>
        </div>
    )
}

export default HeroSection