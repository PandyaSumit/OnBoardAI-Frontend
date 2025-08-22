import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Calendar, ChevronLeft, ChevronRight, Filter, Target, Bookmark, Bug, CheckCircle, Zap,
    AlertCircle,
} from 'lucide-react';
import { fetchTickets, setFilters } from '../../store/slices/ticketSlice';

const TimelineView = () => {
    const dispatch = useDispatch();
    const {
        tickets,
        filteredTickets,
        loading,
        filters,
    } = useSelector(state => state.tickets);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setTimelineViewMode] = useState('month');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (tickets.length === 0) {
            dispatch(fetchTickets());
        }
    }, [dispatch, tickets.length]);

    const timelineTickets = useMemo(() => {
        return filteredTickets.filter(ticket => ticket.dueDate);
    }, [filteredTickets]);

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
            'code-review': 'bg-yellow-500',
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

    const getPriorityOrder = (priority) => {
        const order = { lowest: 1, low: 2, medium: 3, high: 4, highest: 5 };
        return order[priority] || 0;
    };

    // const getDaysInView = () => {
    //     switch (viewMode) {
    //         case 'week': return 7;
    //         case 'month': return 30;
    //         case 'quarter': return 90;
    //         default: return 30;
    //     }
    // };

    const getTimelineStart = () => {
        const start = new Date(currentDate);
        if (viewMode === 'week') {
            const dayOfWeek = start.getDay();
            start.setDate(start.getDate() - dayOfWeek);
        } else {
            start.setDate(1); // Start of month
        }
        return start;
    };

    const getTimelineEnd = () => {
        const end = new Date(currentDate);
        if (viewMode === 'week') {
            const dayOfWeek = end.getDay();
            end.setDate(end.getDate() + (6 - dayOfWeek));
        } else if (viewMode === 'month') {
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
        } else {
            end.setMonth(end.getMonth() + 3);
            end.setDate(0);
        }
        return end;
    };

    const formatDate = (date) => {
        if (viewMode === 'week') {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric'
            });
        }
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateItemPosition = (item) => {
        const timelineStart = getTimelineStart();
        const timelineEnd = getTimelineEnd();
        const totalDays = Math.ceil((timelineEnd - timelineStart) / (1000 * 60 * 60 * 24));

        const startDate = new Date(item.createdAt);
        const endDate = new Date(item.dueDate);

        const startOffset = Math.max(0, Math.ceil((startDate - timelineStart) / (1000 * 60 * 60 * 24)));
        const endOffset = Math.min(totalDays, Math.ceil((endDate - timelineStart) / (1000 * 60 * 60 * 24)));

        const left = (startOffset / totalDays) * 100;
        const width = ((endOffset - startOffset) / totalDays) * 100;

        return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
    };

    const calculateProgress = (item) => {
        const statusProgress = {
            'to-do': 0,
            'in-progress': 50,
            'code-review': 75,
            'done': 100,
            'blocked': 0
        };
        return statusProgress[item.status] || 0;
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

        const increment = viewMode === 'week' ? 1 :
            viewMode === 'month' ? 2 : 7;

        while (current <= end) {
            headers.push(new Date(current));
            current.setDate(current.getDate() + increment);
        }

        return headers;
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getDaysBetween = (start, end) => {
        return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
    };

    const sortedTimelineTickets = useMemo(() => {
        return [...timelineTickets].sort((a, b) => {
            const priorityDiff = getPriorityOrder(b.priority) - getPriorityOrder(a.priority);
            if (priorityDiff !== 0) return priorityDiff;

            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }, [timelineTickets]);

    const handleFilterChange = (filterType, value) => {
        dispatch(setFilters({ [filterType]: value }));
    };

    const handleViewModeChange = (mode) => {
        setTimelineViewMode(mode);
    };

    const getHeaderTitle = () => {
        switch (viewMode) {
            case 'week': {
                const startWeek = getTimelineStart();
                const endWeek = getTimelineEnd();
                return `${startWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            }
            case 'quarter': {
                const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
                return `Q${quarter} ${currentDate.getFullYear()}`;
            }
            default:
                return currentDate.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                });
        }
    };

    if (loading) {
        return (
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading timeline...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Timeline</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Track work across time with your team ({timelineTickets.length} tickets with due dates)
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
                                {getHeaderTitle()}
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
                                    onClick={() => handleViewModeChange(mode)}
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
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${showFilters
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
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
                            <div className="w-80 flex-shrink-0"></div>
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
                        {sortedTimelineTickets.map((item) => {
                            const position = calculateItemPosition(item);
                            const progress = calculateProgress(item);

                            return (
                                <div key={item._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center">
                                        <div className="w-80 flex-shrink-0 pr-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {getTypeIcon(item.type)}
                                                </span>
                                                <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                    {item.id}
                                                </span>
                                                <span className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority).replace('border-', 'bg-')}`}
                                                    title={`${item.priority} priority`}></span>
                                            </div>
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                                        {getInitials(item.assignee)}
                                                    </div>
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        {item.assignee || 'Unassigned'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {item.tags && item.tags.length > 0 && (
                                                        <div className="flex gap-1">
                                                            {item.tags.slice(0, 2).map(tag => (
                                                                <span key={tag} className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                            {item.tags.length > 2 && (
                                                                <span className="text-gray-400">+{item.tags.length - 2}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 relative h-8 bg-gray-100 dark:bg-gray-700 rounded">
                                            <div
                                                className={`absolute top-1 bottom-1 rounded-sm border-l-4 ${getPriorityColor(item.priority)} ${getStatusColor(item.status)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer group`}
                                                style={position}
                                                title={`${item.title} (${progress}%) - Due: ${new Date(item.dueDate).toLocaleDateString()}`}
                                            >
                                                {position.width !== '2%' && (
                                                    <div className="px-2 py-1 text-white text-xs font-medium truncate flex items-center justify-between">
                                                        <span>{progress}%</span>
                                                        {item.status === 'blocked' && (
                                                            <AlertCircle className="w-3 h-3" />
                                                        )}
                                                    </div>
                                                )}

                                                <div
                                                    className="absolute top-0 bottom-0 left-0 bg-white/30 rounded-sm transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />

                                                <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                                    {item.title} - {item.status} ({progress}%)
                                                    <br />
                                                    Due: {new Date(item.dueDate).toLocaleDateString()}
                                                </div>
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
                                                {getDaysBetween(item.createdAt, item.dueDate)} days
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {item.storyPoints && `${item.storyPoints} SP`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {timelineTickets.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No timeline data
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Create tickets with due dates to see them in the timeline
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
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span>Code Review</span>
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

                    <div className="p-4 space-y-4 overflow-y-auto">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Status</h4>
                            <div className="space-y-2">
                                {['to-do', 'in-progress', 'code-review', 'done'].map(status => (
                                    <label key={status} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.status.includes(status)}
                                            onChange={(e) => {
                                                const newStatus = e.target.checked
                                                    ? [...filters.status, status]
                                                    : filters.status.filter(s => s !== status);
                                                handleFilterChange('status', newStatus);
                                            }}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                            {status.replace('-', ' ')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Priority</h4>
                            <div className="space-y-2">
                                {['highest', 'high', 'medium', 'low', 'lowest'].map(priority => (
                                    <label key={priority} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.priority.includes(priority)}
                                            onChange={(e) => {
                                                const newPriority = e.target.checked
                                                    ? [...filters.priority, priority]
                                                    : filters.priority.filter(p => p !== priority);
                                                handleFilterChange('priority', newPriority);
                                            }}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                            {priority}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Type</h4>
                            <div className="space-y-2">
                                {['bug', 'task', 'story', 'epic'].map(type => (
                                    <label key={type} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.type.includes(type)}
                                            onChange={(e) => {
                                                const newType = e.target.checked
                                                    ? [...filters.type, type]
                                                    : filters.type.filter(t => t !== type);
                                                handleFilterChange('type', newType);
                                            }}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                            {type}
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