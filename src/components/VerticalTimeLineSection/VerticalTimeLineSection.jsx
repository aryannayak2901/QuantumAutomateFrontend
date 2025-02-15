import React from 'react';
import { CheckCircle, Zap, Trophy, Star } from 'lucide-react';

const VerticalTimeLineSection = () => {
    const timelineSteps = [
        {
            id: 1,
            title: 'Getting Started',
            description: 'Begin your journey with our AI-powered platform.',
            icon: CheckCircle,
            color: 'bg-blue-500'
        },
        {
            id: 2,
            title: 'Lead Generation',
            description: 'Automatically extract and qualify potential leads.',
            icon: Zap,
            color: 'bg-green-500'
        },
        {
            id: 3,
            title: 'AI Engagement',
            description: 'Let our AI handle initial contact and qualification.',
            icon: Star,
            color: 'bg-purple-500'
        },
        {
            id: 4,
            title: 'Success & Growth',
            description: 'Scale your business with automated lead management.',
            icon: Trophy,
            color: 'bg-orange-500'
        }
    ];

    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Follow our proven process to transform your lead generation and management
                </p>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-700"></div>

                {/* Timeline Items */}
                <div className="space-y-20">
                    {timelineSteps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`flex items-center ${
                                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                            }`}
                        >
                            {/* Content */}
                            <div className="w-1/2 px-8">
                                <div className={`p-6 bg-secondary-800/50 rounded-xl border border-secondary-700/50 backdrop-blur-sm ${
                                    index % 2 === 0 ? 'text-right' : 'text-left'
                                }`}>
                                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                                    <p className="text-gray-400">{step.description}</p>
                                </div>
                            </div>

                            {/* Icon */}
                            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-secondary-800 border-4 border-secondary-900 z-10">
                                <step.icon className={`w-6 h-6 ${step.color.replace('bg-', 'text-')}`} />
                            </div>

                            {/* Spacer */}
                            <div className="w-1/2 px-8"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VerticalTimeLineSection;