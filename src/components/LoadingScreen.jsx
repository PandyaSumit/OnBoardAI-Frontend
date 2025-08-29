import React from 'react';

const LoadingScreen = () => {

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-8 max-w-md mx-auto px-6">

                <div className="mb-12">
                    <div className="inline-flex items-center space-x-2 text-2xl font-semibold">
                        <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            Onboard
                        </span>
                        <span className="text-gray-900">AI</span>
                    </div>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-gray-600 text-base font-medium h-6">
                        Initializing workspace...
                    </p>
                </div>

                <p className="text-sm text-gray-400 mt-8">
                    Please wait while we set up your account
                </p>

            </div>
        </div>
    );
};

export default LoadingScreen;