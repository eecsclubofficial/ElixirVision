import { useState } from "react";
import { Check, Trash2, Archive, Eye, X, AlertTriangle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const DuplicateGroup = ({ groupId, similarity, images, onAction }) => {
  const [selectedImages, setSelectedImages] = useState(new Set([images[0]?.id]));
  const [previewImage, setPreviewImage] = useState(null);

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(id)) {
      if (newSelected.size > 1) {
        newSelected.delete(id);
      }
    } else {
      newSelected.add(id);
    }
    setSelectedImages(newSelected);
  };

  const getSimilarityConfig = (score) => {
    if (score >= 95) return { 
      color: "text-destructive", 
      bg: "bg-destructive/10", 
      border: "border-destructive/20",
      icon: AlertTriangle,
      label: "Near Identical"
    };
    if (score >= 85) return { 
      color: "text-warning", 
      bg: "bg-warning/10", 
      border: "border-warning/20",
      icon: Zap,
      label: "Very Similar"
    };
    return { 
      color: "text-primary", 
      bg: "bg-accent", 
      border: "border-primary/20",
      icon: Zap,
      label: "Similar"
    };
  };

  const config = getSimilarityConfig(similarity);
  const SimilarityIcon = config.icon;

  return (
    <>
      <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-border/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              Group {groupId}
            </span>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.color} ${config.border} border`}>
              <SimilarityIcon className="w-3.5 h-3.5" />
              {similarity}% • {config.label}
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {images.length} photos • {selectedImages.size} selected
          </span>
        </div>
        
        {/* Image Grid */}
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`
                  relative group rounded-xl overflow-hidden cursor-pointer transition-all duration-300
                  ${selectedImages.has(image.id) 
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-card shadow-elevated" 
                    : "hover:shadow-card"
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => toggleSelection(image.id)}
              >
                <div className="aspect-square">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Overlay */}
                <div className={`
                  absolute inset-0 transition-all duration-300
                  ${selectedImages.has(image.id) 
                    ? "bg-primary/15" 
                    : "bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                  }
                `} />
                
                {/* Selection Checkbox */}
                <div className={`
                  absolute top-3 left-3 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shadow-soft
                  ${selectedImages.has(image.id) 
                    ? "gradient-primary border-transparent" 
                    : "bg-card/90 border-border group-hover:border-primary/50"}
                `}>
                  {selectedImages.has(image.id) && (
                    <Check className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                
                {/* Preview Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(image);
                  }}
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-card/90 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-card shadow-soft"
                >
                  <Eye className="w-4 h-4 text-foreground" />
                </button>
                
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-xs font-medium text-primary-foreground truncate">{image.name}</p>
                  <p className="text-xs text-primary-foreground/70">{image.size}</p>
                </div>

                {/* Best pick badge */}
                {index === 0 && (
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-success text-success-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Best Quality
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-5 border-t border-border/50 bg-secondary/30 flex flex-wrap gap-3">
          <Button
            size="sm"
            onClick={() => onAction(groupId, "keep", Array.from(selectedImages))}
            className="gap-2 rounded-full gradient-primary border-0 shadow-soft hover:shadow-elevated transition-shadow"
          >
            <Check className="w-4 h-4" />
            Keep Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction(groupId, "archive", Array.from(selectedImages))}
            className="gap-2 rounded-full"
          >
            <Archive className="w-4 h-4" />
            Archive Others
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const unselected = images.filter(img => !selectedImages.has(img.id)).map(img => img.id);
              onAction(groupId, "delete", unselected);
            }}
            className="gap-2 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete Duplicates
          </Button>
        </div>
      </div>
      
      {/* Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-5xl max-h-[90vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-elevated"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-card shadow-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-card/95 backdrop-blur-sm rounded-xl border border-border/50 shadow-card">
              <h3 className="font-medium text-foreground">{previewImage.name}</h3>
                  <p className="text-sm text-foreground/70">{previewImage.size}</p>
                </div>
              </div>
            </div>
          )}
        </>
      );
    };
    
    export default DuplicateGroup;
    