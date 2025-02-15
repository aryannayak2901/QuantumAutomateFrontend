import React from 'react';
import { HeaderSection, FooterSection } from '../../components';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const ContactPage = () => {
    const contactInfo = [
        {
            icon: Phone,
            title: 'Phone',
            details: '+1 (555) 123-4567',
            description: 'Monday to Friday, 9am to 6pm EST'
        },
        {
            icon: Mail,
            title: 'Email',
            details: 'support@quantumai.com',
            description: '24/7 email support'
        },
        {
            icon: MapPin,
            title: 'Office',
            details: '123 AI Street, Tech City',
            description: 'TC 12345, United States'
        },
        {
            icon: MessageSquare,
            title: 'Live Chat',
            details: 'Available 24/7',
            description: 'Instant response during business hours'
        }
    ];

    return (
        <div className="min-h-screen bg-secondary-900">
            <HeaderSection />

            <main className="relative pt-20">
                {/* Contact Header */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-secondary-900/90" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Get in Touch
                            </h1>
                            <p className="text-lg text-gray-300 mb-8">
                                We're here to help and answer any questions you might have
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section className="py-20 bg-secondary-800">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="p-6 bg-secondary-700/50 rounded-xl backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
                                            <item.icon className="w-6 h-6 text-primary-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                                        <p className="text-primary-400 font-medium mb-2">{item.details}</p>
                                        <p className="text-gray-400">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section className="py-20 bg-secondary-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-secondary-800 rounded-xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            rows="6"
                                            className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                                            placeholder="Your message..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <FooterSection />
        </div>
    );
};

export default ContactPage;