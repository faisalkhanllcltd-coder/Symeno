// src/lib/csv.ts
import Papa from 'papaparse';

/**
 * Universally unparses JSON arrays into edge-safe CSV strings.
 * Handles escaping commas, quotes, and newlines safely.
 */
export function generateCSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  return Papa.unparse(data, {
    quotes: true, // Forces quotes around fields to prevent injection
    escapeChar: '"',
    header: true,
  });
}
