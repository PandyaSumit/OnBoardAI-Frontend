import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
    const [selectedRole, setSelectedRole] = useState("");
    const navigate = useNavigate()
    const handleContinue = () => {
        if (selectedRole === "organization") {
            navigate("/organization-auth")
        } else if (selectedRole === "employee") {
            navigate("/employee-auth")
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Role</h1>
                <p className="text-gray-600">Choose how you want to get started</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
                <div
                    onClick={() => setSelectedRole("organization")}
                    className={`flex-1 p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 bg-white hover:shadow-lg ${selectedRole === "organization"
                        ? "border-blue-500 shadow-lg"
                        : "border-gray-200 hover:border-blue-300"
                        }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedRole === "organization" ? "bg-blue-100" : "bg-gray-100"
                            }`}>
                            <svg className={`w-6 h-6 ${selectedRole === "organization" ? "text-blue-600" : "text-gray-600"
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRole === "organization"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                            }`}>
                            {selectedRole === "organization" && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Organization</h3>
                    <p className="text-gray-600">Manage employees and onboarding workflows</p>
                </div>

                <div
                    onClick={() => setSelectedRole("employee")}
                    className={`flex-1 p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 bg-white hover:shadow-lg ${selectedRole === "employee"
                        ? "border-green-500 shadow-lg"
                        : "border-gray-200 hover:border-green-300"
                        }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedRole === "employee" ? "bg-green-100" : "bg-gray-100"
                            }`}>
                            <svg className={`w-6 h-6 ${selectedRole === "employee" ? "text-green-600" : "text-gray-600"
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRole === "employee"
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                            }`}>
                            {selectedRole === "employee" && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee</h3>
                    <p className="text-gray-600">Complete your onboarding tasks and training</p>
                </div>
            </div>

            <button
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`mt-8 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${selectedRole
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
            >
                Continue as {selectedRole || "____"}
            </button>
        </div>
    );
};

export default RoleSelection;