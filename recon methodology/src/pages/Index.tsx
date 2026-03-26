import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Shield, Wrench, Target, Menu, X } from "lucide-react";
import { reconPhases } from "@/data/reconPhases";
import PhaseSidebar from "@/components/PhaseSidebar";
import PhaseDetail from "@/components/PhaseDetail";
import ToolsPanel from "@/components/ToolsPanel";

type Tab = "phases" | "tools";

const Index = () => {
  const [target, setTarget] = useState("");
  const [activePhase, setActivePhase] = useState(1);
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<Tab>("phases");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPhase = reconPhases.find((p) => p.id === activePhase)!;
  const progress = Math.round((completedPhases.size / reconPhases.length) * 100);

  const toggleComplete = (id: number) => {
    setCompletedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePhaseClick = (id: number) => {
    setActivePhase(id);
    setActiveTab("phases");
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background scanline">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full bg-card border-r border-border" onClick={(e) => e.stopPropagation()}>
            <PhaseSidebar
              phases={reconPhases}
              activePhase={activePhase}
              completedPhases={completedPhases}
              onPhaseClick={handlePhaseClick}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <PhaseSidebar
        phases={reconPhases}
        activePhase={activePhase}
        completedPhases={completedPhases}
        onPhaseClick={handlePhaseClick}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card/50 px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold neon-text text-primary font-mono">
                WebRecon
              </h1>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              / methodology dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Target input */}
            <div className="flex items-center gap-2 flex-1 max-w-md bg-secondary/50 border border-border rounded-md px-3 py-1.5 focus-within:border-primary/50 transition-colors">
              <Target className="w-4 h-4 text-accent shrink-0" />
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="target.com"
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-mono"
              />
            </div>

            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="font-mono">{progress}%</span>
            </div>

            {/* Tabs */}
            <div className="flex items-center bg-muted rounded-md p-0.5">
              <button
                onClick={() => setActiveTab("phases")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeTab === "phases" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Phases</span>
              </button>
              <button
                onClick={() => setActiveTab("tools")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeTab === "tools" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tools</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "phases" ? (
            <PhaseDetail
              phase={currentPhase}
              target={target}
              isCompleted={completedPhases.has(activePhase)}
              onToggleComplete={() => toggleComplete(activePhase)}
            />
          ) : (
            <ToolsPanel />
          )}

          {/* Phase navigation for mobile */}
          {activeTab === "phases" && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-border lg:hidden">
              <button
                onClick={() => setActivePhase(Math.max(1, activePhase - 1))}
                disabled={activePhase === 1}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-xs text-muted-foreground font-mono">
                {activePhase} / {reconPhases.length}
              </span>
              <button
                onClick={() => setActivePhase(Math.min(reconPhases.length, activePhase + 1))}
                disabled={activePhase === reconPhases.length}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
