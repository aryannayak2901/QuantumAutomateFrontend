import React from 'react';
import { HeaderSection, FooterSection } from '../../components';
import { Users, Award, Globe, Zap } from 'lucide-react';

const AboutPage = () => {
    const stats = [
        { label: 'Active Users', value: '10K+', icon: Users },
        { label: 'Countries', value: '30+', icon: Globe },
        { label: 'Success Rate', value: '95%', icon: Award },
        { label: 'AI Calls/Day', value: '5K+', icon: Zap },
    ];

    const team = [
        {
            name: 'Sarah Johnson',
            role: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            bio: 'Pioneering AI solutions in business communication.'
        },
        {
            name: 'Michael Chen',
            role: 'CTO',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            bio: 'Leading our technical innovation and AI development.'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Head of AI Research',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            bio: 'Advancing our AI capabilities and natural language processing.'
        }
    ];

    return (
        <div className="min-h-screen bg-secondary-900">
            <HeaderSection />

            <main className="relative pt-20">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-secondary-900/90" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Revolutionizing Business Communication with AI
                            </h1>
                            <p className="text-lg text-gray-300 mb-8">
                                We're on a mission to transform how businesses connect with their customers through intelligent automation and AI-driven solutions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-secondary-800">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center p-6 bg-secondary-700/50 rounded-xl backdrop-blur-sm">
                                    <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-4" />
                                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                                    <div className="text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-secondary-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">Meet Our Team</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                The brilliant minds behind our innovative AI solutions
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {team.map((member, index) => (
                                <div key={index} className="group">
                                    <div className="relative overflow-hidden rounded-xl bg-secondary-800 p-6 transition-all duration-300 hover:transform hover:scale-105">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-primary-900/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                                        />
                                        <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                                        <p className="text-primary-400 mb-4">{member.role}</p>
                                        <p className="text-gray-400">{member.bio}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="py-20 bg-secondary-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                We envision a future where businesses can effortlessly connect with their customers through intelligent, automated communication systems. Our AI-powered solutions are designed to enhance human interaction, not replace it, creating more meaningful and efficient business relationships.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <FooterSection />
        </div>
    );
};

export default AboutPage;