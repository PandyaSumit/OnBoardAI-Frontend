import React, { useState } from 'react';

const EmployeeAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        employeeId: '',
        department: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            employeeId: '',
            department: ''
        });
    };

    const goBack = () => {
        console.log('Going back to role selection');
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden relative">
            <div className="absolute top-4 left-4 z-50 flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.04.18 2.04.18 3 0 5.16-1 9-5.45 9-11V7l-10-5z" />
                    </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">OnBoard</span>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className={`flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 ${!isLogin && 'pt-[16rem]'} overflow-y-auto`}>
                    <div className="w-full max-w-sm">
                        <div className={`${isLogin ? 'mb-6' : 'mb-4'}`}>
                            <button
                                onClick={goBack}
                                className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="text-sm">Back</span>
                            </button>

                            <h1 className="text-xl font-semibold text-gray-900 mb-1">
                                {isLogin ? 'Login' : 'Sign up'}
                            </h1>
                            <p className="text-gray-600 text-sm">
                                {isLogin
                                    ? 'We suggest using the email address you use at work.'
                                    : 'Create your employee account to get started.'
                                }
                            </p>
                        </div>

                        {/* Form */}
                        <div className={`space-y-${isLogin ? '4' : '3'}`}>
                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {isLogin ? 'Address email' : 'Email Address'}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your.email@company.com"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••••••"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none transition-all pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {showPassword ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                                {isLogin && (
                                    <div className="text-right mt-1">
                                        <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
                                            Forgot password
                                        </a>
                                    </div>
                                )}
                            </div>

                            {!isLogin && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="••••••••••••"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Employee ID
                                            </label>
                                            <input
                                                type="text"
                                                name="employeeId"
                                                value={formData.employeeId}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Department
                                        </label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            <option value="hr">Human Resources</option>
                                            <option value="it">Information Technology</option>
                                            <option value="finance">Finance</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="sales">Sales</option>
                                            <option value="operations">Operations</option>
                                            <option value="engineering">Engineering</option>
                                            <option value="design">Design</option>
                                            <option value="customer-service">Customer Service</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            <button
                                onClick={handleSubmit}
                                className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors ${isLogin ? 'mt-5' : 'mt-4'}`}
                            >
                                {isLogin ? 'Login' : 'Sign up'}
                            </button>

                            <div className={`relative ${isLogin ? 'my-5' : 'my-4'}`}>
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-50 text-gray-500 text-xs">OR</span>
                                </div>
                            </div>

                            <div className={`space-y-${isLogin ? '3' : '2'}`}>
                                <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm">Continue with Google</span>
                                </button>

                                <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    <span className="text-sm">Continue with GitHub</span>
                                </button>
                            </div>

                            <div className={`text-center ${isLogin ? 'mt-5' : 'mt-3'}`}>
                                <p className="text-sm text-gray-600">
                                    {isLogin ? "You dont have an account yet? " : "Already have an account? "}
                                    <button
                                        onClick={toggleAuthMode}
                                        className="text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        {isLogin ? 'Sign up' : 'Login'}
                                    </button>
                                </p>
                            </div>

                            {!isLogin && (
                                <div className="text-center mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 leading-tight">
                                        By creating account you agree to our{' '}
                                        <a href="#" className="text-purple-600 hover:text-purple-700">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#" className="text-purple-600 hover:text-purple-700">Privacy Policy</a>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side - Chat Interface Background */}
                <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 items-center justify-center relative overflow-hidden p-6">
                    {/* Floating Elements */}
                    <div className="absolute top-16 left-12 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
                    <div className="absolute top-24 right-16 w-4 h-4 bg-white/10 rounded-full animate-pulse delay-300"></div>
                    <div className="absolute bottom-24 left-8 w-2 h-2 bg-white/15 rounded-full animate-pulse delay-700"></div>

                    {/* Main Content */}
                    <div className="relative z-10 w-full max-w-sm">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.04.18 2.04.18 3 0 5.16-1 9-5.45 9-11V7l-10-5z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Welcome to OnBoard</h2>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Streamline your employee journey with our intelligent onboarding assistant.
                            </p>
                        </div>

                        {/* Chat Interface */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                            {/* Bot Message */}
                            <div className="flex items-start mb-4">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.04.18 2.04.18 3 0 5.16-1 9-5.45 9-11V7l-10-5z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-medium text-xs mb-1">OnBoard Assistant</div>
                                    <div className="bg-white rounded-xl rounded-tl-sm p-3 shadow-lg">
                                        <p className="text-gray-800 text-xs leading-relaxed">
                                            Hello! I'll help you complete your employee setup, access training materials, and connect with your team. Ready to get started?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* User Response Options */}
                            <div className="flex items-start">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="text-blue-100 font-medium text-xs mb-1">You</div>
                                    <div className="space-y-1">
                                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 px-3 rounded-lg transition-colors text-left">
                                            Yes, let's begin my onboarding!
                                        </button>
                                        <button className="w-full bg-white/10 hover:bg-white/20 text-white text-xs py-1.5 px-3 rounded-lg transition-colors text-left border border-white/20">
                                            Tell me more about the process
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Typing Indicator */}
                            <div className="flex items-center mt-3 text-blue-200 text-xs">
                                <div className="flex space-x-1 mr-2">
                                    <div className="w-1 h-1 bg-blue-200 rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-blue-200 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-1 h-1 bg-blue-200 rounded-full animate-bounce delay-200"></div>
                                </div>
                                <span className="text-xs">Preparing your workflow...</span>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center text-blue-100">
                                <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs">Personalized onboarding workflows</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                                <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs">Interactive training modules</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                                <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs">Interactive training modules</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EmployeeAuth;