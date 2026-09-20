/**
 * Utilitário de Exportação Cívica Open Data (CSV e JSON)
 * Gera download client-side instantâneo, compatível com Microsoft Excel e Google Sheets (UTF-8 BOM).
 */

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exporta array de objetos para CSV com suporte a UTF-8 BOM e delimitador ponto e vírgula
 * @param {string} filename Nome do arquivo (ex: 'candidatos_presidente_2026.csv')
 * @param {Array<{ key: string, label: string, formatter?: (val: any, row: any) => string }>} columns
 * @param {Array<object>} data
 */
export function exportToCsv(filename, columns, data) {
  if (!data || data.length === 0) return;

  const headerRow = columns.map((c) => `"${(c.label || c.key).replace(/"/g, '""')}"`).join(';');

  const rows = data.map((row) =>
    columns
      .map((col) => {
        const val = col.formatter ? col.formatter(row[col.key], row) : row[col.key];
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(';')
  );

  // \uFEFF adiciona o Byte Order Mark (BOM) para o Excel reconhecer acentuação em português (UTF-8)
  const csvContent = '\uFEFF' + [headerRow, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

/**
 * Exporta dados estruturados para arquivo JSON
 * @param {string} filename Nome do arquivo (ex: 'dados_candidato.json')
 * @param {any} data
 */
export function exportToJson(filename, data) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
}
