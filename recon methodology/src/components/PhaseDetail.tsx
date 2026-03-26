import { motion } from "framer-motion";
import { CheckCircle2, Lightbulb } from "lucide-react";
import CommandCard from "./CommandCard";
import type { ReconPhase } from "@/data/reconPhases";

interface PhaseDetailProps {
  phase: ReconPhase;
  target: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

const PhaseDetail = ({ phase, target, isCompleted, onToggleComplete }: PhaseDetailProps) => {
  return (
    <motion.div
      key={phase.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{phase.icon}</span>
            <h2 className="text-xl font-semibold text-foreground">
              <span className="text-primary mr-2 text-sm font-mono">
                {String(phase.id).padStart(2, "0")}
              </span>
              {phase.title}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {phase.description}
          </p>
        </div>
        <button
          onClick={onToggleComplete}
          className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            isCompleted
              ? "bg-primary/20 text-primary neon-border"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {isCompleted ? "Done" : "Mark Done"}
        </button>
      </div>

      {/* Commands */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-accent font-semibold">
          Commands
        </h3>
        <div className="grid gap-2">
          {phase.commands.map((cmd, i) => (
            <CommandCard
              key={i}
              description={cmd.description}
              command={cmd.command}
              target={target}
            />
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-accent font-semibold flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5" />
          Tips
        </h3>
        <ul className="space-y-2">
          {phase.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-1">›</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default PhaseDetail;
