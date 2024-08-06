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
import crypto from 'crypto-js';

/**
 * Digest a message using SHA-256
 * @param {string} message - The message to be hashed.
 * @returns {Promise<Uint8Array>} - The SHA-256 hash of the message.
 */
export async function digestMessage(message) {
  const hash = crypto.SHA256(message);
  return new Uint8Array(hash.words.map(word => [(word >> 24) & 0xff, (word >> 16) & 0xff, (word >> 8) & 0xff, word & 0xff]).flat());
}

/**
 * Initialize Helia node
 * @returns {Promise<Object>} - The initialized Helia node.
 */
async function initHeliaNode() {
  const blockstore = new MemoryBlockstore();
  const datastore = new MemoryDatastore();

  const libp2p = await createLibp2p({
    datastore,
    transports: [
      webSockets() // Use WebSockets transport
    ],
    connectionEncryption: [
      noise() // Use noise protocol for encryption
    ],
    streamMuxers: [
      yamux() // Use yamux for stream multiplexing
    ],
    peerDiscovery: [
      bootstrap({
        list: [
          // List of bootstrap peers for discovery
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt"
        ]
      })
    ],
    services: {
      identify: identify() // Use identify service for peer identification
    }
  });

  return createHelia({
    blockstore,
    datastore,
    libp2p
  });
}

/**
 * Main component for IPFS file uploader
 * @returns {JSX.Element} - The JSX code for IPFS file uploader component.
 */
export default function IPFS_UPLOADER() {
  const [heliaNode, setHeliaNode] = useState(null); // State to hold the Helia node instance
  const [file, setFile] = useState(null); // State to hold the selected file
  const [fileCid, setFileCid] = useState(null); // State to hold the CID of the uploaded file
  const [retrievedFileUrl, setRetrievedFileUrl] = useState(null); // State to hold the URL of the retrieved file
  const [loading, setLoading] = useState(false); // State to hold loading status

  // Initialize Helia node on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const node = await initHeliaNode();
        setHeliaNode(node);
        console.log("Helia node initialized with storage and networking");
      } catch (err) {
        console.error("Error initializing Helia node:", err);
      }
    };
    initialize();
  }, []);

  /**
   * Handle file selection
   * @param {Event} e - The event triggered by file input change.
   */
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("File selected:", e.target.files[0]);
  };

  /**
   * Handle file upload to IPFS
   */
  const handleUpload = async () => {
    if (!heliaNode || !file) {
      console.warn("Helia node or file not available");
      return;
    }

    setLoading(true);
    console.log("Starting file upload...");

    try {
      const cid = await uploadFileToIPFS(heliaNode, file);
      setFileCid(cid.toString());
      console.log("Added file:", cid.toString());
    } catch (err) {
      console.error("Error adding file:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload file to IPFS
   * @param {Object} node - The Helia node instance.
   * @param {File} file - The file to be uploaded.
   * @returns {Promise<Object>} - The CID of the uploaded file.
   */
  const uploadFileToIPFS = (node, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const bytes = new Uint8Array(reader.result);
        console.log("File read as bytes:", bytes);
        try {
          const fs = unixfs(node);
          const message = new TextDecoder().decode(bytes);
          const hash = await digestMessage(message);
          const cid = await fs.addBytes(hash);
          resolve(cid);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  };

  /**
   * Handle file retrieval from IPFS
   */
  const handleRetrieve = async () => {
    if (!heliaNode || !fileCid) {
      console.warn("Helia node or file CID not available");
      return;
    }

    setLoading(true);
    console.log("Retrieving file with CID:", fileCid);

    try {
      const url = await retrieveFileFromIPFS(heliaNode, fileCid, file.type);
      setRetrievedFileUrl(url);
      console.log("Retrieved file URL:", url);
    } catch (err) {
      console.error("Error retrieving file:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retrieve file from IPFS
   * @param {Object} node - The Helia node instance.
   * @param {string} cid - The CID of the file to be retrieved.
   * @param {string} fileType - The original file type.
   * @returns {Promise<string>} - The URL of the retrieved file.
   */
  const retrieveFileFromIPFS = async (node, cid, fileType) => {
    const fs = unixfs(node);
    let retrievedBytes = new Uint8Array();

    for await (const chunk of fs.cat(cid)) {
      const temp = new Uint8Array(retrievedBytes.length + chunk.length);
      temp.set(retrievedBytes);
      temp.set(chunk, retrievedBytes.length);
      retrievedBytes = temp;
    }

    const blob = new Blob([retrievedBytes], { type: fileType });
    return URL.createObjectURL(blob);
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
            <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-muted rounded-lg p-8">
              <label htmlFor="file-input">Choose file</label>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="border rounded p-2"
              />
              <Button
                variant="outline"
                onClick={handleUpload}
                disabled={!heliaNode || !file || loading}
              >
                {loading ? "Uploading..." : "Add to IPFS"}
              </Button>
            </div>

            {fileCid && <p>File CID: {fileCid}</p>}

            {fileCid && (
              <Button onClick={handleRetrieve} disabled={loading}>
                {loading ? "Retrieving..." : "Retrieve from IPFS"}
              </Button>
            )}

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
