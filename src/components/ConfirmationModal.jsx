import React from 'react'

const ConfirmationModal = ({ handleConfirmDelete, handleCancelDelete, item }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 w-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                        <Trash2 className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Delete Item
                        </h3>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Are you sure you want to delete "<strong>{item.title}</strong>"?
                    This action cannot be undone.
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={handleCancelDelete}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                                 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 
                                 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal