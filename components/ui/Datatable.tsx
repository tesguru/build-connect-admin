import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Search, X, Inbox } from 'lucide-react';

interface Column {
  key: string;
  header: string;
  render?: (row: any) => React.ReactNode;
}

interface RowAction {
  label: string;
  icon: React.ReactNode;
  className?: string;
  onClick: (row: any) => void;
}

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  actions?: RowAction[];
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  showSerialNumber?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchableColumns?: string[];
  filters?: Filter[];
  onFilterChange?: (filters: Record<string, string>) => void;
  onSearchChange?: (search: string) => void;
  serverSide?: boolean;
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable({
  columns,
  data,
  actions,
  rowsPerPageOptions = [5, 8, 10, 20],
  defaultRowsPerPage = 8,
  showSerialNumber = true,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchableColumns = [],
  filters = [],
  onFilterChange,
  onSearchChange,
  serverSide = false,
  totalCount,
  currentPage: externalPage,
  onPageChange,
  onRowsPerPageChange,
  isLoading = false,
  emptyMessage = "No data available",
}: DataTableProps) {
  const [internalPage, setInternalPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const currentPage = serverSide ? (externalPage ?? 1) : internalPage;
  const effectiveRowsPerPage = serverSide ? defaultRowsPerPage : rowsPerPage;
  const columnCount = columns.length + (showSerialNumber ? 1 : 0) + (actions?.length ? 1 : 0);

  // Keep the latest callback without re-triggering the debounce on every render.
  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  });

  useEffect(() => {
    if (!serverSide || !onSearchChangeRef.current) return;
    const timer = setTimeout(() => {
      onSearchChangeRef.current?.(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, serverSide]);

  const filteredData = useMemo(() => {
    if (serverSide) return data;
    let result = [...data];
    if (filters.length > 0) {
      Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
        if (filterValue && filterValue !== 'all') {
          result = result.filter(row => row[filterKey] === filterValue);
        }
      });
    }
    if (showSearch && searchTerm && searchableColumns.length > 0) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(row =>
        searchableColumns.some(col => {
          const val = row[col];
          return val && val.toString().toLowerCase().includes(lowerSearch);
        })
      );
    }
    return result;
  }, [data, activeFilters, searchTerm, searchableColumns, showSearch, filters.length, serverSide]);

  const total = serverSide ? (totalCount ?? 0) : filteredData.length;
  const totalPages = Math.max(1, Math.ceil(total / effectiveRowsPerPage));
  const startIndex = (currentPage - 1) * effectiveRowsPerPage;
  const displayedData = serverSide
    ? data
    : filteredData.slice(startIndex, startIndex + effectiveRowsPerPage);

  useEffect(() => {
    if (!serverSide) setInternalPage(1);
  }, [activeFilters, searchTerm, serverSide]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (serverSide) {
      onPageChange?.(page);
    } else {
      setInternalPage(page);
    }
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    if (serverSide) {
      onRowsPerPageChange?.(newLimit);
      onPageChange?.(1);
    } else {
      setRowsPerPage(newLimit);
      setInternalPage(1);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const hasActiveQuery =
    searchTerm.length > 0 || Object.values(activeFilters).some(v => v && v !== 'all');

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  const rangeStart = total === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + effectiveRowsPerPage, total);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      {/* Search and Filters */}
      {(showSearch || filters.length > 0) && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex flex-wrap gap-3 items-center">
            {showSearch && (
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
            {filters.map((filter) => (
              <div key={filter.key} className="relative flex items-center">
                <select
                  value={activeFilters[filter.key] || 'all'}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  aria-label={filter.label}
                  className="appearance-none pl-3 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 cursor-pointer transition hover:bg-gray-100 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">{filter.label}: All</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
          {hasActiveQuery && total > 0 && (
            <p className="mt-2.5 text-xs text-gray-500">
              {total} {total === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              {showSerialNumber && (
                <th scope="col" className="text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  S/N
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap"
                >
                  {column.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th scope="col" className="text-right py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: Math.min(effectiveRowsPerPage, 6) }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                  {Array.from({ length: columnCount }).map((_, cellIndex) => (
                    <td key={`skeleton-cell-${cellIndex}`} className="py-4 px-4">
                      <div className="h-3.5 rounded-full bg-gray-100" style={{ width: `${55 + ((cellIndex * 13) % 40)}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="group transition-colors hover:bg-blue-50/40"
                >
                  {showSerialNumber && (
                    <td className="py-3.5 px-4 text-sm text-gray-400 font-medium tabular-nums">
                      {startIndex + index + 1}
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="py-3.5 px-4 text-sm text-gray-700">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => action.onClick(row)}
                            className={`inline-flex items-center justify-center rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                              action.className
                                ? action.className
                                : 'p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                            title={action.label}
                            aria-label={action.label}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnCount} className="py-16 px-4">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                      <Inbox className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{emptyMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {hasActiveQuery ? 'Try adjusting your search or filters.' : 'Nothing to show here yet.'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">Rows per page</span>
            <div className="relative">
              <select
                value={effectiveRowsPerPage}
                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                aria-label="Rows per page"
                className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 cursor-pointer transition hover:bg-gray-50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {rowsPerPageOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>
          <span className="text-xs text-gray-500 tabular-nums">
            {total === 0 ? 'No records' : `${rangeStart}–${rangeEnd} of ${total}`}
          </span>
        </div>

        <nav className="flex items-center gap-1.5" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            aria-label="Previous page"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...' || isLoading}
              aria-label={typeof page === 'number' ? `Page ${page}` : undefined}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition ${
                page === currentPage
                  ? 'bg-blue-600 text-white shadow-sm'
                  : page === '...'
                  ? 'text-gray-400 cursor-default'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            aria-label="Next page"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </div>
  );
}
