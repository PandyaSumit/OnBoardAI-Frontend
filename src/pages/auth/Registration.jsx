import { useFormik } from 'formik'
import { ArrowRight, Users, User, Building2, ChevronDown } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userRegistrationSchema, organizationRegistrationSchema } from '../../schemas/authSchema'
import { registerUser, registerOrganization, clearError } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const roleOptions = [
    {
        value: 'user',
        label: 'Individual User',
        icon: User,
        description: 'Join an existing organization'
    },
    {
        value: 'organization',
        label: 'Organization',
        icon: Building2,
        description: 'Create a new organization'
    }
]

const organizationSizes = ['1-10', '11-50', '51-200', '201-1000', '1000+']
const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Media', 'Non-profit', 'Other'
]

const userInitialValues = {
    role: 'user',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    joinCode: ''
}

const organizationInitialValues = {
    role: 'organization',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
    confirmAdminPassword: '',
    organizationName: '',
    organizationEmail: '',
    description: '',
    industry: '',
    organizationSize: '',
    website: ''
}

const placeholderText = "Please select your role to get started..."

const Registration = ({ handleGoogleAuth, setRegister }) => {
    const [selectedRole, setSelectedRole] = useState('')
    const [typingText, setTypingText] = useState('')
    const [isTypingComplete, setIsTypingComplete] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoading, error } = useSelector(state => state.auth)

    const formik = useFormik({
        initialValues: selectedRole === 'user' ? userInitialValues : organizationInitialValues,
        validationSchema: selectedRole === 'user' ? userRegistrationSchema : organizationRegistrationSchema,
        enableReinitialize: true,
        validateOnBlur: true,
        validateOnChange: false,
        onSubmit: async (values) => {
            try {
                if (selectedRole === 'user') {
                    const userData = {
                        email: values.email,
                        password: values.password,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        joinCode: values.joinCode || undefined
                    }
                    await dispatch(registerUser(userData)).unwrap()
                } else {
                    const orgData = {
                        organizationName: values.organizationName,
                        organizationEmail: values.organizationEmail,
                        adminEmail: values.adminEmail,
                        adminPassword: values.adminPassword,
                        adminFirstName: values.adminFirstName,
                        adminLastName: values.adminLastName,
                        description: values.description,
                        industry: values.industry,
                        organizationSize: values.organizationSize,
                        website: values.website
                    }
                    await dispatch(registerOrganization(orgData)).unwrap()
                }
                navigate('/dashboard')
            } catch (error) {
                console.error('Registration error:', error)
            }
        }
    })

    const handleRoleSelect = (role) => {
        setSelectedRole(role)
        formik.resetForm()
        dispatch(clearError())
    }

    useEffect(() => {
        if (!selectedRole) {
            let index = 0
            const interval = setInterval(() => {
                if (index < placeholderText.length) {
                    setTypingText(placeholderText.slice(0, index + 1))
                    index++
                } else {
                    setIsTypingComplete(true)
                    clearInterval(interval)
                }
            }, 50)

            return () => clearInterval(interval)
        } else {
            setTypingText('')
            setIsTypingComplete(false)
        }
    }, [selectedRole])

    // Clear errors when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearError())
        }
    }, [dispatch])

    const renderUserFields = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <input
                        type="text"
                        placeholder="First name *"
                        {...formik.getFieldProps('firstName')}
                        className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm w-full ${formik.touched.firstName && formik.errors.firstName
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200'
                            }`}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                        <p className="mt-1 text-xs text-red-600">{formik.errors.firstName}</p>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Last name"
                        {...formik.getFieldProps('lastName')}
                        className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm w-full"
                    />
                </div>
            </div>

            <div>
                <input
                    type="email"
                    placeholder="Email address *"
                    {...formik.getFieldProps('email')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm ${formik.touched.email && formik.errors.email
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200'
                        }`}
                />
                {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-xs text-red-600">{formik.errors.email}</p>
                )}
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Password *"
                    {...formik.getFieldProps('password')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm ${formik.touched.password && formik.errors.password
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200'
                        }`}
                />
                {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-xs text-red-600">{formik.errors.password}</p>
                )}
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Confirm password *"
                    {...formik.getFieldProps('confirmPassword')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm ${formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200'
                        }`}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{formik.errors.confirmPassword}</p>
                )}
            </div>

            <input
                type="text"
                placeholder="Organization join code (optional)"
                {...formik.getFieldProps('joinCode')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm"
            />
        </div>
    )

    const renderOrganizationFields = () => (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Admin User Details</h3>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <input
                        type="text"
                        placeholder="Your first name *"
                        {...formik.getFieldProps('adminFirstName')}
                        className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm w-full ${formik.touched.adminFirstName && formik.errors.adminFirstName
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200'
                            }`}
                    />
                    {formik.touched.adminFirstName && formik.errors.adminFirstName && (
                        <p className="mt-1 text-xs text-red-600">{formik.errors.adminFirstName}</p>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Your last name"
                        {...formik.getFieldProps('adminLastName')}
                        className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm w-full"
                    />
                </div>
            </div>

            <div>
                <input
                    type="email"
                    placeholder="Your email address *"
                    {...formik.getFieldProps('adminEmail')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm ${formik.touched.adminEmail && formik.errors.adminEmail
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200'
                        }`}
                />
                {formik.touched.adminEmail && formik.errors.adminEmail && (
                    <p className="mt-1 text-xs text-red-600">{formik.errors.adminEmail}</p>
                )}
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Your password *"
                    {...formik.getFieldProps('adminPassword')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm ${formik.touched.adminPassword && formik.errors.adminPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200'
                        }`}
                />
                {formik.touched.adminPassword && formik.errors.adminPassword && (
                    <p className="mt-1 text-xs text-red-600">{formik.errors.adminPassword}</p>
                )}
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Confirm password *"
                    {...formik.getFieldProps('confirmAdminPassword')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm ${formik.touched.confirmAdminPassword && formik.errors.confirmAdminPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200'
                        }`}
                />
                {formik.touched.confirmAdminPassword && formik.errors.confirmAdminPassword && (
                    <p className="mt-1 text-xs text-red-600">{formik.errors.confirmAdminPassword}</p>
                )}
            </div>

            <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Organization Details</h3>

                <div>
                    <input
                        type="text"
                        placeholder="Organization name *"
                        {...formik.getFieldProps('organizationName')}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm mb-3 ${formik.touched.organizationName && formik.errors.organizationName
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200'
                            }`}
                    />
                    {formik.touched.organizationName && formik.errors.organizationName && (
                        <p className="mt-1 mb-3 text-xs text-red-600">{formik.errors.organizationName}</p>
                    )}
                </div>

                <div>
                    <input
                        type="email"
                        placeholder="Organization email *"
                        {...formik.getFieldProps('organizationEmail')}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm mb-3 ${formik.touched.organizationEmail && formik.errors.organizationEmail
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200'
                            }`}
                    />
                    {formik.touched.organizationEmail && formik.errors.organizationEmail && (
                        <p className="mt-1 mb-3 text-xs text-red-600">{formik.errors.organizationEmail}</p>
                    )}
                </div>

                <textarea
                    placeholder="Brief description of your organization (optional)"
                    {...formik.getFieldProps('description')}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm mb-3 resize-none"
                />

                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <select
                            {...formik.getFieldProps('industry')}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm appearance-none bg-white"
                        >
                            <option value="">Select industry</option>
                            {industries.map(industry => (
                                <option key={industry} value={industry}>{industry}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            {...formik.getFieldProps('organizationSize')}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm appearance-none bg-white"
                        >
                            <option value="">Company size</option>
                            {organizationSizes.map(size => (
                                <option key={size} value={size}>{size} employees</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <input
                    type="url"
                    placeholder="Company website (optional)"
                    {...formik.getFieldProps('website')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm mt-3"
                />
            </div>
        </div>
    )
    console.log('formik.errors', formik.errors)
    console.log('formik.values', formik.values)
    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <h1 className="text-2xl font-medium text-gray-900">
                    Create Your Account
                </h1>
                <p className="text-gray-600">
                    Get started with OnboardAI in minutes
                </p>
            </div>

            {/* Google Auth Button */}
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium disabled:opacity-50"
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
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-sm text-red-800">
                        {error}
                    </div>
                </div>
            )}

            {/* Role Selection */}
            {!selectedRole && (
                <div className="space-y-4">
                    <div className="text-center">
                        <div className="h-6 flex items-center justify-center">
                            <span className="text-sm text-gray-600 font-mono">
                                {typingText}
                                {!isTypingComplete && <span className="animate-pulse">|</span>}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {roleOptions.map((role) => {
                            const IconComponent = role.icon
                            return (
                                <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => handleRoleSelect(role.value)}
                                    disabled={isLoading}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left group disabled:opacity-50"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-gray-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center transition-colors">
                                            <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 group-hover:text-orange-900">
                                                {role.label}
                                            </h3>
                                            <p className="text-sm text-gray-600 group-hover:text-orange-700 mt-1">
                                                {role.description}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Registration Form */}
            {selectedRole && (
                <div className="space-y-6">
                    {/* Role Selection Display */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            {selectedRole === 'user' ? (
                                <User className="w-4 h-4 text-orange-600" />
                            ) : (
                                <Building2 className="w-4 h-4 text-orange-600" />
                            )}
                            <span className="text-sm font-medium text-orange-900">
                                {selectedRole === 'user' ? 'Individual User' : 'Organization'}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedRole('')
                                formik.resetForm()
                                dispatch(clearError())
                            }}
                            disabled={isLoading}
                            className="text-xs text-orange-700 hover:text-orange-800 underline disabled:opacity-50"
                        >
                            Change
                        </button>
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                        {selectedRole === 'user' ? renderUserFields() : renderOrganizationFields()}

                        <button
                            type="submit"
                            disabled={!formik.isValid || isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 mt-5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                <>
                                    {selectedRole === 'user' ? 'Create Account' : 'Create Organization'}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Terms and Privacy */}
                    <p className="text-xs text-gray-500 text-center">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-orange-600 hover:text-orange-700 underline">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-orange-600 hover:text-orange-700 underline">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            )}

            <div className="text-center text-xs text-gray-500">
                Already have an account?{' '}
                <button
                    onClick={() => setRegister(false)}
                    disabled={isLoading}
                    className="text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50">
                    Sign in
                </button>
            </div>
        </div>
    )
}

export default Registration