import React from 'react'

const HeroSection = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-10"></div>
            
            <div className="relative container mx-auto px-4 py-32 sm:py-48 lg:py-56">
                <div className="text-center animate-fade-in">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                        Transform Your Business with 
                        <span className="bg-gradient-to-r from-primary-400 to-primary-200 text-transparent bg-clip-text"> AI Automation</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto animate-slide-up">
                        From lead extraction to AI-driven calls and actionable analytics—streamline your business with our cutting-edge tools.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a href="/register" className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all">
                            Get Started
                        </a>
                        <a href="/about" className="text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-all">
                            Learn more <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-primary-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
            </div>
        </div>
    )
}

export default HeroSection