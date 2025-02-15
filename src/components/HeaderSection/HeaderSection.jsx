import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const HeaderSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-secondary-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-white">
                            Quantum<span className="text-primary-400">AI</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-8">
                            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
                            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
                            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
                            <button 
                                onClick={handleDashboardClick}
                                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-500 transition-colors"
                            >
                                Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-white"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link 
                                to="/about" 
                                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link 
                                to="/pricing" 
                                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                            <Link 
                                to="/contact" 
                                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <button 
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleDashboardClick();
                                }}
                                className="w-full text-left px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
                            >
                                Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default HeaderSection