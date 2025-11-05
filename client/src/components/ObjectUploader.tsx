import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Check } from "lucide-react";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (result: any) => void;
  buttonClassName?: string;
  children: ReactNode;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760,
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file count
    if (selectedFiles.length > maxNumberOfFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxNumberOfFiles} file(s)`,
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes
    const oversizedFiles = selectedFiles.filter(f => f.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${Math.round(maxFileSize / 1024 / 1024)}MB`,
        variant: "destructive",
      });
      return;
    }

    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const successful: any[] = [];

    try {
      for (const file of files) {
        const { url } = await onGetUploadParameters();
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const response = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (response.ok) {
          successful.push({ uploadURL: url.split("?")[0], name: file.name });
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        } else {
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      if (onComplete) {
        onComplete({ successful });
      }

      toast({
        title: "Upload complete",
        description: `${successful.length} file(s) uploaded successfully`,
      });

      setShowModal(false);
      setFiles([]);
      setUploadProgress({});
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Button 
        onClick={() => setShowModal(true)} 
        className={buttonClassName} 
        type="button"
        data-testid="button-upload"
      >
        {children}
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple={maxNumberOfFiles > 1}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
            />

            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              data-testid="button-select-files"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Files (Max {maxNumberOfFiles})
            </Button>

            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected Files:</h4>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {uploadProgress[file.name] !== undefined && (
                        <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${uploadProgress[file.name]}%` }}
                          />
                        </div>
                      )}
                    </div>
                    {uploadProgress[file.name] === 100 ? (
                      <Check className="h-4 w-4 text-green-500 ml-2" />
                    ) : (
                      !uploading && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
                data-testid="button-start-upload"
              >
                {uploading ? "Uploading..." : `Upload ${files.length} File(s)`}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
