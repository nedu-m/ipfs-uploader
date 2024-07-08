"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function IPFS_UPLOADER() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0]; // Check if files exist
    if (file) {
      setSelectedFile(file);
    } else {
      console.log("No file selected.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background rounded-sm">
      <div className="max-w-2xl w-full px-4 md:px-0">
        <Card className="border-2 border-accent">
          <CardHeader className="bg-accent text-accent-foreground p-6">
            <CardTitle>IPFS File Upload</CardTitle>
            <CardDescription>Upload your files to IPFS and mint the hashes to the blockchain.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* File Upload Area */}
            <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-muted rounded-lg p-8">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="link">browse</Button>
              </label>
              {/* Make input visible for file selection */}
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="" // Remove the "hidden" class to make input visible
              />
            </div>
            {/* Display selected file information (optional) */}
            {selectedFile && (
              <div>
                <p>Selected File: {selectedFile.name}</p>
                <p>File Type: {selectedFile.type}</p>
                <p>File Size: {selectedFile.size} bytes</p>
              </div>
            )}

            {/* ... (the rest of your UI components) ... */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
