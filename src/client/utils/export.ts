/**
 * Export Utilities
 * Export data to Excel, PDF, and CSV formats
 */

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
    key: string;
    label: string;
    width?: number;
}

export interface ExportOptions {
    filename?: string;
    title?: string;
    columns: ExportColumn[];
    data: any[];
}

/**
 * Export data to Excel (XLSX)
 */
export function exportToExcel(options: ExportOptions) {
    const { filename = 'export', title = 'Data Export', columns, data } = options;

    // Prepare data for Excel
    const excelData = data.map((row) => {
        const excelRow: any = {};
        columns.forEach((col) => {
            excelRow[col.label] = row[col.key] || '';
        });
        return excelRow;
    });

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = columns.map((col) => ({
        wch: col.width || 15,
    }));
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, title);

    // Generate Excel file
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Export data to CSV
 */
export function exportToCSV(options: ExportOptions) {
    const { filename = 'export', columns, data } = options;

    // Prepare CSV content
    const headers = columns.map((col) => col.label).join(',');
    const rows = data.map((row) =>
        columns.map((col) => {
            const value = row[col.key] || '';
            // Escape commas and quotes
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Export data to PDF
 */
export function exportToPDF(options: ExportOptions) {
    const { filename = 'export', title = 'Data Export', columns, data } = options;

    // Create PDF document
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 20);

    // Add metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Records: ${data.length}`, 14, 34);

    // Prepare table data
    const headers = columns.map((col) => col.label);
    const rows = data.map((row) =>
        columns.map((col) => String(row[col.key] || ''))
    );

    // Add table
    autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 40,
        theme: 'grid',
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [59, 130, 246], // Blue
            textColor: 255,
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250],
        },
        margin: { top: 40 },
    });

    // Save PDF
    doc.save(`${filename}.pdf`);
}

/**
 * Export data in specified format
 */
export function exportData(
    format: 'excel' | 'csv' | 'pdf',
    options: ExportOptions
) {
    switch (format) {
        case 'excel':
            exportToExcel(options);
            break;
        case 'csv':
            exportToCSV(options);
            break;
        case 'pdf':
            exportToPDF(options);
            break;
        default:
            throw new Error(`Unsupported export format: ${format}`);
    }
}
