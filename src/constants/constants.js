import { BarChart3, Calendar, FileText, Kanban } from "lucide-react";

export const navigation = [
    { id: 'board', label: 'Board', icon: Kanban, shortcut: 'B' },
    { id: 'backlog', label: 'Backlog', icon: FileText, shortcut: 'L' },
    { id: 'timeline', label: 'Timeline', icon: Calendar, shortcut: 'T' },
    { id: 'reports', label: 'Reports', icon: BarChart3, shortcut: 'R' }
];

export const sortOptions = [
    { field: 'createdAt', label: 'Created Date' },
    { field: 'updatedAt', label: 'Updated Date' },
    { field: 'priority', label: 'Priority' },
    { field: 'title', label: 'Title' },
    { field: 'assignee', label: 'Assignee' },
    { field: 'dueDate', label: 'Due Date' },
    { field: 'storyPoints', label: 'Story Points' }
];

export const groupOptions = [
    { value: null, label: 'None' },
    { value: 'assignee', label: 'Assignee' },
    { value: 'priority', label: 'Priority' },
    { value: 'type', label: 'Type' },
    { value: 'reporter', label: 'Reporter' }
];