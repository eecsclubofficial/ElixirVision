import { motion } from "framer-motion";
import { Package, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationPanel from "./NotificationPanel";

const Header = () => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50"
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="relative">
            <motion.div 
              className="p-2.5 rounded-xl gradient-primary shadow-elevated"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Package className="w-5 h-5 text-primary-foreground" />
            </motion.div>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight">
              <span className="text-primary">Duplicate</span>
              <span className="text-foreground">Cleaner</span>
            </h1>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-2">
          <NotificationPanel />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="sm:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;