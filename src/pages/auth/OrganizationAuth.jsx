import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearError, loginOrganization, registerOrganization } from '../../store/slices/authSlice';

const OrganizationAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const loginValidationSchema = Yup.object({
        email: Yup.string()
            .email('Please enter a valid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required')
    });

    const registrationValidationSchema = Yup.object({
        organizationName: Yup.string()
            .min(2, 'Organization name must be at least 2 characters')
            .required('Organization name is required'),
        email: Yup.string()
            .email('Please enter a valid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            )
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords do not match')
            .required('Please confirm your password'),
        phone: Yup.string()
            .required('Phone number is required'),
        address: Yup.string()
            .min(10, 'Address must be at least 10 characters')
            .required('Address is required')
    });

    const formik = useFormik({
        initialValues: {
            organizationName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: ''
        },
        validationSchema: isLogin ? loginValidationSchema : registrationValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            console.log('values', values)
            if (isLogin) {
                await dispatch(loginOrganization({
                    email: values.email,
                    password: values.password
                }));
            } else {
                await dispatch(registerOrganization({
                    orgName: values.organizationName,
                    email: values.email,
                    password: values.password,
                    phone: values.phone,
                    address: values.address
                }));
            }
            setSubmitting(false);
        }
    });

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        formik.resetForm();
    };

    const goBack = () => {
        console.log('Going back to role selection');
    };

    const getFieldError = (fieldName) =>
        formik.touched[fieldName] && formik.errors[fieldName] ? formik.errors[fieldName] : '';


    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard'); // redirect after success
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Clear error on component mount or when toggling mode
        return () => {
            dispatch(clearError());
        };
    }, [dispatch, isLogin]);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden relative">
            {/* Logo */}
            <div className="absolute top-4 left-4 z-50 flex items-center">
                <div className="flex items-center space-x-1 text-lg font-semibold">
                    <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF0080] bg-clip-text text-transparent">
                        Onboard
                    </span>
                    <span className="text-gray-800 dark:text-gray-100">AI</span>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className={`flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 ${!isLogin && 'pt-[18rem]'} overflow-y-auto`}>
                    <div className="w-full max-w-sm">
                        <div className="mb-6">
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
                                {isLogin ? 'Organization Login' : 'Organization Registration'}
                            </h1>
                            <p className="text-gray-600 text-sm">
                                {isLogin
                                    ? 'Welcome back! Sign in to your organization account.'
                                    : 'Create your organization account to get started.'
                                }
                            </p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Organization Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter organization name"
                                        {...formik.getFieldProps('organizationName')}
                                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 outline-none transition-all ${getFieldError('organizationName') ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                    />
                                    {getFieldError('organizationName') && (
                                        <p className="mt-1 text-xs text-red-600">{getFieldError('organizationName')}</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="organization@company.com"
                                    {...formik.getFieldProps('email')}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 outline-none transition-all ${getFieldError('email') ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                />
                                {getFieldError('email') && (
                                    <p className="mt-1 text-xs text-red-600">{getFieldError('email')}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    {...formik.getFieldProps('password')}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 outline-none transition-all ${getFieldError('password') ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                />
                                {getFieldError('password') && (
                                    <p className="mt-1 text-xs text-red-600">{getFieldError('password')}</p>
                                )}
                                {isLogin && (
                                    <div className="text-right mt-1">
                                        <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
                                            Forgot password?
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
                                            placeholder="••••••••••••"
                                            {...formik.getFieldProps('confirmPassword')}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 outline-none transition-all ${getFieldError('confirmPassword') ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                        />
                                        {getFieldError('confirmPassword') && (
                                            <p className="mt-1 text-xs text-red-600">{getFieldError('confirmPassword')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            {...formik.getFieldProps('phone')}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 outline-none transition-all ${getFieldError('phone') ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                        />
                                        {getFieldError('phone') && (
                                            <p className="mt-1 text-xs text-red-600">{getFieldError('phone')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Organization Address</label>
                                        <textarea
                                            placeholder="Enter organization address"
                                            rows="3"
                                            {...formik.getFieldProps('address')}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 outline-none transition-all resize-none ${getFieldError('address') ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                        />
                                        {getFieldError('address') && (
                                            <p className="mt-1 text-xs text-red-600">{getFieldError('address')}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className={`w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-6 flex items-center justify-center ${formik.isSubmitting ? 'cursor-not-allowed' : ''}`}
                            >
                                {formik.isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                                    </>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>

                            <div className="relative my-5">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-50 text-gray-500 text-xs">OR</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button type="button" className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm">Continue with Google</span>
                                </button>

                                <button type="button" className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.5 12.2c0-1.4-.1-2.7-.3-4H12v7.5h6.4c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.9c2.3-2.1 3.6-5.2 3.6-8.8z" fill="#4285F4" />
                                        <path d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3.1c-1.1.7-2.5 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.5v3.2C3.6 21.4 7.5 24 12 24z" fill="#34A853" />
                                        <path d="M5.4 14.2c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.6H1.5C.5 8.6 0 10.2 0 12s.5 3.4 1.5 5.4l3.9-3.2z" fill="#FBBC05" />
                                        <path d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.5 0 3.6 2.6 1.5 6.6l3.9 3.2c.9-2.8 3.5-4.9 6.6-4.9z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-sm">Continue with Microsoft</span>
                                </button>
                            </div>

                            <div className="text-center mt-5">
                                <p className="text-sm text-gray-600">
                                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                                    <button
                                        type="button"
                                        onClick={toggleAuthMode}
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        {isLogin ? 'Register here' : 'Login here'}
                                    </button>
                                </p>
                            </div>

                            {!isLogin && (
                                <div className="text-center mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 leading-tight">
                                        By creating account you agree to our{' '}
                                        <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Right Side */}
                <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 items-center justify-center relative overflow-hidden p-6">
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
                                    <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Organization Dashboard</h2>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Manage your workforce, track onboarding progress, and streamline HR processes.
                            </p>
                        </div>

                        {/* Dashboard Interface */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                            {/* Header Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white/20 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-white">127</div>
                                    <div className="text-xs text-blue-100">Active Employees</div>
                                </div>
                                <div className="bg-white/20 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-white">8</div>
                                    <div className="text-xs text-blue-100">Pending Onboarding</div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-white font-medium text-sm">Recent Activity</h3>
                                    <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center bg-white/10 rounded-lg p-2">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white text-xs font-medium">Sarah Johnson</div>
                                            <div className="text-blue-200 text-xs">Completed onboarding</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center bg-white/10 rounded-lg p-2">
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white text-xs font-medium">New Employee</div>
                                            <div className="text-blue-200 text-xs">Mike Chen - Starting Monday</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center bg-white/10 rounded-lg p-2">
                                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white text-xs font-medium">Training Reminder</div>
                                            <div className="text-blue-200 text-xs">Safety training due in 3 days</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center text-blue-100">
                                <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs">Employee management & analytics</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                                <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs">Automated onboarding workflows</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                                <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs">Real-time progress tracking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationAuth;
