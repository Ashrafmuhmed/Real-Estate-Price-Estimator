import { LoaderCircle } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <LoaderCircle size={45} className="animate-spin text-cyan-400" />

      <p className="mt-4 text-slate-400">AI is analyzing the property...</p>
    </div>
  );
}
