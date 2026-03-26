import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ChevronRight, ExternalLink } from "lucide-react";

interface CommandCardProps {
  description: string;
  command: string;
  target: string;
}

const CommandCard = ({ description, command, target }: CommandCardProps) => {
  const [copied, setCopied] = useState(false);
  const resolvedCommand = command.replace(/{target}/g, target || "target.com");

  const handleCopy = () => {
    navigator.clipboard.writeText(resolvedCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-secondary/50 border border-border rounded-md p-3 hover:border-primary/40 transition-colors">
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-sm text-primary break-all font-mono">
          <span className="text-accent mr-1">$</span>
          {resolvedCommand}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded hover:bg-muted transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-primary" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CommandCard;
