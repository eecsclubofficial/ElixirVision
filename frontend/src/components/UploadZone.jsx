import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FolderOpen, 
  Image, 
  FileArchive, 
  Clipboard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg", 
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "application/zip",
  "application/x-zip-compressed",
];

const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.heic,.heif,.webp,.gif,.bmp,.tiff,.zip";

const uploadMethods = [
  {
    id: "files",
    icon: <Image className="w-5 h-5" />,
    label: "Select Files",
    description: "JPG, PNG, HEIC, WebP",
    color: "text-primary",
    gradient: "gradient-primary",
    shadow: "shadow-elevated",
  },
  {
    id: "folder",
    icon: <FolderOpen className="w-5 h-5" />,
    label: "Choose Folder",
    description: "Entire photo albums",
    color: "text-primary",
    gradient: "gradient-primary",
    shadow: "shadow-elevated",
  },
  {
    id: "zip",
    icon: <FileArchive className="w-5 h-5" />,
    label: "Upload ZIP",
    description: "Compressed archives",
    color: "text-primary",
    gradient: "gradient-primary",
    shadow: "shadow-elevated",
  },
  {
    id: "paste",
    icon: <Clipboard className="w-5 h-5" />,
    label: "Paste Images",
    description: "Ctrl+V from clipboard",
    color: "text-primary",
    gradient: "gradient-primary",
    shadow: "shadow-elevated",
  },
];

/**
 * @param {Object} props
 * @param {(files: FileList | File[]) => void} props.onFilesSelected
 */
const UploadZone = ({ onFilesSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [pasteActive, setPasteActive] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const zipInputRef = useRef(null);
  const { toast } = useToast();

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = async (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles = [];
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        setPasteActive(true);
        setTimeout(() => setPasteActive(false), 1000);
        onFilesSelected(imageFiles);
        toast({
          title: "Images pasted!",
          description: `${imageFiles.length} image(s) added from clipboard`,
        });
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [onFilesSelected, toast]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const items = e.dataTransfer.items;
      const files = [];

      // Handle folders via webkitGetAsEntry
      for (const item of Array.from(items)) {
        const entry = item.webkitGetAsEntry?.();
        if (entry?.isDirectory) {
          const dirFiles = await readDirectory(entry);
          files.push(...dirFiles);
        } else if (entry?.isFile) {
          const file = item.getAsFile();
          if (file && isValidFile(file)) files.push(file);
        }
      }

      if (files.length === 0 && e.dataTransfer.files.length > 0) {
        // Fallback for simple file drops
        const validFiles = Array.from(e.dataTransfer.files).filter(isValidFile);
        files.push(...validFiles);
      }

      if (files.length > 0) {
        onFilesSelected(files);
        toast({
          title: "Files added!",
          description: `${files.length} file(s) ready to scan`,
        });
      }
    },
    [onFilesSelected, toast]
  );

  const readDirectory = async (dirEntry) => {
    const files = [];
    const reader = dirEntry.createReader();
    
    const readEntries = () => {
      return new Promise((resolve) => {
        reader.readEntries((entries) => resolve(entries));
      });
    };

    let entries = await readEntries();
    while (entries.length > 0) {
      for (const entry of entries) {
        if (entry.isFile) {
          const file = await getFileFromEntry(entry);
          if (file && isValidFile(file)) files.push(file);
        } else if (entry.isDirectory) {
          const subFiles = await readDirectory(entry);
          files.push(...subFiles);
        }
      }
      entries = await readEntries();
    }
    return files;
  };

  const getFileFromEntry = (entry) => {
    return new Promise((resolve) => {
      entry.file((file) => resolve(file), () => resolve(null));
    });
  };

  const isValidFile = (file) => {
    return ACCEPTED_TYPES.includes(file.type) || 
           file.name.toLowerCase().endsWith('.heic') ||
           file.name.toLowerCase().endsWith('.heif');
  };

  const handleFileInput = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const validFiles = Array.from(e.target.files).filter(isValidFile);
        if (validFiles.length > 0) {
          onFilesSelected(validFiles);
          toast({
            title: "Files selected!",
            description: `${validFiles.length} file(s) ready to scan`,
          });
        }
      }
    },
    [onFilesSelected, toast]
  );

  const handleMethodClick = (methodId) => {
    switch (methodId) {
      case "files":
        fileInputRef.current?.click();
        break;
      case "folder":
        folderInputRef.current?.click();
        break;
      case "zip":
        zipInputRef.current?.click();
        break;
      case "paste":
        toast({
          title: "Paste Mode Active",
          description: "Press Ctrl+V (or Cmd+V) to paste images from clipboard",
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleFileInput}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleFileInput}
        className="hidden"
        webkitdirectory=""
        directory=""
      />
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Main Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        animate={{
          scale: isDragOver ? 1.02 : 1,
          borderColor: isDragOver ? "hsl(var(--primary))" : "hsl(var(--border))",
        }}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`
          relative overflow-hidden rounded-3xl border-2 border-dashed cursor-pointer group
          ${isDragOver
            ? "border-primary bg-accent shadow-elevated"
            : pasteActive 
              ? "border-sky bg-sky/10 shadow-sky"
              : "border-border bg-card hover:border-primary/40 hover:shadow-card"
          }
        `}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              x: isDragOver ? 20 : 0,
              y: isDragOver ? -20 : 0,
              scale: isDragOver ? 1.2 : 1,
            }}
            transition={{ type: "spring", stiffness: 100 }}
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/3 blur-3xl" 
          />
          <motion.div 
            animate={{ 
              x: isDragOver ? -20 : 0,
              y: isDragOver ? 20 : 0,
              scale: isDragOver ? 1.2 : 1,
            }}
            transition={{ type: "spring", stiffness: 100 }}
            className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-muted blur-3xl" 
          />
        </div>
        
        <div className="relative px-6 py-14 sm:py-16 flex flex-col items-center gap-6">
          {/* Icon */}
          <div className="relative">
            <motion.div 
              animate={{ 
                opacity: isDragOver ? 0.6 : 0.2,
                scale: isDragOver ? 1.3 : 1,
              }}
              transition={{ type: "spring", stiffness: 200 }}
              className="absolute inset-0 rounded-3xl blur-2xl gradient-primary"
            />
            <motion.div 
              animate={{ 
                scale: isDragOver ? 1.15 : 1,
                rotate: isDragOver ? 5 : 0,
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative p-6 rounded-3xl gradient-primary"
            >
              <motion.div
                animate={{ y: isDragOver ? [-2, 2, -2] : 0 }}
                transition={{ duration: 0.5, repeat: isDragOver ? Infinity : 0 }}
              >
                <Upload className="w-10 h-10 text-primary-foreground" />
              </motion.div>
            </motion.div>
          </div>
          
          {/* Text */}
          <div className="text-center space-y-2 max-w-lg">
            <motion.h3 
              animate={{ scale: isDragOver ? 1.05 : 1 }}
              className="text-2xl sm:text-3xl font-bold font-display text-foreground"
            >
              {isDragOver ? "Drop them here!" : "Drop your photos here"}
            </motion.h3>
            <p className="text-muted-foreground leading-relaxed">
              Drag & drop images, folders, or ZIP files. We support 
              <span className="text-primary font-medium"> JPG</span>, 
              <span className="text-primary font-medium"> PNG</span>, 
              <span className="text-primary font-medium"> HEIC</span>, 
              <span className="text-primary font-medium"> WebP</span>, and more.
            </p>
          </div>

          {/* Format badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {["JPG", "PNG", "HEIC", "WebP", "GIF", "ZIP"].map((format, i) => (
              <motion.span 
                key={format} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border"
              >
                {format}
              </motion.span>
            ))}
          </div>
        </div>
        
        <AnimatePresence>
          {isDragOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/5 pointer-events-none" 
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Upload Methods Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {uploadMethods.map((method, index) => (
          <motion.button
            key={method.id}
            onClick={() => handleMethodClick(method.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group relative p-4 rounded-2xl border border-border/50 bg-card 
              hover:border-transparent hover:shadow-elevated 
              transition-colors duration-300 text-left overflow-hidden"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className={`absolute inset-0 rounded-2xl ${method.gradient}`}
            />
            <div className="relative flex flex-col gap-3">
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
                className={`
                  p-2.5 rounded-xl w-fit transition-all duration-300
                  bg-secondary ${method.color} group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground
                `}
              >
                {method.icon}
              </motion.div>
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary-foreground transition-colors">
                  {method.label}
                </p>
                <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/70 transition-colors">
                  {method.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Features row */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2"
      >
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-primary" 
          />
          <span>AI-Powered</span>
        </motion.div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/60" />
          <span>Up to 1000 images</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/40" />
          <span>100% Private</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-success" 
          />
          <span>Instant Results</span>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadZone;