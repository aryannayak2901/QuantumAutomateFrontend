// Updated HeaderSection Component
import React, { useState } from 'react';
import './HeaderSection.css';

const HeaderSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <header className="header-container">
            <div className="logo">Logo</div>
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>
            <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <a href="#pricing">Pricing</a>
                <a href="#services">Services</a>
                <a href="#products">Products</a>
            </nav>
            <button className="dashboard-button">Dashboard</button>
        </header>
    );
}

export default HeaderSection;
