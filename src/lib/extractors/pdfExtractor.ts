// Client-side PDF text extraction. Uses pdfjs-dist with a worker
// fetched from /pdf.worker. Returns concatenated text or null on
// failure. Caps at the first 30 pages so huge PDFs don't lock up.

const MAX_PAGES = 30;

/** Browser-only — call from a 'use client' component. */
export async function extractPdfText(file: File): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    // Dynamic import keeps pdfjs-dist out of the SSR bundle and lets
    // Next pick up the worker file lazily.
    const pdfjs = await import('pdfjs-dist');
    // Use a worker that ships with the package via its CDN entry to
    // avoid having to bundle a separate worker file.
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buffer }).promise;
    const pageCount = Math.min(pdf.numPages, MAX_PAGES);
    const parts: string[] = [];
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .filter(Boolean)
        .join(' ');
      parts.push(text);
    }
    const all = parts.join('\n\n').replace(/\s+/g, ' ').trim();
    return all.length > 0 ? all.slice(0, 8000) : null;
  } catch (err) {
    console.warn('[pdfExtractor] failed', err);
    return null;
  }
}
