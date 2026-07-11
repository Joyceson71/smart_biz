import React, { useCallback, useState } from "react";
import { UploadCloud, File, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  isUploading?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = "image/jpeg, image/png, application/pdf",
  maxSizeMB = 5,
  className,
  isUploading = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  if (selectedFile) {
    return (
      <div className={cn("p-4 rounded-xl border bg-card flex items-center justify-between", className)}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            {selectedFile.type.includes("pdf") ? <File className="size-6" /> : <ImageIcon className="size-6" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        {!isUploading && (
          <Button variant="ghost" size="icon" onClick={clearFile} className="text-muted-foreground hover:text-destructive shrink-0">
            <X className="size-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
          error ? "border-destructive bg-destructive/5" : ""
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="p-3 bg-muted rounded-full mb-3">
            <UploadCloud className="size-6 text-muted-foreground" />
          </div>
          <p className="mb-1 text-sm font-semibold">
            Click to upload <span className="font-normal text-muted-foreground">or drag and drop</span>
          </p>
          <p className="text-xs text-muted-foreground">
            SVG, PNG, JPG or PDF (MAX. {maxSizeMB}MB)
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          disabled={isUploading}
        />
      </label>
      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
    </div>
  );
}
