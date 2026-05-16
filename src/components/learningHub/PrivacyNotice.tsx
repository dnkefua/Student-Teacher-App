'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

const CHECKLIST = [
  'Who uploaded this report?',
  'What platform was it from?',
  'Which students were mapped?',
  'Can this import be deleted from Firestore + local cache?',
  'Are there unmapped students that need teacher review?',
  'Is this data safe to use for academic decisions yet?',
];

export function PrivacyNotice() {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-lg border border-[#ffc43b]/20 bg-[#ffc43b]/5 p-4 text-slate-200">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-[#ffe08a]" />
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">Privacy &amp; data handling</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-300">
            <li><span className="font-black text-white">ManageBac remains the school&apos;s system of record.</span> The Learning Data Hub is the analytics layer, not a replacement.</li>
            <li>School-approved imports only. No student passwords. No scraping.</li>
            <li>No third-party API credentials in client-side code. Provider keys live in the server&apos;s environment or Firebase Secret Manager.</li>
            <li>Teacher or admin verifies every student mapping before analytics are used for academic decisions.</li>
            <li>Each import is audit-logged. Deleting an import removes every event it created from Firestore (when configured) and the local cache.</li>
            <li>Student mode only ever shows the signed-in student&apos;s own data — never other students, raw imports, or roster mappings.</li>
          </ul>
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-[#ffe08a] transition hover:text-white"
          >
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            Data governance checklist
          </button>
          {open ? (
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {CHECKLIST.map((item) => (
                <li key={item} className="rounded-md border border-[#ffc43b]/20 bg-[#ffc43b]/5 px-2 py-1.5 text-[11px] leading-5 text-slate-200">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
