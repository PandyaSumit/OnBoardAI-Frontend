import React, { useState } from 'react';
import {
    ArrowUp, ArrowDown, Minus, Bookmark, CheckCircle, Bug, Zap, Target,
    MessageSquare, MoreHorizontal, Clock, Calendar, User, Flag,
    Eye, Star, Paperclip, GitBranch, CheckSquare
} from 'lucide-react';

const Card = ({
    item,
    onDragStart,
    onClick,
    isSelected = false,
    onSelect,
    showDetails = true,
    compact = false,
    isDragging = false
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const getPriorityIcon = (priority) => {
        const configs = {
            highest: { icon: ArrowUp, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
            high: { icon: ArrowUp, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
            medium: { icon: Minus, color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
            low: { icon: ArrowDown, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
            lowest: { icon: ArrowDown, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' }
        };

        const config = configs[priority] || configs.medium;
        const Icon = config.icon;

        return (
            <div className={`p-1 rounded ${config.bgColor}`}>
                <Icon className={`w-3 h-3 ${config.color}`} />
            </div>
        );
    };

    const getTypeIcon = (type) => {
        const configs = {
            story: { icon: Bookmark, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
            task: { icon: CheckCircle, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
            bug: { icon: Bug, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
            epic: { icon: Zap, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
            subtask: { icon: CheckSquare, color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-900/20' }
        };

        const config = configs[type] || { icon: Target, color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-900/20' };
        const Icon = config.icon;

        return (
            <div className={`p-1 rounded ${config.bgColor}`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
            </div>
        );
    };

    const getStatusColor = (status) => {
        const colors = {
            'to-do': 'border-l-gray-400',
            'in-progress': 'border-l-blue-500',
            'code-review': 'border-l-yellow-500',
            'testing': 'border-l-orange-500',
            'done': 'border-l-green-500',
            'blocked': 'border-l-red-500'
        };
        return colors[status] || 'border-l-gray-400';
    };

    const getAssigneeInitials = (assignee) => {
        if (!assignee) return '?';
        return assignee.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDueDate = (dueDate) => {
        if (!dueDate) return null;

        const date = new Date(dueDate);
        const now = new Date();
        const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

        let className = 'text-gray-500';
        let text = date.toLocaleDateString();

        if (diffDays < 0) {
            className = 'text-red-500';
            text = `Overdue ${Math.abs(diffDays)}d`;
        } else if (diffDays === 0) {
            className = 'text-orange-500';
            text = 'Due today';
        } else if (diffDays <= 3) {
            className = 'text-yellow-500';
            text = `Due in ${diffDays}d`;
        }

        return { className, text };
    };

    const dueInfo = formatDueDate(item.dueDate);
    const isOverdue = dueInfo?.className === 'text-red-500';

    if (compact) {
        return (
            <div
                draggable
                onDragStart={(e) => onDragStart(e, item)}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(item);
                }}
                className={`
                    flex items-center gap-3 p-2 bg-white dark:bg-gray-700 rounded border 
                    border-gray-200 dark:border-gray-600 hover:shadow-sm transition-all cursor-pointer
                    ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''}
                    ${isDragging ? 'opacity-50' : ''}
                    border-l-4 ${getStatusColor(item.status)}
                `}
            >
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                        e.stopPropagation();
                        onSelect?.(item._id);
                    }}
                    className="rounded border-gray-300"
                />

                <div className="flex-shrink-0">
                    {getTypeIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500">{item.id}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {item.title}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {getPriorityIcon(item.priority)}

                    {item.assignee && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {getAssigneeInitials(item.assignee)}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            onClick={(e) => {
                e.stopPropagation();
                onClick(item);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 
                dark:border-gray-600 p-3 hover:shadow-md transition-all cursor-pointer group
                relative overflow-hidden
                ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''}
                ${isDragging ? 'opacity-50 transform rotate-3 scale-105' : ''}
                ${isOverdue ? 'border-l-4 border-l-red-500' : 'border-l-4 ' + getStatusColor(item.status)}
            `}
        >

            {/* Header */}
            <div className="flex items-start gap-2 mb-2">
                <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
                        {item.title}
                    </h4>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                        {item.id}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {/* Watch indicator */}
                    {item.isWatched && (
                        <Eye className="w-3 h-3 text-blue-500" />
                    )}

                    {/* Starred indicator */}
                    {item.isStarred && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    )}

                    {/* More options */}
                    <div className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // Handle more options
                            }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        >
                            <MoreHorizontal className="w-3 h-3 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Description */}
            {item.description && showDetails && (
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                </p>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && showDetails && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 
                                     text-xs px-2 py-0.5 rounded-full font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                    {item.tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
                            +{item.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Progress bar for epics/stories with subtasks */}
            {item.type === 'epic' && item.subtasks && showDetails && (
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{item.subtasks.completed}/{item.subtasks.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${(item.subtasks.completed / item.subtasks.total) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Attachments indicator */}
            {item.attachments && item.attachments > 0 && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-2">
                    <Paperclip className="w-3 h-3" />
                    <span className="text-xs">{item.attachments}</span>
                </div>
            )}

            {/* Git branches */}
            {item.branches && item.branches.length > 0 && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-2">
                    <GitBranch className="w-3 h-3" />
                    <span className="text-xs">{item.branches.length} branch{item.branches.length !== 1 ? 'es' : ''}</span>
                </div>
            )}

            {/* Due date warning */}
            {dueInfo && showDetails && (
                <div className={`flex items-center gap-1 mb-2 ${dueInfo.className}`}>
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs font-medium">{dueInfo.text}</span>
                </div>
            )}

            {/* Blocked indicator */}
            {item.isBlocked && (
                <div className="flex items-center gap-1 text-red-500 mb-2">
                    <Flag className="w-3 h-3" />
                    <span className="text-xs font-medium">Blocked</span>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-2">
                    {/* Priority */}
                    {getPriorityIcon(item.priority)}

                    {/* Story points */}
                    {item.storyPoints && item.storyPoints > 0 && (
                        <div className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 
                                      text-xs px-1.5 py-0.5 rounded font-medium">
                            {item.storyPoints}
                        </div>
                    )}

                    {/* Comments count */}
                    {item.comments > 0 && (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <MessageSquare className="w-3 h-3" />
                            <span className="text-xs">{item.comments}</span>
                        </div>
                    )}

                    {/* Time tracking */}
                    {item.timeSpent && (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">{item.timeSpent}h</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Assignee */}
                    {item.assignee ? (
                        <div
                            className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full 
                                     flex items-center justify-center text-white text-xs font-semibold
                                     ring-2 ring-white dark:ring-gray-700"
                            title={item.assignee}
                        >
                            {getAssigneeInitials(item.assignee)}
                        </div>
                    ) : (
                        <div
                            className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full 
                                     flex items-center justify-center"
                            title="Unassigned"
                        >
                            <User className="w-3 h-3 text-gray-500" />
                        </div>
                    )}

                    {/* Multiple assignees indicator */}
                    {item.assignees && item.assignees.length > 1 && (
                        <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-600 px-1 rounded">
                            +{item.assignees.length - 1}
                        </div>
                    )}
                </div>
            </div>

            {/* Activity indicator */}
            {item.recentActivity && (
                <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
            )}

            {/* Urgency indicator */}
            {item.priority === 'highest' && isOverdue && (
                <div className="absolute inset-0 bg-red-500/5 rounded-lg pointer-events-none" />
            )}

            {/* Hover overlay for quick actions */}
            {isHovered && showDetails && (
                <div className="absolute inset-0 bg-blue-500/5 rounded-lg pointer-events-none" />
            )}
        </div>
    );
};

export default Card;