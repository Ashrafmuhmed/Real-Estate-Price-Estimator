import { LoaderCircle } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <LoaderCircle size={45} className="animate-spin text-white" />

      <p className="mt-4 text-[#111111]">AI is analyzing the property...</p>
    </div>
  );
}
