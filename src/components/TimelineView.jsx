import React, { useState, useMemo } from 'react';
import {
    Calendar, ChevronLeft, ChevronRight, Filter, ZoomIn, ZoomOut,
    Clock, User, Flag, Target, Bookmark, Bug, CheckCircle, Zap
} from 'lucide-react';

const TimelineView = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 7, 20)); // August 20, 2024
    const [viewMode, setViewMode] = useState('month'); // week, month, quarter
    const [showFilters, setShowFilters] = useState(false);

    // Minimal dummy data focused on timeline essentials
    const timelineData = [
        {
            id: 'PROJ-101',
            title: 'User Authentication System',
            type: 'story',
            priority: 'high',
            assignee: 'Sarah Chen',
            startDate: new Date(2024, 7, 15),
            endDate: new Date(2024, 7, 28),
            progress: 75,
            status: 'in-progress'
        },
        {
            id: 'PROJ-102',
            title: 'Dashboard Analytics',
            type: 'story',
            priority: 'medium',
            assignee: 'Alex Johnson',
            startDate: new Date(2024, 7, 22),
            endDate: new Date(2024, 8, 5),
            progress: 0,
            status: 'to-do'
        },
        {
            id: 'PROJ-103',
            title: 'Mobile Responsive Fix',
            type: 'bug',
            priority: 'highest',
            assignee: 'Emily Rodriguez',
            startDate: new Date(2024, 7, 18),
            endDate: new Date(2024, 7, 21),
            progress: 100,
            status: 'done'
        },
        {
            id: 'PROJ-104',
            title: 'API Performance Optimization',
            type: 'task',
            priority: 'medium',
            assignee: 'David Kim',
            startDate: new Date(2024, 8, 1),
            endDate: new Date(2024, 8, 10),
            progress: 0,
            status: 'to-do'
        },
        {
            id: 'PROJ-105',
            title: 'User Onboarding Flow',
            type: 'epic',
            priority: 'high',
            assignee: 'Lisa Wang',
            startDate: new Date(2024, 7, 25),
            endDate: new Date(2024, 8, 15),
            progress: 30,
            status: 'in-progress'
        }
    ];

    const getTypeIcon = (type) => {
        const icons = {
            story: Bookmark,
            task: CheckCircle,
            bug: Bug,
            epic: Zap,
        };
        const Icon = icons[type] || Target;
        return <Icon className="w-3 h-3" />;
    };

    const getStatusColor = (status) => {
        const colors = {
            'to-do': 'bg-gray-400',
            'in-progress': 'bg-blue-500',
            'done': 'bg-green-500',
            'blocked': 'bg-red-500'
        };
        return colors[status] || colors['to-do'];
    };

    const getPriorityColor = (priority) => {
        const colors = {
            highest: 'border-red-500',
            high: 'border-orange-500',
            medium: 'border-yellow-500',
            low: 'border-green-500',
            lowest: 'border-blue-500'
        };
        return colors[priority] || colors.medium;
    };

    // Calculate timeline dimensions
    const getDaysInView = () => {
        switch (viewMode) {
            case 'week': return 7;
            case 'month': return 30;
            case 'quarter': return 90;
            default: return 30;
        }
    };

    const getTimelineStart = () => {
        const start = new Date(currentDate);
        start.setDate(1); // Start of month
        return start;
    };

    const getTimelineEnd = () => {
        const end = new Date(currentDate);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0); // End of month
        return end;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateItemPosition = (item) => {
        const timelineStart = getTimelineStart();
        const timelineEnd = getTimelineEnd();
        const totalDays = Math.ceil((timelineEnd - timelineStart) / (1000 * 60 * 60 * 24));

        const startOffset = Math.max(0, Math.ceil((item.startDate - timelineStart) / (1000 * 60 * 60 * 24)));
        const endOffset = Math.min(totalDays, Math.ceil((item.endDate - timelineStart) / (1000 * 60 * 60 * 24)));

        const left = (startOffset / totalDays) * 100;
        const width = ((endOffset - startOffset) / totalDays) * 100;

        return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
    };

    const navigateDate = (direction) => {
        const newDate = new Date(currentDate);
        switch (viewMode) {
            case 'week':
                newDate.setDate(newDate.getDate() + (direction * 7));
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + direction);
                break;
            case 'quarter':
                newDate.setMonth(newDate.getMonth() + (direction * 3));
                break;
        }
        setCurrentDate(newDate);
    };

    const generateDateHeaders = () => {
        const headers = [];
        const start = getTimelineStart();
        const end = getTimelineEnd();
        const current = new Date(start);

        while (current <= end) {
            headers.push(new Date(current));
            current.setDate(current.getDate() + Math.ceil((end - start) / (1000 * 60 * 60 * 24)) / 15); // Show ~15 headers
        }

        return headers;
    };

    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Timeline</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Track work across time with your team
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigateDate(-1)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 min-w-48 text-center">
                                {currentDate.toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </h2>

                            <button
                                onClick={() => navigateDate(1)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                            {['week', 'month', 'quarter'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-3 py-1 text-sm rounded transition-colors capitalize ${viewMode === mode
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex relative">
                            <div className="w-64 flex-shrink-0"></div>
                            <div className="flex-1 relative">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {generateDateHeaders().map((date, index) => (
                                        <div key={index} className="text-center">
                                            {formatDate(date)}
                                        </div>
                                    ))}
                                </div>
                                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {timelineData.map((item) => {
                            const position = calculateItemPosition(item);

                            return (
                                <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center">
                                        <div className="w-64 flex-shrink-0 pr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {getTypeIcon(item.type)}
                                                </span>
                                                <span className="text-xs font-mono text-gray-500">
                                                    {item.id}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                                                    {item.assignee.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    {item.assignee}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 relative h-8 bg-gray-100 dark:bg-gray-700 rounded">
                                            <div
                                                className={`absolute top-1 bottom-1 rounded-sm border-l-4 ${getPriorityColor(item.priority)} ${getStatusColor(item.status)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                                                style={position}
                                                title={`${item.title} (${item.progress}%)`}
                                            >
                                                {position.width !== '2%' && (
                                                    <div className="px-2 py-1 text-white text-xs font-medium truncate">
                                                        {item.progress}%
                                                    </div>
                                                )}

                                                <div
                                                    className="absolute top-0 bottom-0 left-0 bg-white/30 rounded-sm transition-all duration-300"
                                                    style={{ width: `${item.progress}%` }}
                                                />
                                            </div>

                                            {(() => {
                                                const today = new Date();
                                                const timelineStart = getTimelineStart();
                                                const timelineEnd = getTimelineEnd();

                                                if (today >= timelineStart && today <= timelineEnd) {
                                                    const totalDays = Math.ceil((timelineEnd - timelineStart) / (1000 * 60 * 60 * 24));
                                                    const todayOffset = Math.ceil((today - timelineStart) / (1000 * 60 * 60 * 24));
                                                    const todayPosition = (todayOffset / totalDays) * 100;

                                                    return (
                                                        <div
                                                            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                                                            style={{ left: `${todayPosition}%` }}
                                                            title="Today"
                                                        />
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>

                                        <div className="w-24 flex-shrink-0 pl-4 text-right">
                                            <div className="text-xs text-gray-500">
                                                {Math.ceil((item.endDate - item.startDate) / (1000 * 60 * 60 * 24))} days
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {timelineData.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No timeline data
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Create tasks with due dates to see them in the timeline
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded"></div>
                        <span>To Do</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Completed</span>
                    </div>
                </div>
            </div>

            {showFilters && (
                <div className="fixed inset-y-0 right-0 w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Timeline Filters</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Status</h4>
                            <div className="space-y-2">
                                {['to-do', 'in-progress', 'done'].map(status => (
                                    <label key={status} className="flex items-center gap-2">
                                        <input type="checkbox" defaultChecked className="rounded" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                            {status.replace('-', ' ')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Assignee</h4>
                            <div className="space-y-2">
                                {['Sarah Chen', 'Alex Johnson', 'Emily Rodriguez'].map(assignee => (
                                    <label key={assignee} className="flex items-center gap-2">
                                        <input type="checkbox" defaultChecked className="rounded" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {assignee}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimelineView;