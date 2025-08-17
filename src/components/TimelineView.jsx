import { Calendar } from 'lucide-react'
import React from 'react'

const TimelineView = () => {
    return (
        <div className="flex-1 p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Timeline</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track work across time with your team</p>
                </div>
                <div className="p-6">
                    <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Project Timeline</h4>
                        <p className="text-gray-600 dark:text-gray-400">Visualize your project schedule and dependencies</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimelineView