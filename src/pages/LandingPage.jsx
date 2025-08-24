
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Eye, EyeOff, Users, Zap, Target, CheckCircle, ArrowRight, Play, Star, Menu, X, Bot, Brain, Workflow, Users2, FileText, Calendar, UserPlus, MessageSquare, Mic, ListChecks } from 'lucide-react';
import Registration from './auth/Registration';
import Login from './auth/login';

const LandingPage = () => {
    // const [showPassword, setShowPassword] = useState(false);
    const [emailStep, setEmailStep] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [register, setRegister] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (emailStep) {
                    console.log('Login:', { email: values.email, password: values.password });
                } else {
                    console.log('Continue with email:', values.email);
                    setEmailStep(true);
                }
            } catch (error) {
                console.error('Auth error:', error);
            }
            setSubmitting(false);
        }
    });

    const handleGoogleAuth = () => {
        console.log('Continue with Google');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="fixed top-0 w-full bg-gray-50/95 backdrop-blur-sm z-50 border-b border-gray-200/50">
                <div className="mx-auto px-6 lg:px-8 w-full">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-1 text-lg font-semibold">
                            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF0080] bg-clip-text text-transparent">
                                Onboard
                            </span>
                            <span className="text-gray-800 dark:text-gray-100">AI</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#product" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Product</a>
                            <a href="#solutions" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Solutions</a>
                            <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Pricing</a>
                            <a
                                href='#authSection'
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Get started
                            </a>
                        </div>

                        <a
                            href='#authSection'
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </a>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden bg-gray-50 border-t border-gray-200/50">
                        <div className="px-6 py-4 space-y-3">
                            <a href="#product" className="block text-gray-600 text-sm font-medium">Product</a>
                            <a href="#solutions" className="block text-gray-600 text-sm font-medium">Solutions</a>
                            <a href="#pricing" className="block text-gray-600 text-sm font-medium">Pricing</a>
                            <a
                                href='#authSection'
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                            >
                                Get started
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section - Full Screen Authentication */}
            <section id='authSection' className="min-h-screen flex bg-gray-50">
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        {!register ? (
                            <Login
                                handleGoogleAuth={handleGoogleAuth}
                                formik={formik}
                                setRegister={setRegister}
                                emailStep={emailStep}
                                setEmailStep={setEmailStep}
                            />
                        ) : (
                            <Registration
                                setRegister={setRegister}
                            />
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                                <span>Trusted by 4,000+ companies</span>
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Conversational Interface */}
                <div className="hidden lg:flex w-1/2 bg-stone-100 relative overflow-hidden m-4 mt-[5rem] rounded-2xl">
                    <div className="flex flex-col justify-center p-10 w-full max-w-2xl mx-auto space-y-6">

                        {/* Conversation Analysis */}
                        <div className="bg-white rounded-xl shadow-sm border p-5">
                            <div className="flex items-center space-x-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm font-semibold text-gray-800">Conversation Analysis</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                47 comments across 8 tickets reviewed. Key onboarding insights:
                            </p>
                            <ul className="text-xs text-gray-700 space-y-2">
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-red-400 rounded-full"></div> Sarah flagged paperwork delays (3 mentions)</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div> Role-specific onboarding requested (5 tickets)</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full"></div> HR praised automated welcome sequences</li>
                            </ul>
                            <div className="mt-3 border-t pt-2">
                                <p className="text-xs font-medium text-gray-900">Consensus:</p>
                                <p className="text-xs text-gray-600">Adopt personalized, automated workflows</p>
                            </div>
                        </div>

                        {/* AI Tasks */}
                        <div className="bg-white rounded-xl shadow-sm border p-5">
                            <div className="flex items-center space-x-2 mb-3">
                                <Zap className="w-4 h-4 text-purple-500" />
                                <span className="text-sm font-semibold text-gray-800">AI-Generated Tasks</span>
                            </div>
                            <ul className="text-xs text-gray-700 space-y-2">
                                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Day 1: Dev environment setup</li>
                                <li className="flex items-center gap-2"><Calendar className="w-3 h-3 text-blue-500" /> Day 2: Meet frontend team</li>
                                <li className="flex items-center gap-2"><FileText className="w-3 h-3 text-orange-500" /> Day 3-5: Code review modules</li>
                                <li className="flex items-center gap-2"><UserPlus className="w-3 h-3 text-purple-500" /> Week 2: Buddy system with Mike</li>
                            </ul>
                        </div>

                        {/* Onboarding Template */}
                        <div className="bg-white rounded-xl shadow-sm border p-5">
                            <div className="flex items-center space-x-2 mb-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-semibold text-gray-800">Developer Onboarding Template</span>
                            </div>
                            <p className="text-xs text-gray-600">
                                Adaptive onboarding template generated. Auto-customizes by role, tech stack & experience.
                            </p>
                        </div>

                        {/* Typing Indicator */}
                        <div className="flex items-center space-x-2 text-xs text-gray-500 opacity-70">
                            <Bot className="w-4 h-4 text-gray-400" />
                            <span>Analyzing next request...</span>
                        </div>

                    </div>
                </div>
            </section>


            {/* Demo Preview */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <div className="ml-4 text-sm text-gray-500">onboardai.com</div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Welcome, Alex!</h3>
                                        <p className="text-gray-600 text-sm">Your personalized onboarding journey begins</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="text-sm font-medium text-green-900">Profile Complete</span>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-blue-600 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium text-blue-900">Team Introductions</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                                            <span className="text-sm font-medium text-gray-700">First Project</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <p className="text-sm text-orange-900">
                                        "Hi Alex! I've scheduled your first team meeting for tomorrow at 10 AM and prepared your project briefing. Your mentor Sarah will reach out shortly."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="product" className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center space-y-6 mb-16">
                        <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                            Features
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            Built for modern teams
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to create exceptional onboarding experiences
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Brain className="w-6 h-6" />,
                                title: "AI-Powered Intelligence",
                                description: "Automatically create personalized onboarding plans based on role, experience, and team structure.",
                                gradient: "from-blue-500 to-purple-500"
                            },
                            {
                                icon: <Workflow className="w-6 h-6" />,
                                title: "Smart Automation",
                                description: "Streamline repetitive tasks and ensure nothing falls through the cracks with intelligent workflows.",
                                gradient: "from-orange-500 to-pink-500"
                            },
                            {
                                icon: <Users className="w-6 h-6" />,
                                title: "Team Integration",
                                description: "Connect new hires with the right people at the right time for seamless team integration.",
                                gradient: "from-green-500 to-emerald-500"
                            },
                            {
                                icon: <Target className="w-6 h-6" />,
                                title: "Progress Tracking",
                                description: "Monitor onboarding progress in real-time with detailed analytics and insights.",
                                gradient: "from-purple-500 to-indigo-500"
                            },
                            {
                                icon: <Zap className="w-6 h-6" />,
                                title: "Quick Setup",
                                description: "Get started in minutes with our intuitive interface and pre-built templates.",
                                gradient: "from-cyan-500 to-blue-500"
                            },
                            {
                                icon: <CheckCircle className="w-6 h-6" />,
                                title: "Compliance Ready",
                                description: "Ensure all compliance requirements are met with automated tracking and reporting.",
                                gradient: "from-red-500 to-orange-500"
                            },
                            // 🆕 New Features
                            {
                                icon: <Mic className="w-6 h-6" />,
                                title: "Meeting Recording",
                                description: "Automatically capture and store team discussions securely in the database.",
                                gradient: "from-teal-500 to-green-500"
                            },
                            {
                                icon: <FileText className="w-6 h-6" />,
                                title: "AI Summaries",
                                description: "Generate concise summaries, key takeaways, and decisions from every meeting.",
                                gradient: "from-pink-500 to-rose-500"
                            },
                            {
                                icon: <ListChecks className="w-6 h-6" />,
                                title: "Actionable Breakpoints",
                                description: "Convert meeting insights into tasks, issues, and follow-ups instantly.",
                                gradient: "from-amber-500 to-orange-500"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-xl p-8 border border-gray-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solutions */}
            <section id="solutions" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Heading */}
                    <div className="text-center space-y-6 mb-16">
                        <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                            Industries
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                            Trusted across industries
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            From startups to enterprises, OnboardAI adapts to your needs
                        </p>
                    </div>

                    {/* Industry Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "Technology",
                                companies: "2,400+ companies",
                                color: "from-blue-500 to-cyan-500",
                                icon: "💻",
                                benefits: ["Automated dev onboarding", "Tech stack integration", "Code access management"]
                            },
                            {
                                title: "Healthcare",
                                companies: "850+ organizations",
                                color: "from-green-500 to-emerald-500",
                                icon: "🏥",
                                benefits: ["HIPAA compliance", "Role certification", "Safety training"]
                            },
                            {
                                title: "Finance",
                                companies: "1,200+ firms",
                                color: "from-purple-500 to-violet-500",
                                icon: "💰",
                                benefits: ["Security protocols", "Compliance tracking", "Risk management"]
                            },
                            {
                                title: "Manufacturing",
                                companies: "650+ facilities",
                                color: "from-orange-500 to-red-500",
                                icon: "🏭",
                                benefits: ["Safety protocols", "Equipment training", "Process compliance"]
                            }
                        ].map((solution, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                <div className="relative z-10">
                                    {/* Icon & Title */}
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform duration-300 mb-6`}>
                                        {solution.icon}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {solution.title}
                                    </h3>

                                    <p className="text-sm font-medium text-blue-600 mb-4">
                                        {solution.companies}
                                    </p>

                                    {/* Benefits */}
                                    <ul className="space-y-2">
                                        {solution.benefits.map((benefit, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex items-center space-x-2">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${solution.color}`}></div>
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
                    <div className="space-y-6 mb-16">
                        <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                            Testimonials
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                            Loved by teams everywhere
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            From fast-growing startups to global enterprises, OnboardAI makes onboarding effortless
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Chen",
                                role: "Head of People Ops, TechFlow",
                                quote: "OnboardAI transformed our hiring process. New employees ramp up 3x faster, saving HR 15+ hours per hire.",
                                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                            },
                            {
                                name: "James Patel",
                                role: "Engineering Manager, FinEdge",
                                quote: "Our developers love the personalized onboarding. Productivity gains were visible in the very first week.",
                                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                            },
                            {
                                name: "Alicia Gomez",
                                role: "HR Director, HealthCore",
                                quote: "Compliance tracking is a game changer. We onboard confidently knowing everything is automated & secure.",
                                avatar: "https://randomuser.me/api/portraits/women/65.jpg"
                            }
                        ].map((t, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 text-left"
                            >
                                {/* Stars */}
                                <div className="flex mb-4 text-yellow-400">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <blockquote className="text-gray-700 text-base leading-relaxed mb-6">
                                    “{t.quote}”
                                </blockquote>

                                {/* Person */}
                                <div className="flex items-center space-x-4">
                                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{t.name}</p>
                                        <p className="text-sm text-gray-600">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Pricing */}
            <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="text-center space-y-6 mb-16">
                        <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                            Pricing
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Start free, scale as you grow. No hidden fees.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Starter",
                                price: "Free",
                                description: "For small teams getting started",
                                features: [
                                    "Up to 10 employees",
                                    "Basic workflows",
                                    "Email support",
                                    "Core templates",
                                    "Basic analytics"
                                ],
                                gradient: "from-blue-500 to-cyan-500",
                                cta: "Start free",
                                popular: false
                            },
                            {
                                name: "Professional",
                                price: "$12",
                                period: "per employee/month",
                                description: "For growing companies",
                                features: [
                                    "Unlimited employees",
                                    "Advanced AI automation",
                                    "Priority support 24/7",
                                    "Custom workflows",
                                    "Advanced analytics dashboard",
                                    "API access"
                                ],
                                gradient: "from-orange-500 to-pink-500",
                                cta: "Start free trial",
                                popular: true
                            },
                            {
                                name: "Enterprise",
                                price: "Custom",
                                description: "For large organizations",
                                features: [
                                    "Everything in Professional",
                                    "Custom integrations",
                                    "Dedicated success manager",
                                    "Advanced security controls",
                                    "SLA guarantees",
                                    "Custom AI model training"
                                ],
                                gradient: "from-purple-500 to-indigo-500",
                                cta: "Contact sales",
                                popular: false
                            }
                        ].map((plan, index) => (
                            <div
                                key={index}
                                className={`group bg-white rounded-2xl p-8 border relative ${plan.popular
                                    ? 'border-orange-200 ring-2 ring-orange-200 shadow-lg'
                                    : 'border-gray-200'
                                    } hover:shadow-xl transition-all duration-300 ${plan.popular ? 'lg:-translate-y-4' : ''
                                    }`}
                            >
                                {/* Gradient background effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>

                                {plan.popular && (
                                    <div className="absolute -top-4 left-0 right-0 text-center">
                                        <span className="inline-block bg-gradient-to-r from-orange-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
                                            Most popular
                                        </span>
                                    </div>
                                )}

                                <div className="relative space-y-6">
                                    {/* Header */}
                                    <div className="text-center space-y-3 pb-6 border-b border-gray-100">
                                        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                                        <div className="text-center">
                                            <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">{plan.price}</span>
                                            {plan.period && (
                                                <span className="text-gray-600 ml-2">/{plan.period}</span>
                                            )}
                                        </div>
                                        <p className="text-gray-600">{plan.description}</p>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-4">
                                        <p className="text-sm font-semibold text-gray-900">Everything you get:</p>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-3 text-sm">
                                                    <div className={`mt-1 w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                                        <CheckCircle className="w-3 h-3 text-white" />
                                                    </div>
                                                    <span className="text-gray-700">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        className={`w-full py-4 px-6 rounded-xl font-medium text-sm transition-all duration-300 ${plan.popular
                                            ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg hover:-translate-y-0.5`
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {plan.cta}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Bar */}
                    <div className="mt-16 pt-8 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>14-day free trial</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-xl font-bold">
                                <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF0080] bg-clip-text text-transparent">
                                    Onboard
                                </span>
                                <span>AI</span>
                            </div>
                            <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
                            <nav className="hidden md:flex items-center space-x-6">
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Product</a>
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Company</a>
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Support</a>
                            </nav>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-sm text-gray-400">
                                © 2025 OnboardAI. All rights reserved.
                            </p>
                            <div className="flex space-x-6">
                                <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Terms</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Privacy</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Cookies</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;