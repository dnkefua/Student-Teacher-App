'use client';

import { ShieldCheck } from 'lucide-react';

export function PrivacyNotice() {
  return (
    <section className="rounded-lg border border-[#ffc43b]/20 bg-[#ffc43b]/5 p-4 text-slate-200">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-[#ffe08a]" />
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">Privacy &amp; data handling</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-300">
            <li>Only import school-approved reports. Do not upload unnecessary personal data.</li>
            <li>Teacher or admin verifies every student mapping before analytics are used.</li>
            <li>API keys and credentials must never be stored in client-side code.</li>
            <li>Each import is audit-logged; teachers can delete the import and every event it created.</li>
            <li>Student mode only ever shows the signed-in student&apos;s own data.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
