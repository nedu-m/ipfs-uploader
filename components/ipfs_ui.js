'use client';

import { useState, useEffect } from "react";
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';
import { createLibp2p } from 'libp2p';
import { identify } from '@libp2p/identify';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { webSockets } from '@libp2p/websockets';
import { bootstrap } from '@libp2p/bootstrap';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function IPFS_UPLOADER() {
  const [heliaNode, setHeliaNode] = useState(null);
  const [file, setFile] = useState(null);
  const [fileCid, setFileCid] = useState(null);
  const [retrievedFileUrl, setRetrievedFileUrl] = useState(null);

  useEffect(() => {
    const initHelia = async () => {
      try {
        // Create a blockstore and datastore
        const blockstore = new MemoryBlockstore();
        const datastore = new MemoryDatastore();

        // Create a libp2p instance
        const libp2p = await createLibp2p({
          datastore,
          transports: [
            webSockets()
          ],
          connectionEncryption: [
            noise()
          ],
          streamMuxers: [
            yamux()
          ],
          peerDiscovery: [
            bootstrap({
              list: [
                "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
                "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
                "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
                "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt"
              ]
            })
          ],
          services: {
            identify: identify()
          }
        });

        // Create a Helia node
        const node = await createHelia({
          blockstore,
          datastore,
          libp2p
        });

        setHeliaNode(node);
        console.log("Helia node initialized with storage and networking");
      } catch (err) {
        console.error("Error initializing Helia node:", err);
      }
    };
    initHelia();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("File selected:", e.target.files[0]);
  };

  const handleUpload = async () => {
    if (heliaNode && file) {
      console.log("Starting file upload...");
      const reader = new FileReader();
      reader.onload = async () => {
        const bytes = new Uint8Array(reader.result);
        console.log("File read as bytes:", bytes);
        try {
          const fs = unixfs(heliaNode);
          const cid = await fs.addBytes(bytes);
          console.log("Added file:", cid.toString());
          setFileCid(cid.toString());
        } catch (err) {
          console.error("Error adding file:", err);
        }
      };
      reader.onerror = (err) => {
        console.error("Error reading file:", err);
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.warn("Helia node or file not available");
    }
  };

  const handleRetrieve = async () => {
    if (heliaNode && fileCid) {
      try {
        console.log("Retrieving file with CID:", fileCid);
        const fs = unixfs(heliaNode);
        let retrievedBytes = new Uint8Array();
        for await (const chunk of fs.cat(fileCid)) {
          const temp = new Uint8Array(retrievedBytes.length + chunk.length);
          temp.set(retrievedBytes);
          temp.set(chunk, retrievedBytes.length);
          retrievedBytes = temp;
        }

        // Create a Blob from the retrieved bytes
        const blob = new Blob([retrievedBytes], { type: file.type }); // Use the original file type

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Set the URL for displaying or downloading the file
        setRetrievedFileUrl(url);

        console.log("Retrieved file URL:", url);
      } catch (err) {
        console.error("Error retrieving file:", err);
      }
    } else {
      console.warn("Helia node or file CID not available");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background rounded-sm">
      <div className="max-w-2xl w-full px-4 md:px-0">
        <Card className="border-2 border-accent">
          <CardHeader className="bg-accent text-accent-foreground p-6">
            <CardTitle>IPFS File Upload</CardTitle>
            <CardDescription>Upload your files to IPFS and retrieve them in their original formats.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* File Upload Area */}
            <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-muted rounded-lg p-8">
              <input
                type="file"
                onChange={handleFileChange}
                className="border rounded p-2"
              />
              <Button onClick={handleUpload} disabled={!heliaNode || !file}>
                Add to IPFS
              </Button>
            </div>

            {/* Display CID */}
            {fileCid && <p>File CID: {fileCid}</p>}

            {/* Retrieve Button */}
            {fileCid && (
              <Button onClick={handleRetrieve}>
                Retrieve from IPFS
              </Button>
            )}

            {/* Display Retrieved File */}
            {retrievedFileUrl && (
              <div className="border p-4 mt-4">
                <a href={retrievedFileUrl} download={file?.name || 'retrievedFile'}>Download Retrieved File</a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
