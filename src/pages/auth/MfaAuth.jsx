import React from 'react'
import { clearError } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const MfaAuth = ({ onSubmit, isLoading, formik, error }) => {

    const dispatch = useDispatch();

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden relative">
            {/* Logo */}
            <div className="absolute top-4 left-4 z-50 flex items-center">
                <div className="flex items-center space-x-1 text-lg font-semibold">
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        Onboard
                    </span>
                    <span className="text-gray-800">AI</span>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-sm">
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold text-gray-900 mb-1">
                            Two-Factor Authentication
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Enter your authentication code to complete sign in.
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Authentication Code
                            </label>
                            <input
                                type="text"
                                placeholder="000000"
                                maxLength="6"
                                {...formik.getFieldProps('mfaToken')}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-center tracking-widest"
                            />
                        </div>

                        <div className="text-center">
                            <span className="text-xs text-gray-500">or use backup code</span>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Backup Code
                            </label>
                            <input
                                type="text"
                                placeholder="Enter backup code"
                                {...formik.getFieldProps('backupCode')}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || (!formik.values.mfaToken && !formik.values.backupCode)}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                'Verify & Sign In'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                dispatch(clearError());
                                formik.resetForm();
                            }}
                            className="w-full text-sm text-gray-500 hover:text-gray-700"
                        >
                            Back to login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MfaAuth