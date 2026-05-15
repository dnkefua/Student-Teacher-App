// CSV importer — runs in the browser via papaparse.

import Papa from 'papaparse';

export async function parseCsvFile(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: false,
      complete: (results) => {
        resolve(results.data.filter((r) => r && Object.keys(r).length > 0));
      },
      error: (err) => reject(err),
    });
  });
}
