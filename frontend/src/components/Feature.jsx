import { motion } from "framer-motion";

const colorConfig = {
  primary: {
    iconBg: "bg-accent text-primary group-hover:gradient-primary group-hover:text-primary-foreground",
    hover: "hover:border-primary/30",
  },
  coral: {
    iconBg: "bg-coral/15 text-coral group-hover:gradient-coral group-hover:text-coral-foreground",
    hover: "hover:border-coral/30",
  },
  mint: {
    iconBg: "bg-mint/15 text-mint group-hover:gradient-mint group-hover:text-mint-foreground",
    hover: "hover:border-mint/30",
  },
  sky: {
    iconBg: "bg-sky/15 text-sky group-hover:gradient-sky group-hover:text-sky-foreground",
    hover: "hover:border-sky/30",
  },
  golden: {
    iconBg: "bg-golden/15 text-golden group-hover:gradient-golden group-hover:text-golden-foreground",
    hover: "hover:border-golden/30",
  },
  lavender: {
    iconBg: "bg-lavender/15 text-lavender group-hover:gradient-lavender group-hover:text-lavender-foreground",
    hover: "hover:border-lavender/30",
  },
};

/**
 * @param {Object} props
 * @param {React.ReactNode} props.icon
 * @param {string} props.title
 * @param {string} props.description
 * @param {"primary" | "coral" | "mint" | "sky" | "golden" | "lavender"} [props.color="primary"]
 * @param {number} [props.delay=0]
 */
const Feature = ({ icon, title, description, color = "primary", delay = 0 }) => {
  const config = colorConfig[color];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -3 }}
      className={`group relative p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-card ${config.hover} transition-colors duration-300`}
    >
      <div className="flex items-start gap-4">
        <motion.div 
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
          className={`p-3 rounded-xl transition-all duration-300 ${config.iconBg}`}
        >
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold font-display text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Feature;