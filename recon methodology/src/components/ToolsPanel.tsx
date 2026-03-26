import { ExternalLink } from "lucide-react";
import { reconTools, usefulSites } from "@/data/reconPhases";

const ToolsPanel = () => {
  return (
    <div className="space-y-8">
      {/* Tools */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">
          🛠 Tools Arsenal
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {reconTools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 px-3 py-2.5 bg-secondary/50 border border-border rounded-md hover:border-primary/40 transition-colors group"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{tool.name}</p>
                <p className="text-xs text-muted-foreground truncate">{tool.purpose}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Useful Sites */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">
          🌐 Useful Sites
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {usefulSites.map((site) => (
            <a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 px-3 py-2.5 bg-secondary/50 border border-border rounded-md hover:border-accent/40 transition-colors group"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{site.name}</p>
                <p className="text-xs text-muted-foreground truncate">{site.purpose}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPanel;
