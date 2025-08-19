import React, { useState, useRef } from 'react';
import { Plus, MoreHorizontal, Filter, Users, BarChart3, Eye, EyeOff, Settings } from 'lucide-react';
import Card from './Card';

const Column = ({
    column,
    onDragOver,
    onDrop,
    onDragStart,
    onCardClick,
    onCreateIssue,
    selectedItems = [],
    onSelectItem,
    isDragTarget = false,
    showColumnActions = true
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        assignee: '',
        priority: '',
        type: ''
    });
    const [isDragOver, setIsDragOver] = useState(false);
    const dropRef = useRef(null);

    const stats = {
        total: column.items.length,
        byPriority: column.items.reduce((acc, item) => {
            acc[item.priority] = (acc[item.priority] || 0) + 1;
            return acc;
        }, {}),
        byType: column.items.reduce((acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
        }, {}),
        storyPoints: column.items.reduce((sum, item) => sum + (item.storyPoints || 0), 0),
        overdue: column.items.filter(item => {
            if (!item.dueDate) return false;
            return new Date(item.dueDate) < new Date();
        }).length
    };

    const filteredItems = column.items.filter(item => {
        if (localFilters.assignee && item.assignee !== localFilters.assignee) return false;
        if (localFilters.priority && item.priority !== localFilters.priority) return false;
        if (localFilters.type && item.type !== localFilters.type) return false;
        return true;
    });

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
        onDragOver(e);
    };

    const handleDragLeave = (e) => {
        if (!dropRef.current?.contains(e.relatedTarget)) {
            setIsDragOver(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        onDrop(e, column.id);
    };

    const getColumnColor = (status) => {
        const colors = {
            'to-do': 'bg-gray-50 dark:bg-gray-800',
            'in-progress': 'bg-blue-50 dark:bg-blue-900/20',
            'code-review': 'bg-yellow-50 dark:bg-yellow-900/20',
            'testing': 'bg-orange-50 dark:bg-orange-900/20',
            'done': 'bg-green-50 dark:bg-green-900/20',
            'blocked': 'bg-red-50 dark:bg-red-900/20'
        };
        return colors[status] || 'bg-gray-50 dark:bg-gray-800';
    };

    const getWipLimitStatus = () => {
        if (!column.wipLimit) return null;

        const percentage = (stats.total / column.wipLimit) * 100;
        if (percentage >= 100) return 'exceeded';
        if (percentage >= 80) return 'warning';
        return 'normal';
    };

    const wipStatus = getWipLimitStatus();

    return (
        <div
            ref={dropRef}
            className={`
                flex-shrink-0 w-80 rounded-lg flex flex-col transition-all duration-200
                ${getColumnColor(column.id)}
                ${isDragOver ? 'ring-2 ring-blue-500 ring-opacity-50 scale-105' : ''}
                ${isDragTarget ? 'ring-2 ring-blue-300' : ''}
                ${isCollapsed ? 'w-16' : 'w-80'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Column Header */}
            <div className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-xs font-semibold text-gray-600 dark:text-gray-300 
                                     uppercase tracking-wide hover:text-gray-800 dark:hover:text-gray-100
                                     transition-colors"
                        >
                            {isCollapsed ? column.name.slice(0, 2) : column.name}
                        </button>

                        {/* WIP Limit indicator */}
                        {column.wipLimit && !isCollapsed && (
                            <div className={`
                                text-xs px-2 py-0.5 rounded-full font-medium
                                ${wipStatus === 'exceeded' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    wipStatus === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
                            `}>
                                {stats.total}/{column.wipLimit}
                            </div>
                        )}
                    </div>

                    {!isCollapsed && showColumnActions && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onCreateIssue(column.id)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
                            >
                                <Plus className="w-4 h-4" />
                            </button>

                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {!isCollapsed && (
                    <>
                        {/* Column stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <span>{stats.total} issue{stats.total !== 1 ? 's' : ''}</span>
                            {stats.storyPoints > 0 && (
                                <span>{stats.storyPoints} pts</span>
                            )}
                            {stats.overdue > 0 && (
                                <span className="text-red-500 font-medium">{stats.overdue} overdue</span>
                            )}
                        </div>

                        {/* Quick stats bar */}
                        <div className="flex gap-1 mb-3">
                            {Object.entries(stats.byPriority).map(([priority, count]) => {
                                const colors = {
                                    highest: 'bg-red-500',
                                    high: 'bg-orange-500',
                                    medium: 'bg-yellow-500',
                                    low: 'bg-green-500',
                                    lowest: 'bg-blue-500'
                                };
                                return (
                                    <div
                                        key={priority}
                                        className={`h-1 rounded ${colors[priority]}`}
                                        style={{ flex: count }}
                                        title={`${priority}: ${count}`}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {!isCollapsed && (
                <div
                    className={`
                                px-4 pb-4 space-y-3
                                ${filteredItems.length > 0
                            ? "flex-1 overflow-y-auto max-h-[calc(100vh-280px)]"
                            : ""} 
                                `}
                >
                    {filteredItems.length > 0 && (
                        filteredItems.map((item) => (
                            <Card
                                key={item._id}
                                item={item}
                                onDragStart={onDragStart}
                                onClick={onCardClick}
                                isSelected={selectedItems.includes(item._id)}
                                onSelect={onSelectItem}
                                showDetails={true}
                            />
                        ))
                    )}

                    <button
                        onClick={() => onCreateIssue(column.id)}
                        className="w-full flex items-center justify-center gap-2 p-3 
                                    border-2 border-dashed border-gray-300 dark:border-gray-600 
                                    rounded-lg text-gray-500 dark:text-gray-400 
                                    hover:border-blue-300 dark:hover:border-blue-400 
                                    hover:text-blue-600 dark:hover:text-blue-400 
                                    hover:bg-blue-50 dark:hover:bg-blue-900/20 
                                    transition-all duration-200 text-sm font-medium group"
                    >
                        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Add</span>
                    </button>

                </div>
            )}


            {/* Collapsed state */}
            {isCollapsed && (
                <div className="flex-1 p-2">
                    <div className="text-center">
                        <div className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-1">
                            {stats.total}
                        </div>
                        <div className="space-y-1">
                            {filteredItems.slice(0, 3).map((item) => (
                                <div
                                    key={item._id}
                                    className="w-8 h-8 bg-white dark:bg-gray-600 rounded border 
                                             border-gray-200 dark:border-gray-500 cursor-pointer
                                             hover:scale-110 transition-transform"
                                    onClick={() => onCardClick(item)}
                                    title={item.title}
                                />
                            ))}
                            {stats.total > 3 && (
                                <div className="text-xs text-gray-400">+{stats.total - 3}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Drop indicator */}
            {isDragOver && (
                <div className="absolute inset-0 border-2 border-blue-500 border-dashed rounded-lg 
                              bg-blue-50 dark:bg-blue-900/20 pointer-events-none" />
            )}
        </div>
    );
};

export default Column;