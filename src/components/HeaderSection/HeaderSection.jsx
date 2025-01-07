// Updated HeaderSection Component
import React, { useState, useEffect } from 'react';
import './HeaderSection.css';

const HeaderSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    const handleScroll = () => {
        // Get the current scroll position in pixels
        const scrollPosition = window.scrollY;

        // Calculate the height of 100vh
        const threshold = 100 * window.innerHeight / 100; // 100dvh (100% of the viewport height)

        if (scrollPosition >= threshold) {
            setIsHidden(true);  // Hide the header after scrolling 100dvh
        } else {
            setIsHidden(false); // Show the header if the scroll position is less than 100dvh
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <header className={`header-container ${isHidden ? 'hidden' : ''}`}>
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
