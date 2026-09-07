"use client";

import { Printer } from "lucide-react";

export const PrintButton = () => {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest-800 text-white text-sm font-semibold hover:bg-forest-700 transition-colors"
    >
      <Printer className="w-4 h-4" />
      Print / Save as PDF
    </button>
  );
};
