import React, { useState, useRef } from 'react';
import {
    Plus, MoreHorizontal, Filter, Users, Eye, Settings,
    ChevronDown, ChevronRight, TrendingUp, AlertCircle, Check, X
} from 'lucide-react';
import Card from './Card';

const Column = ({
    column,
    onDragOver,
    onDrop,
    onDragStart,
    onCardClick,
    onCreateIssue,
    onUpdateColumn, // New prop for updating column name
    selectedItems = [],
    onSelectItem,
    isDragTarget = false,
    showColumnActions = true,
    dragOverItem = null
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editingName, setEditingName] = useState(column.name);
    const [localFilters, setLocalFilters] = useState({
        assignee: '',
        priority: '',
        type: ''
    });
    const [isDragOver, setIsDragOver] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const dropRef = useRef(null);
    const nameInputRef = useRef(null);

    const stats = {
        total: column.items.length,
        storyPoints: column.items.reduce((sum, item) => sum + (item.storyPoints || 0), 0),
        overdue: column.items.filter(item => {
            if (!item.dueDate) return false;
            return new Date(item.dueDate) < new Date();
        }).length,
        completedToday: column.items.filter(item => {
            if (item.status !== 'done') return false;
            const today = new Date().toDateString();
            return item.completedAt && new Date(item.completedAt).toDateString() === today;
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

    const handleNameEdit = () => {
        setIsEditingName(true);
        setEditingName(column.name);
        setTimeout(() => nameInputRef.current?.focus(), 0);
    };

    const handleNameSave = () => {
        if (editingName.trim() && editingName !== column.name) {
            onUpdateColumn && onUpdateColumn(column.id, { name: editingName.trim() });
        }
        setIsEditingName(false);
        setEditingName(column.name);
    };

    const handleNameCancel = () => {
        setIsEditingName(false);
        setEditingName(column.name);
    };

    const handleNameKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleNameSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleNameCancel();
        }
    };

    const getWipLimitStatus = () => {
        if (!column.wipLimit) return null;
        const percentage = (stats.total / column.wipLimit) * 100;
        if (percentage >= 100) return 'exceeded';
        if (percentage >= 80) return 'warning';
        return 'normal';
    };

    const wipStatus = getWipLimitStatus();
    const uniqueAssignees = [...new Set(column.items.map(item => item.assignee).filter(Boolean))];
    const uniquePriorities = [...new Set(column.items.map(item => item.priority))];
    const uniqueTypes = [...new Set(column.items.map(item => item.type))];

    return (
        <div
            ref={dropRef}
            className={`
                flex-shrink-0 rounded-lg flex flex-col transition-all duration-200
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                ${isDragOver ? 'ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''}
                ${isDragTarget ? 'ring-1 ring-blue-300' : ''}
                ${isCollapsed ? 'w-16' : 'w-80'} 
                min-h-96
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Column Header - Separated section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                            {/* Editable Column Name */}
                            {isEditingName && !isCollapsed ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        ref={nameInputRef}
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={handleNameKeyDown}
                                        onBlur={handleNameSave}
                                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded px-2 py-1 flex-1 min-w-0"
                                        maxLength={50}
                                    />
                                    <button
                                        onClick={handleNameSave}
                                        className="p-1 rounded text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                                    >
                                        <Check className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={handleNameCancel}
                                        className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleNameEdit}
                                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-left"
                                    disabled={isCollapsed}
                                >
                                    {isCollapsed ? column.name.slice(0, 2) : column.name}
                                </button>
                            )}

                            {/* Item count */}
                            <div className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full font-medium">
                                {stats.total}
                            </div>

                            {/* WIP Limit Badge */}
                            {column.wipLimit && !isCollapsed && wipStatus && (
                                <div className={`
                                    text-xs px-2 py-0.5 rounded-full font-medium
                                    ${wipStatus === 'exceeded'
                                        ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                        : wipStatus === 'warning'
                                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                            : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}
                                `}>
                                    {stats.total}/{column.wipLimit}
                                </div>
                            )}
                        </div>

                        {!isCollapsed && showColumnActions && !isEditingName && (
                            <div className="flex items-center gap-1 ml-2">
                                <button
                                    onClick={() => onCreateIssue(column.id)}
                                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    title="Add task"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>

                                <button
                                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    title="More options"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Simple Stats for non-collapsed */}
                    {!isCollapsed && (stats.overdue > 0 || stats.completedToday > 0) && (
                        <div className="flex items-center gap-3 text-xs">
                            {stats.completedToday > 0 && (
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{stats.completedToday} completed today</span>
                                </div>
                            )}
                            {stats.overdue > 0 && (
                                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{stats.overdue} overdue</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area - Separated section */}
            {!isCollapsed && (
                <div className="flex-1 p-4 min-h-0 bg-white dark:bg-gray-800">
                    <div className="space-y-3 max-h-full overflow-y-auto custom-scrollbar">
                        {filteredItems.map((item) => (
                            <Card
                                key={item._id}
                                item={item}
                                onDragStart={onDragStart}
                                onClick={onCardClick}
                                isSelected={selectedItems.includes(item._id)}
                                onSelect={onSelectItem}
                                showDetails={true}
                                isDragging={dragOverItem === item._id}
                            />
                        ))}

                        {/* Add Item Button */}
                        <button
                            onClick={() => onCreateIssue(column.id)}
                            className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add task</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Collapsed State */}
            {isCollapsed && (
                <div className="flex-1 p-3 flex flex-col items-center bg-white dark:bg-gray-800">
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="text-center mb-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors w-full"
                    >
                        <div className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-1">
                            {stats.total}
                        </div>
                        <div className="w-6 h-0.5 bg-gray-400 rounded-full mx-auto" />
                    </button>

                    <div className="space-y-1 flex-1 w-full">
                        {filteredItems.slice(0, 6).map((item, index) => (
                            <div
                                key={item._id}
                                className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-sm cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                onClick={() => onCardClick(item)}
                                title={item.title}
                            />
                        ))}

                        {stats.total > 6 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
                                +{stats.total - 6}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => onCreateIssue(column.id)}
                        className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center mt-3 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Column;