/** @format */

import React, { useState, useMemo } from "react";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";
import { FiSearch, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

export interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  actionsLabel?: string;
}

export default function DataTable<T extends { id?: string }>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Rechercher...",
  searchKeys,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = "Aucune donnée disponible",
  actionsLabel = "Actions"
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filtrage
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((row) => {
      if (searchKeys) {
        return searchKeys.some((key) => {
          const value = row[key];
          return value && String(value).toLowerCase().includes(lowerSearchTerm);
        });
      }
      // Recherche par défaut sur tous les champs affichés
      return columns.some((column) => {
        const value = column.accessor(row);
        return value && String(value).toLowerCase().includes(lowerSearchTerm);
      });
    });
  }, [data, searchTerm, searchKeys, columns]);

  // Tri
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    const column = columns.find((col) => col.id === sortColumn);
    if (!column || !column.sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = String(column.accessor(a) || "").toLowerCase();
      const bValue = String(column.accessor(b) || "").toLowerCase();

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });
  }, [filteredData, sortColumn, sortDirection, columns]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column || !column.sortable) return;

    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <Typography variant="body" className="text-gray-600">
          Chargement des données...
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchable && (
        <div className="relative">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    onClick={() => column.sortable && handleSort(column.id)}
                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${
                      column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    } ${column.className || ""}`}>
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && sortColumn === column.id && (
                        <span className="text-primary">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {actionsLabel}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="px-6 py-12 text-center">
                    <Typography variant="body" className="text-gray-500">
                      {searchTerm ? "Aucun résultat trouvé" : emptyMessage}
                    </Typography>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className="hover:bg-gray-50 transition-colors">
                    {columns.map((column) => (
                      <td key={column.id} className={`px-6 py-4 ${column.className || ""}`}>
                        <Typography variant="body" className="text-gray-900">
                          {column.accessor(row)}
                        </Typography>
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {onEdit && (
                            <Button
                              action={() => onEdit(row)}
                              variant="outline"
                              className="px-3 py-1 text-sm">
                              {actionsLabel === "Actions" ? "Voir" : "Modifier"}
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              action={() => onDelete(row)}
                              variant="outline"
                              className="px-3 py-1 text-sm text-red-600 border-red-200 hover:bg-red-50">
                              Supprimer
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Typography variant="body-sm" className="text-gray-700">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, sortedData.length)} sur {sortedData.length}
            </Typography>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
              <FiChevronsLeft size={20} />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
              <FiChevronLeft size={20} />
            </button>
            <Typography variant="body-sm" className="px-4">
              Page {currentPage} sur {totalPages}
            </Typography>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
              <FiChevronRight size={20} />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
              <FiChevronsRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
