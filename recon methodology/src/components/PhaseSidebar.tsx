import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import type { ReconPhase } from "@/data/reconPhases";

interface PhaseSidebarProps {
  phases: ReconPhase[];
  activePhase: number;
  completedPhases: Set<number>;
  onPhaseClick: (id: number) => void;
}

const PhaseSidebar = ({ phases, activePhase, completedPhases, onPhaseClick }: PhaseSidebarProps) => {
  return (
    <nav className="w-64 shrink-0 border-r border-border bg-card/50 overflow-y-auto hidden lg:block">
      <div className="p-4 border-b border-border">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Recon Phases</h2>
      </div>
      <ul className="p-2 space-y-0.5">
        {phases.map((phase) => {
          const isActive = activePhase === phase.id;
          const isCompleted = completedPhases.has(phase.id);
          return (
            <li key={phase.id}>
              <button
                onClick={() => onPhaseClick(phase.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary neon-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <Circle className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                )}
                <span className="mr-1 text-xs opacity-50">{String(phase.id).padStart(2, "0")}</span>
                <span className="truncate">{phase.shortTitle}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default PhaseSidebar;
