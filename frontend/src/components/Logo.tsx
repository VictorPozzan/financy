import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="#1F6F43" strokeWidth="2.5" />
        <circle cx="18" cy="18" r="8" fill="#1F6F43" />
      </svg>
      <span className="text-lg font-extrabold uppercase tracking-tight text-foreground">Financy</span>
    </div>
  );
}
