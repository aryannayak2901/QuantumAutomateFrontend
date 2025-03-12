import React from 'react'
import { Zap, Users, BarChart3 } from 'lucide-react'

const FeatureSection = () => {
    const features = [
        { 
            id: 1, 
            title: 'Lead Extraction', 
            description: 'Effortlessly extract leads from various platforms with our advanced AI technology.', 
            icon: Users
        },
        { 
            id: 2, 
            title: 'AI Calling', 
            description: 'Automate calling and engage with leads effectively using natural language processing.', 
            icon: Zap
        },
        { 
            id: 3, 
            title: 'Analytics', 
            description: 'Gain actionable insights with real-time analytics and detailed reporting.', 
            icon: BarChart3
        },
    ]

    return (
        <section className="py-24 bg-secondary-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Powerful Features for Modern Businesses
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                        Everything you need to scale your business with AI-powered automation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    {features.map((feature) => (
                        <div 
                            key={feature.id} 
                            className="relative p-8 bg-secondary-800/50 rounded-2xl border border-secondary-700/50 backdrop-blur-sm hover:bg-secondary-800/80 transition-all duration-300 group"
                        >
                            <div className="absolute -inset-px bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            <div className="relative">
                                <feature.icon className="h-12 w-12 text-primary-400 mb-6" />
                                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                                <p className="text-gray-400 mb-6">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a href="/about" className="inline-flex items-center text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-all">
                        Learn more <span aria-hidden="true" className="ml-1">→</span>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default FeatureSection