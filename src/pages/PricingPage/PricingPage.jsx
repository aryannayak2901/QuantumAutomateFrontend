import React from 'react';
import { HeaderSection, FooterSection } from '../../components';
import { Check, X } from 'lucide-react';

const PricingPage = () => {
    const plans = [
        {
            name: 'Starter',
            price: '49',
            description: 'Perfect for small businesses starting with AI automation',
            features: [
                'Up to 500 AI calls per month',
                'Basic lead management',
                'Email support',
                'Standard analytics',
                'Single user account',
            ],
            notIncluded: [
                'Advanced AI customization',
                'Priority support',
                'Custom integrations',
            ]
        },
        {
            name: 'Professional',
            price: '149',
            description: 'Ideal for growing businesses with higher call volumes',
            features: [
                'Up to 2000 AI calls per month',
                'Advanced lead management',
                'Priority email & chat support',
                'Advanced analytics & reporting',
                'Up to 5 user accounts',
                'Basic AI customization',
            ],
            notIncluded: [
                'Custom integrations',
            ],
            popular: true
        },
        {
            name: 'Enterprise',
            price: '499',
            description: 'Full-featured solution for large organizations',
            features: [
                'Unlimited AI calls',
                'Enterprise lead management',
                '24/7 priority support',
                'Custom analytics & reporting',
                'Unlimited user accounts',
                'Advanced AI customization',
                'Custom integrations',
            ],
            notIncluded: []
        }
    ];

    return (
        <div className="min-h-screen bg-secondary-900">
            <HeaderSection />

            <main className="relative pt-20">
                {/* Pricing Header */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-secondary-900/90" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Simple, Transparent Pricing
                            </h1>
                            <p className="text-lg text-gray-300 mb-8">
                                Choose the perfect plan for your business needs
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pricing Plans */}
                <section className="py-20 bg-secondary-800">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan, index) => (
                                <div key={index} className="relative">
                                    {plan.popular && (
                                        <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 rounded-tr-lg rounded-bl-lg text-sm font-semibold">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className={`h-full p-8 rounded-xl backdrop-blur-sm transition-all duration-300 hover:transform hover:scale-105 ${plan.popular
                                            ? 'bg-primary-900/50 border-2 border-primary-500/50'
                                            : 'bg-secondary-700/50'
                                        }`}>
                                        <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                                        <div className="flex items-baseline mb-6">
                                            <span className="text-4xl font-bold text-white">${plan.price}</span>
                                            <span className="text-gray-400 ml-2">/month</span>
                                        </div>
                                        <p className="text-gray-300 mb-8">{plan.description}</p>

                                        <div className="space-y-4 mb-8">
                                            {plan.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center text-gray-300">
                                                    <Check className="w-5 h-5 text-green-500 mr-3" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                            {plan.notIncluded.map((feature, idx) => (
                                                <div key={idx} className="flex items-center text-gray-500">
                                                    <X className="w-5 h-5 text-red-500 mr-3" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${plan.popular
                                                ? 'bg-primary-500 text-white hover:bg-primary-600'
                                                : 'bg-secondary-600 text-white hover:bg-secondary-500'
                                            }`}>
                                            Get Started
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-secondary-900">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-white text-center mb-12">
                            Frequently Asked Questions
                        </h2>
                        <div className="max-w-3xl mx-auto space-y-6">
                            {[
                                {
                                    q: "How does the AI calling system work?",
                                    a: "Our AI system uses advanced natural language processing to conduct human-like conversations, automatically handling calls based on your customized scripts and requirements."
                                },
                                {
                                    q: "Can I upgrade or downgrade my plan?",
                                    a: "Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle."
                                },
                                {
                                    q: "Is there a contract or commitment?",
                                    a: "No, all our plans are month-to-month with no long-term commitment required."
                                }
                            ].map((faq, index) => (
                                <div key={index} className="bg-secondary-800 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-white mb-3">{faq.q}</h3>
                                    <p className="text-gray-400">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <FooterSection />
        </div>
    );
};

export default PricingPage;