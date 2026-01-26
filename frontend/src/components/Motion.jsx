import { motion } from "framer-motion";

const variantStyles = {
  default: {
    card: "bg-card border-border/50",
    icon: "bg-secondary text-muted-foreground",
  },
  primary: {
    card: "bg-accent border-primary/20",
    icon: "gradient-primary text-primary-foreground",
  },
  coral: {
    card: "bg-coral/10 border-coral/20",
    icon: "gradient-coral text-coral-foreground",
  },
  mint: {
    card: "bg-mint/10 border-mint/20",
    icon: "gradient-mint text-mint-foreground",
  },
  sky: {
    card: "bg-sky/10 border-sky/20",
    icon: "gradient-sky text-sky-foreground",
  },
  golden: {
    card: "bg-golden/10 border-golden/20",
    icon: "gradient-golden text-golden-foreground",
  },
  success: {
    card: "bg-success/10 border-success/20",
    icon: "bg-success text-success-foreground",
  },
  warning: {
    card: "bg-warning/10 border-warning/20",
    icon: "bg-warning text-warning-foreground",
  },
};

/**
 * @param {Object} props
 * @param {React.ReactNode} props.icon
 * @param {string} props.label
 * @param {string | number} props.value
 * @param {string} [props.subtext]
 * @param {"default" | "primary" | "coral" | "mint" | "sky" | "golden" | "success" | "warning"} [props.variant="default"]
 */
const Motion = ({ icon, label, value, subtext, variant = "default" }) => {
  const styles = variantStyles[variant];

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`p-5 rounded-2xl border shadow-soft ${styles.card}`}
    >
      <div className="flex items-start gap-4">
        <motion.div 
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
          className={`p-3 rounded-xl ${styles.icon}`}
        >
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold font-display text-foreground truncate"
          >
            {value}
          </motion.p>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default Motion;