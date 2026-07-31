import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Coins className="h-6 w-6 text-primary" aria-hidden="true" />
      <span className="text-lg font-extrabold uppercase tracking-tight text-primary">Financy</span>
    </div>
  );
}
