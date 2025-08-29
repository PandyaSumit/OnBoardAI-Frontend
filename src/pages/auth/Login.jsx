import { useFormik } from 'formik';
import { AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearError, login } from '../../store/slices/authSlice';
import { loginValidationSchema } from '../../schemas/authSchema';
import { useLocation, useNavigate } from 'react-router-dom';

const Login = ({ handleGoogleAuth, setRegister, emailStep, setEmailStep }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();

    const { isLoading, isAuthenticated } = useSelector(state => state.auth);

    const from = location.state?.from?.pathname || '/dashboard';

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validationSchema: loginValidationSchema,
        validateOnBlur: true,
        validateOnChange: false,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            setIsSubmitting(true);
            try {
                if (emailStep) {
                    await dispatch(login({
                        email: values.email,
                        password: values.password,
                        rememberMe: values.rememberMe
                    })).unwrap();
                } else {
                    console.log('Continue with email:', values.email);
                    setEmailStep(true);
                }
                navigate('/dashboard');
            } catch (error) {
                console.error('Login error:', error);
                if (error.includes('email') || error.includes('user not found')) {
                    setFieldError('email', 'No account found with this email');
                } else if (error.includes('password')) {
                    setFieldError('password', 'Incorrect password');
                }
            } finally {
                setIsSubmitting(false);
                setSubmitting(false);
            }
        }
    });

    const handleMoveNextStep = () => {
        setEmailStep(true);
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    useEffect(() => {
        if (formik.values.email) {
            dispatch(clearError());
        }
    }, [formik.values.email, dispatch]);

    const getButtonText = () => {
        if (isSubmitting || isLoading) {
            return emailStep ? 'Signing in...' : 'Checking...';
        }
        return emailStep ? 'Sign in' : 'Continue with Email';
    };

    const getButtonIcon = () => {
        if (isSubmitting || isLoading) {
            return (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            );
        }
        return emailStep ? <ArrowRight className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />;
    }
    const isButtonDisabled = () => {
        if (emailStep) {
            return !formik.values.password || isSubmitting || isLoading;
        }
        return !formik.values.email || isSubmitting || isLoading;
    };

    return (
        <>
            {!emailStep ? (
                <div className="space-y-8">
                    {/* Heading */}
                    <div className="text-center space-y-3">
                        <h1 className="text-2xl font-medium text-gray-900">
                            Welcome to OnboardAI
                        </h1>
                        <p className="text-gray-600">
                            Sign in to continue to your workspace
                        </p>
                    </div>

                    {/* Google Button + Divider */}
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={handleGoogleAuth}
                            className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium"
                        >
                            <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="px-3 bg-gray-50 text-gray-500 tracking-wide">or</span>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-3">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Enter your work email"
                                    {...formik.getFieldProps('email')}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm ${formik.touched.email && formik.errors.email
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-200'
                                        }`}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {formik.errors.email}
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                disabled={isButtonDisabled()}
                                onClick={() => handleMoveNextStep()}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                            >
                                <span>{getButtonText()}</span>
                                {getButtonIcon()}
                            </button>
                        </div>
                    </div>

                    {/* Switch to Sign in */}
                    <div className="text-center text-xs text-gray-500">
                        Dont't have account?{' '}
                        <button
                            onClick={() => setRegister(true)}
                            className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                            Create account
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Heading */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
                        <p className="text-gray-600 text-sm">Enter your password to continue</p>
                    </div>

                    {/* Password Form */}
                    <div className="space-y-4">
                        {/* Email (readonly) */}
                        <input
                            type="email"
                            {...formik.getFieldProps("email")}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 text-sm"
                        />

                        {/* Password Input */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...formik.getFieldProps("password")}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm ${formik.touched.password && formik.errors.password
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-200'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            {formik.touched.password && formik.errors.password && (
                                <div className="mt-2 flex items-center text-sm text-red-600">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {formik.errors.password}
                                </div>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => {
                                    setRememberMe(e.target.checked);
                                    formik.setFieldValue('rememberMe', e.target.checked);
                                }}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                Keep me signed in for 30 days
                            </label>
                        </div>

                        {/* Continue Button */}
                        <button
                            type="button"
                            onClick={formik.handleSubmit}
                            disabled={isButtonDisabled()}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                        >
                            <span>{getButtonText()}</span>
                            {getButtonIcon()}
                        </button>

                        {/* Switch Email */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setEmailStep(false)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Use a different email
                            </button>
                        </div>
                    </div>
                </div >
            )}
        </>
    )
}

export default Login
