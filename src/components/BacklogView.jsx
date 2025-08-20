import React, { useState, useMemo } from 'react';
import {
    FileText, Plus, Search, Filter, ChevronDown, GripVertical,
    Target, Bookmark, Bug, Zap, CheckCircle, ArrowUp, ArrowDown,
    Minus, Clock, User, Calendar, MoreVertical, Eye, Edit3,
    Trash2, Archive, Star, MessageCircle, Paperclip, Users
} from 'lucide-react';

const BacklogView = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSprint, setSelectedSprint] = useState('backlog');
    const [selectedItems, setSelectedItems] = useState([]);
    const [groupBy, setGroupBy] = useState('epic');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        priority: [],
        type: [],
        assignee: []
    });

    // Dummy data based on the schema
    const backlogData = {
        sprints: [
            {
                id: 'sprint-1',
                name: 'Sprint 1 - Authentication',
                status: 'active',
                startDate: '2024-08-15',
                endDate: '2024-08-29',
                capacity: 40,
                commitment: 35
            },
            {
                id: 'sprint-2',
                name: 'Sprint 2 - Dashboard Features',
                status: 'planning',
                startDate: '2024-08-30',
                endDate: '2024-09-13',
                capacity: 42,
                commitment: 0
            }
        ],
        epics: [
            {
                id: 'epic-1',
                title: 'User Management System',
                status: 'in-progress',
                progress: 65,
                totalStoryPoints: 34,
                completedStoryPoints: 22
            },
            {
                id: 'epic-2',
                title: 'Analytics Dashboard',
                status: 'to-do',
                progress: 10,
                totalStoryPoints: 28,
                completedStoryPoints: 3
            },
            {
                id: 'epic-3',
                title: 'Mobile Optimization',
                status: 'to-do',
                progress: 0,
                totalStoryPoints: 21,
                completedStoryPoints: 0
            }
        ],
        tickets: [
            {
                _id: '1',
                id: 'PROJ-101',
                title: 'Implement user registration flow',
                description: 'Create a comprehensive user registration system with email verification',
                type: 'story',
                priority: 'high',
                status: 'in-progress',
                assignee: 'Sarah Chen',
                reporter: 'John Doe',
                storyPoints: 8,
                epicId: 'epic-1',
                sprintId: 'sprint-1',
                tags: ['frontend', 'backend'],
                dueDate: '2024-08-25',
                createdAt: '2024-08-10',
                comments: [
                    { author: 'Mike Wilson', content: 'Need to clarify validation rules', createdAt: '2024-08-11' },
                    { author: 'Sarah Chen', content: 'Working on the frontend components', createdAt: '2024-08-12' }
                ],
                attachments: [
                    { fileName: 'wireframes.pdf', fileSize: 2048000 }
                ],
                subtasks: [
                    { title: 'Design registration form', completed: true },
                    { title: 'Implement backend validation', completed: true },
                    { title: 'Add email verification', completed: false },
                    { title: 'Write unit tests', completed: false }
                ]
            },
            {
                _id: '2',
                id: 'PROJ-102',
                title: 'Fix login page responsive design',
                description: 'Login form breaks on mobile devices below 375px width',
                type: 'bug',
                priority: 'medium',
                status: 'to-do',
                assignee: 'Alex Johnson',
                reporter: 'QA Team',
                storyPoints: 3,
                epicId: 'epic-1',
                sprintId: null,
                tags: ['frontend', 'mobile', 'css'],
                createdAt: '2024-08-09',
                comments: [],
                attachments: [
                    { fileName: 'bug-screenshot.png', fileSize: 512000 }
                ],
                subtasks: []
            },
            {
                _id: '3',
                id: 'PROJ-103',
                title: 'Create analytics dashboard layout',
                description: 'Design and implement the main dashboard with key metrics widgets',
                type: 'story',
                priority: 'highest',
                status: 'to-do',
                assignee: 'Emily Rodriguez',
                reporter: 'Product Manager',
                storyPoints: 13,
                epicId: 'epic-2',
                sprintId: null,
                tags: ['frontend', 'dashboard', 'charts'],
                dueDate: '2024-09-05',
                createdAt: '2024-08-08',
                comments: [
                    { author: 'Design Team', content: 'Mockups ready for review', createdAt: '2024-08-09' }
                ],
                attachments: [
                    { fileName: 'dashboard-mockups.figma', fileSize: 3048000 },
                    { fileName: 'requirements.docx', fileSize: 1024000 }
                ],
                subtasks: [
                    { title: 'Create responsive grid layout', completed: false },
                    { title: 'Implement metric cards', completed: false },
                    { title: 'Add chart components', completed: false }
                ]
            },
            {
                _id: '4',
                id: 'PROJ-104',
                title: 'Optimize mobile navigation menu',
                description: 'Current mobile menu is slow and has poor UX',
                type: 'task',
                priority: 'low',
                status: 'to-do',
                assignee: null,
                reporter: 'UX Team',
                storyPoints: 5,
                epicId: 'epic-3',
                sprintId: null,
                tags: ['mobile', 'performance', 'ux'],
                createdAt: '2024-08-07',
                comments: [],
                attachments: [],
                subtasks: [
                    { title: 'Audit current performance', completed: false },
                    { title: 'Redesign menu structure', completed: false }
                ]
            },
            {
                _id: '5',
                id: 'PROJ-105',
                title: 'User profile management',
                description: 'Allow users to update their profile information and preferences',
                type: 'story',
                priority: 'medium',
                status: 'code-review',
                assignee: 'David Kim',
                reporter: 'Product Manager',
                storyPoints: 8,
                epicId: 'epic-1',
                sprintId: 'sprint-1',
                tags: ['frontend', 'backend', 'profile'],
                dueDate: '2024-08-28',
                createdAt: '2024-08-06',
                comments: [
                    { author: 'David Kim', content: 'PR ready for review', createdAt: '2024-08-13' }
                ],
                attachments: [],
                subtasks: [
                    { title: 'Profile form components', completed: true },
                    { title: 'Backend API endpoints', completed: true },
                    { title: 'Avatar upload functionality', completed: true },
                    { title: 'Unit tests', completed: false }
                ]
            },
            {
                _id: '6',
                id: 'PROJ-106',
                title: 'Implement data visualization charts',
                description: 'Add interactive charts for analytics dashboard using Chart.js',
                type: 'story',
                priority: 'high',
                status: 'to-do',
                assignee: 'Lisa Wang',
                reporter: 'Data Team',
                storyPoints: 13,
                epicId: 'epic-2',
                sprintId: 'sprint-2',
                tags: ['frontend', 'charts', 'data-viz'],
                createdAt: '2024-08-05',
                comments: [],
                attachments: [
                    { fileName: 'chart-requirements.pdf', fileSize: 1536000 }
                ],
                subtasks: []
            }
        ]
    };

    const getTypeIcon = (type) => {
        const icons = {
            story: Bookmark,
            task: CheckCircle,
            bug: Bug,
            epic: Zap,
            subtask: Target
        };
        const Icon = icons[type] || Target;
        return <Icon className="w-4 h-4" />;
    };

    const getPriorityIcon = (priority) => {
        const configs = {
            highest: { icon: ArrowUp, color: 'text-red-500' },
            high: { icon: ArrowUp, color: 'text-orange-500' },
            medium: { icon: Minus, color: 'text-yellow-500' },
            low: { icon: ArrowDown, color: 'text-green-500' },
            lowest: { icon: ArrowDown, color: 'text-blue-500' }
        };
        const config = configs[priority] || configs.medium;
        const Icon = config.icon;
        return <Icon className={`w-4 h-4 ${config.color}`} />;
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            'to-do': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
            'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'code-review': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            'testing': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            'done': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'blocked': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        };
        return colors[status] || colors['to-do'];
    };

    const filteredTickets = useMemo(() => {
        let filtered = backlogData.tickets;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(ticket =>
                ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply priority filter
        if (filters.priority.length > 0) {
            filtered = filtered.filter(ticket => filters.priority.includes(ticket.priority));
        }

        // Apply type filter
        if (filters.type.length > 0) {
            filtered = filtered.filter(ticket => filters.type.includes(ticket.type));
        }

        // Apply assignee filter
        if (filters.assignee.length > 0) {
            filtered = filtered.filter(ticket =>
                ticket.assignee && filters.assignee.includes(ticket.assignee)
            );
        }

        return filtered;
    }, [searchQuery, filters]);

    const groupedTickets = useMemo(() => {
        if (groupBy === 'epic') {
            const grouped = {};
            backlogData.epics.forEach(epic => {
                grouped[epic.id] = {
                    ...epic,
                    tickets: filteredTickets.filter(ticket => ticket.epicId === epic.id)
                };
            });

            // Add ungrouped tickets
            const ungroupedTickets = filteredTickets.filter(ticket => !ticket.epicId);
            if (ungroupedTickets.length > 0) {
                grouped['ungrouped'] = {
                    id: 'ungrouped',
                    title: 'No Epic',
                    tickets: ungroupedTickets
                };
            }

            return grouped;
        } else if (groupBy === 'sprint') {
            const grouped = {};

            // Add sprint groups
            backlogData.sprints.forEach(sprint => {
                grouped[sprint.id] = {
                    ...sprint,
                    tickets: filteredTickets.filter(ticket => ticket.sprintId === sprint.id)
                };
            });

            // Add backlog (unassigned to sprint)
            const backlogTickets = filteredTickets.filter(ticket => !ticket.sprintId);
            grouped['backlog'] = {
                id: 'backlog',
                name: 'Product Backlog',
                tickets: backlogTickets
            };

            return grouped;
        }

        return { all: { tickets: filteredTickets } };
    }, [filteredTickets, groupBy]);

    const handleSelectItem = (ticketId) => {
        setSelectedItems(prev =>
            prev.includes(ticketId)
                ? prev.filter(id => id !== ticketId)
                : [...prev, ticketId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === filteredTickets.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredTickets.map(t => t._id));
        }
    };

    const TicketCard = ({ ticket }) => (
        <div
            key={ticket._id}
            className={`
                group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer
                ${selectedItems.includes(ticket._id) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
            `}
            onClick={() => handleSelectItem(ticket._id)}
        >
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={selectedItems.includes(ticket._id)}
                    onChange={() => handleSelectItem(ticket._id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <GripVertical className="w-4 h-4 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-300">
                            {getTypeIcon(ticket.type)}
                        </span>
                        <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                        {getPriorityIcon(ticket.priority)}
                        <span className={`
                            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${getStatusBadgeColor(ticket.status)}
                        `}>
                            {ticket.status.replace('-', ' ').toUpperCase()}
                        </span>
                        {ticket.storyPoints && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <Target className="w-3 h-3" />
                                {ticket.storyPoints}
                            </span>
                        )}
                    </div>

                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                        {ticket.title}
                    </h4>

                    {ticket.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {ticket.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {ticket.assignee ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                        {ticket.assignee.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {ticket.assignee}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    Unassigned
                                </span>
                            )}

                            {ticket.dueDate && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(ticket.dueDate).toLocaleDateString()}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {ticket.comments.length > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                    <MessageCircle className="w-3 h-3" />
                                    {ticket.comments.length}
                                </span>
                            )}

                            {ticket.attachments.length > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                    <Paperclip className="w-3 h-3" />
                                    {ticket.attachments.length}
                                </span>
                            )}

                            {ticket.subtasks.length > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                    <CheckCircle className="w-3 h-3" />
                                    {ticket.subtasks.filter(st => st.completed).length}/{ticket.subtasks.length}
                                </span>
                            )}

                            <button
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {ticket.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                            {ticket.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Product Backlog</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Plan and prioritize your team's work
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        Create Issue
                    </button>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search backlog..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm w-64"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value)}
                            className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm"
                        >
                            <option value="epic">Group by Epic</option>
                            <option value="sprint">Group by Sprint</option>
                            <option value="none">No Grouping</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                            ${showFilters ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}
                        `}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {(filters.priority.length + filters.type.length + filters.assignee.length) > 0 && (
                            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {filters.priority.length + filters.type.length + filters.assignee.length}
                            </span>
                        )}
                    </button>

                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={handleSelectAll}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                            {selectedItems.length === filteredTickets.length ? 'Deselect All' : 'Select All'}
                        </button>
                        {selectedItems.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedItems.length} selected
                                </span>
                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                    <Archive className="w-4 h-4 text-gray-500" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                    <Trash2 className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {Object.entries(groupedTickets).map(([groupKey, group]) => (
                    <div key={groupKey} className="mb-8">
                        {/* Group Header */}
                        {groupBy !== 'none' && (
                            <div className="mb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {group.name || group.title || 'Ungrouped'}
                                    </h2>
                                    {group.status && (
                                        <span className={`
                                            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                            ${group.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
                                        `}>
                                            {group.status}
                                        </span>
                                    )}
                                    <span className="text-sm text-gray-500">
                                        {group.tickets.length} items
                                    </span>
                                </div>

                                {group.progress !== undefined && (
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${group.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {group.progress}% complete
                                        </span>
                                        {group.totalStoryPoints && (
                                            <span className="text-sm text-gray-500">
                                                {group.completedStoryPoints || 0}/{group.totalStoryPoints} SP
                                            </span>
                                        )}
                                    </div>
                                )}

                                {group.startDate && (
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            {new Date(group.startDate).toLocaleDateString()} - {new Date(group.endDate).toLocaleDateString()}
                                        </span>
                                        {group.capacity && (
                                            <span>
                                                <Users className="w-4 h-4 inline mr-1" />
                                                {group.commitment}/{group.capacity} hours
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tickets */}
                        <div className="space-y-3">
                            {group.tickets.length > 0 ? (
                                group.tickets.map(ticket => (
                                    <TicketCard key={ticket._id} ticket={ticket} />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No tickets in this group</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredTickets.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No tickets found</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {searchQuery ? 'Try adjusting your search or filters' : 'Create your first ticket to get started'}
                        </p>
                    </div>
                )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-6">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Priority</h4>
                            <div className="space-y-2">
                                {['highest', 'high', 'medium', 'low', 'lowest'].map(priority => (
                                    <label key={priority} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.priority.includes(priority)}
                                            onChange={(e) => {
                                                const newPriorities = e.target.checked
                                                    ? [...filters.priority, priority]
                                                    : filters.priority.filter(p => p !== priority);
                                                setFilters(prev => ({ ...prev, priority: newPriorities }));
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                                {['story', 'task', 'bug', 'epic'].map(type => (
                                    <label key={type} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.type.includes(type)}
                                            onChange={(e) => {
                                                const newTypes = e.target.checked
                                                    ? [...filters.type, type]
                                                    : filters.type.filter(t => t !== type);
                                                setFilters(prev => ({ ...prev, type: newTypes }));
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize flex items-center gap-1">
                                            {getTypeIcon(type)}
                                            {type}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Assignee</h4>
                            <div className="space-y-2">
                                {['Sarah Chen', 'Alex Johnson', 'Emily Rodriguez', 'David Kim', 'Lisa Wang'].map(assignee => (
                                    <label key={assignee} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.assignee.includes(assignee)}
                                            onChange={(e) => {
                                                const newAssignees = e.target.checked
                                                    ? [...filters.assignee, assignee]
                                                    : filters.assignee.filter(a => a !== assignee);
                                                setFilters(prev => ({ ...prev, assignee: newAssignees }));
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                                                {assignee.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {assignee}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.assignee.includes('unassigned')}
                                        onChange={(e) => {
                                            const newAssignees = e.target.checked
                                                ? [...filters.assignee, 'unassigned']
                                                : filters.assignee.filter(a => a !== 'unassigned');
                                            setFilters(prev => ({ ...prev, assignee: newAssignees }));
                                        }}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Unassigned
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setFilters({ priority: [], type: [], assignee: [] })}
                            className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BacklogView;