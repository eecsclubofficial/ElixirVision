import { motion } from "framer-motion";
import { Scan, Sparkles, Image } from "lucide-react";

/**
 * @param {Object} props
 * @param {number} props.progress
 * @param {string} props.currentFile
 * @param {number} props.totalFiles
 * @param {number} props.processedFiles
 */
const ScanProgress = ({ progress, currentFile, totalFiles, processedFiles }) => {
  const stages = [
    { label: "Loading", threshold: 20, color: "bg-coral" },
    { label: "Analyzing", threshold: 50, color: "bg-mint" },
    { label: "Comparing", threshold: 80, color: "bg-sky" },
    { label: "Finalizing", threshold: 100, color: "bg-primary" },
  ];

  const currentStage = stages.find(s => progress <= s.threshold) || stages[stages.length - 1];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="relative bg-card rounded-3xl shadow-elevated border border-border/50 p-8 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" 
        />
        <motion.div 
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-0 w-40 h-40 rounded-full bg-mint/10 blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-20 right-1/4 w-60 h-60 rounded-full bg-coral/10 blur-3xl" 
        />
      </div>
      
      <div className="relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-5 mb-8"
        >
          <div className="relative">
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl gradient-rainbow blur-xl" 
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative p-4 rounded-2xl gradient-rainbow"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Scan className="w-7 h-7 text-primary-foreground" />
              </motion.div>
            </motion.div>
          </div>
          <div>
            <h3 className="font-bold font-display text-xl text-foreground flex items-center gap-2">
              {currentStage.label} Photos
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-golden" />
              </motion.div>
            </h3>
            <p className="text-muted-foreground">Detecting visual similarities...</p>
          </div>
        </motion.div>
        
        {/* Progress bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="relative h-4 rounded-full bg-secondary overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="absolute inset-y-0 left-0 gradient-rainbow rounded-full"
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="absolute inset-y-0 left-0 bg-primary-foreground/20 rounded-full animate-shimmer"
            />
          </div>
          
          {/* Progress stages */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {stages.map((stage) => (
              <motion.div 
                key={stage.label} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5"
              >
                <motion.div 
                  animate={{ 
                    scale: progress >= stage.threshold - 20 ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  className={`w-2 h-2 rounded-full ${progress >= stage.threshold - 20 ? stage.color : "bg-muted"} transition-colors duration-300`} 
                />
                <span className={progress >= stage.threshold - 20 ? "text-foreground font-medium" : ""}>{stage.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Current file info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 rounded-xl bg-secondary/50 flex items-center justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Image className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </motion.div>
            <span className="text-sm text-muted-foreground truncate">
              {currentFile}
            </span>
          </div>
          <div className="text-sm font-semibold flex-shrink-0">
            <span className="text-gradient">{processedFiles}</span>
            <span className="text-muted-foreground"> / {totalFiles}</span>
          </div>
        </motion.div>
        
        {/* Privacy note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-border/50"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <motion.div 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-success" 
            />
            <span>Processing locally • Your photos never leave your device</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScanProgress;