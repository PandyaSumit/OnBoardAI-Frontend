import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import Card from './Card';

const Column = ({ column, onDragOver, onDrop, onDragStart, onCardClick, onCreateIssue }) => {
    console.log('column: ', column);

    return (
        <div
            className="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.id)}
        >
            <div className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                        {column.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onCreateIssue(column.id)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                            <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                            <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {column.items.length} issue{column.items.length !== 1 ? 's' : ''}
                </div>
            </div>

            <div className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)]">
                {column.items.map((item) => (
                    <Card key={item.id} item={item} onDragStart={onDragStart} onClick={onCardClick} />
                ))}

                <button
                    onClick={() => onCreateIssue(column.id)}
                    className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-sm"
                >
                    + Create issue
                </button>
            </div>
        </div>
    );
};

export default Column;
