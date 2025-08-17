import React from 'react';
import { ArrowUp, ArrowDown, Minus, Bookmark, CheckCircle, Bug, Zap, Target, MessageSquare, MoreHorizontal } from 'lucide-react';

const Card = ({ item, onDragStart, onClick }) => {
    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'highest': return <ArrowUp className="w-3 h-3 text-red-500" />;
            case 'high': return <ArrowUp className="w-3 h-3 text-orange-500" />;
            case 'medium': return <Minus className="w-3 h-3 text-yellow-500" />;
            case 'low': return <ArrowDown className="w-3 h-3 text-green-500" />;
            case 'lowest': return <ArrowDown className="w-3 h-3 text-blue-500" />;
            default: return <Minus className="w-3 h-3 text-gray-500" />;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'story': return <Bookmark className="w-3.5 h-3.5 text-green-500" />;
            case 'task': return <CheckCircle className="w-3.5 h-3.5 text-blue-500" />;
            case 'bug': return <Bug className="w-3.5 h-3.5 text-red-500" />;
            case 'epic': return <Zap className="w-3.5 h-3.5 text-purple-500" />;
            default: return <Target className="w-3.5 h-3.5 text-gray-500" />;
        }
    };

    return (
        <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            onClick={() => onClick(item)}
            className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-3 hover:shadow-md dark:hover:bg-gray-600 transition-all cursor-move group"
        >
            {/* Title */}
            <div className="flex items-start gap-2 mb-2">
                <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(item.type)}
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight flex-1">
                    {item.title}
                </h4>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <MoreHorizontal className="w-3 h-3 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* ID */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-mono">
                {item.id}
            </div>

            {/* Description */}
            {item.description && (
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {item.description}
                </p>
            )}

            {/* Tags */}
            {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs px-2 py-0.5 rounded font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                    {item.tags.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
                            +{item.tags.length - 2}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Priority */}
                    {getPriorityIcon(item.priority)}

                    {/* Story Points */}
                    {item.storyPoints && (
                        <div className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs px-1.5 py-0.5 rounded font-medium">
                            {item.storyPoints}
                        </div>
                    )}

                    {/* Comments */}
                    {item.comments > 0 && (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <MessageSquare className="w-3 h-3" />
                            <span className="text-xs">{item.comments}</span>
                        </div>
                    )}
                </div>

                {/* Assignee */}
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {item.assignee.split(' ').map(n => n[0]).join('')}
                </div>
            </div>
        </div>
    );
};


export default Card;
