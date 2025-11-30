/**
 * Advanced Data Table with Filtering, Sorting, and Search
 * Reusable table component with advanced features
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    SortAsc,
    SortDesc,
    ChevronLeft,
    ChevronRight,
    Download,
    Trash2,
    Edit,
    Eye,
    MoreVertical,
    X,
} from 'lucide-react';

export interface Column<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
    width?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchable?: boolean;
    searchPlaceholder?: string;
    filterable?: boolean;
    sortable?: boolean;
    paginated?: boolean;
    pageSize?: number;
    onRowClick?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onView?: (row: T) => void;
    bulkActions?: boolean;
    onBulkDelete?: (rows: T[]) => void;
    emptyMessage?: string;
    className?: string;
}

export function DataTable<T extends { id?: string | number }>({
    data,
    columns,
    searchable = true,
    searchPlaceholder = 'Search...',
    filterable = true,
    sortable = true,
    paginated = true,
    pageSize = 10,
    onRowClick,
    onEdit,
    onDelete,
    onView,
    bulkActions = false,
    onBulkDelete,
    emptyMessage = 'No data available',
    className = '',
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [showFilters, setShowFilters] = useState(false);

    // Search
    const searchedData = useMemo(() => {
        if (!searchQuery) return data;

        return data.filter((row) =>
            columns.some((column) => {
                const value = row[column.key as keyof T];
                return String(value).toLowerCase().includes(searchQuery.toLowerCase());
            })
        );
    }, [data, searchQuery, columns]);

    // Filter
    const filteredData = useMemo(() => {
        let result = searchedData;

        Object.entries(filterValues).forEach(([key, value]) => {
            if (value) {
                result = result.filter((row) => {
                    const rowValue = String(row[key as keyof T]).toLowerCase();
                    return rowValue.includes(value.toLowerCase());
                });
            }
        });

        return result;
    }, [searchedData, filterValues]);

    // Sort
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key as keyof T];
            const bValue = b[sortConfig.key as keyof T];

            if (aValue === bValue) return 0;

            const comparison = aValue < bValue ? -1 : 1;
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }, [filteredData, sortConfig]);

    // Pagination
    const paginatedData = useMemo(() => {
        if (!paginated) return sortedData;

        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize, paginated]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSort = (key: string) => {
        if (!sortable) return;

        setSortConfig((current) => {
            if (!current || current.key !== key) {
                return { key, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            return null;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = paginatedData.map((row) => row.id!).filter(Boolean);
            setSelectedRows(new Set(allIds));
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleSelectRow = (id: string | number, checked: boolean) => {
        const newSelected = new Set(selectedRows);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedRows(newSelected);
    };

    const handleBulkDelete = () => {
        if (onBulkDelete && selectedRows.size > 0) {
            const rowsToDelete = data.filter((row) => row.id && selectedRows.has(row.id));
            onBulkDelete(rowsToDelete);
            setSelectedRows(new Set());
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                {/* Search */}
                {searchable && (
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    {filterable && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${showFilters
                                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Filter size={18} />
                            <span className="hidden sm:inline">Filters</span>
                        </motion.button>
                    )}

                    {bulkActions && selectedRows.size > 0 && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                        >
                            <Trash2 size={18} />
                            Delete ({selectedRows.size})
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {columns
                                    .filter((col) => col.filterable !== false)
                                    .map((column) => (
                                        <div key={String(column.key)}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {column.label}
                                            </label>
                                            <input
                                                type="text"
                                                value={filterValues[String(column.key)] || ''}
                                                onChange={(e) =>
                                                    setFilterValues((prev) => ({
                                                        ...prev,
                                                        [String(column.key)]: e.target.value,
                                                    }))
                                                }
                                                placeholder={`Filter by ${column.label.toLowerCase()}...`}
                                                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                    ))}
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => setFilterValues({})}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            {bulkActions && (
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                                    style={{ width: column.width }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{column.label}</span>
                                        {sortable && column.sortable !== false && (
                                            <button
                                                onClick={() => handleSort(String(column.key))}
                                                className="hover:text-gray-900 dark:hover:text-gray-200"
                                            >
                                                {sortConfig?.key === column.key ? (
                                                    sortConfig.direction === 'asc' ? (
                                                        <SortAsc size={14} />
                                                    ) : (
                                                        <SortDesc size={14} />
                                                    )
                                                ) : (
                                                    <SortAsc size={14} className="opacity-30" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {(onEdit || onDelete || onView) && (
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        <AnimatePresence mode="popLayout">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (bulkActions ? 1 : 0) + (onEdit || onDelete || onView ? 1 : 0)}
                                        className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, rowIndex) => (
                                    <motion.tr
                                        key={row.id || rowIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => onRowClick?.(row)}
                                        className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''
                                            } transition-colors`}
                                    >
                                        {bulkActions && row.id && (
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.has(row.id)}
                                                    onChange={(e) => handleSelectRow(row.id!, e.target.checked)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                        )}
                                        {columns.map((column) => (
                                            <td key={String(column.key)} className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                {column.render
                                                    ? column.render(row[column.key as keyof T], row)
                                                    : String(row[column.key as keyof T] || '-')}
                                            </td>
                                        ))}
                                        {(onEdit || onDelete || onView) && (
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {onView && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onView(row);
                                                            }}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                    )}
                                                    {onEdit && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEdit(row);
                                                            }}
                                                            className="p-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(row);
                                                            }}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {paginated && totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
                        {sortedData.length} results
                    </p>

                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </motion.button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((page) => {
                                    if (totalPages <= 7) return true;
                                    if (page === 1 || page === totalPages) return true;
                                    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                                    return false;
                                })
                                .map((page, index, array) => (
                                    <div key={page} className="flex items-center">
                                        {index > 0 && array[index - 1] !== page - 1 && (
                                            <span className="px-2 text-gray-400">...</span>
                                        )}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {page}
                                        </motion.button>
                                    </div>
                                ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
}
