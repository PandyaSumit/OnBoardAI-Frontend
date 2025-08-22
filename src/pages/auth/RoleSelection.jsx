import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
    const [selectedRole, setSelectedRole] = useState("");
    const navigate = useNavigate();

    const handleContinue = () => {
        if (selectedRole === "organization") {
            navigate("/organization-auth");
        } else if (selectedRole === "employee") {
            navigate("/employee-auth");
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>

            {/* Floating Bubbles */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-56 h-56 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

            {/* Content */}
            <div className="relative z-10 text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                    Select Your Role
                </h1>
                <p className="text-lg text-gray-600">
                    Choose how you want to get started with our platform
                </p>
            </div>

            {/* Role Options */}
            <div className="relative z-10 flex flex-col md:flex-row gap-8 w-full max-w-5xl">
                {/* Organization Card */}
                <div
                    onClick={() => setSelectedRole("organization")}
                    className={`flex-1 p-8 rounded-2xl cursor-pointer transition-all duration-200 
          backdrop-blur-md border 
          ${selectedRole === "organization"
                            ? "border-blue-500 shadow-2xl bg-white/90"
                            : "border-gray-200 bg-white/60 hover:border-blue-300 hover:shadow-lg"
                        }`}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div
                            className={`w-14 h-14 rounded-xl flex items-center justify-center 
              ${selectedRole === "organization" ? "bg-blue-100" : "bg-gray-100"}`}
                        >
                            <svg
                                className={`w-7 h-7 ${selectedRole === "organization" ? "text-blue-600" : "text-gray-600"}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                        <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedRole === "organization"
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                                }`}
                        >
                            {selectedRole === "organization" && (
                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                            )}
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Organization
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                        Manage employees, assign roles, and streamline onboarding workflows.
                    </p>
                </div>

                {/* Employee Card */}
                <div
                    onClick={() => setSelectedRole("employee")}
                    className={`flex-1 p-8 rounded-2xl cursor-pointer transition-all duration-200 
          backdrop-blur-md border 
          ${selectedRole === "employee"
                            ? "border-green-500 shadow-2xl bg-white/90"
                            : "border-gray-200 bg-white/60 hover:border-green-300 hover:shadow-lg"
                        }`}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div
                            className={`w-14 h-14 rounded-xl flex items-center justify-center ${selectedRole === "employee"
                                ? "bg-green-100"
                                : "bg-gray-100"
                                }`}
                        >
                            <svg
                                className={`w-7 h-7 ${selectedRole === "employee" ? "text-green-600" : "text-gray-600"}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedRole === "employee"
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                                }`}
                        >
                            {selectedRole === "employee" && (
                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                            )}
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Employee</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                        Access onboarding tasks, complete training, and collaborate seamlessly.
                    </p>
                </div>
            </div>

            {/* Continue Button */}
            <button
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`relative z-10 mt-10 px-10 py-3.5 rounded-xl font-medium text-lg transition-all duration-200
        ${selectedRole
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
            >
                {selectedRole ? `Continue as ${selectedRole}` : "Select a Role to Continue"}
            </button>
        </div>
    );
};

export default RoleSelection;
