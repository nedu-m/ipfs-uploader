---

# IPFS Uploader with Future Blockchain Integration

## Overview

The IPFS Uploader is a decentralized application (dApp) that allows users to upload files to the InterPlanetary File System (IPFS) and retrieve them using their unique Content Identifier (CID). This project is built using Next.js and Helia, providing a robust interface for file management on the IPFS network. Future updates will integrate blockchain technology to record file metadata on a smart contract, enhancing the security and traceability of the uploaded files.

## Features

- Upload files to IPFS
- Retrieve files from IPFS using CID
- Future integration with blockchain to store file metadata

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **Helia**: Library for interacting with IPFS.
- **Libp2p**: Modular network stack for peer-to-peer applications.
- **Bootstrap**: Peer discovery service for libp2p.
- **Docker**: Containerization for consistent environment setup.
- **CI/CD**: Continuous Integration and Continuous Deployment using GitHub Actions.

## Project Structure

```
.
├── public
├── src
│   ├── components
│   └── pages
├── .github
│   ├── workflows
│   │   └── ci.yml
├── Dockerfile
├── next.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 20 or above)
- Docker (optional, for containerization)
- GitHub account (for CI/CD)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/nedu-m/ipfs-uploader
cd ipfs-uploader
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Build the project:**

```bash
npm run build
```

5. **Start the production server:**

```bash
npm start
```

### Docker Setup

1. **Build the Docker image:**

```bash
docker build -t ipfs-uploader .
```

2. **Run the Docker container:**

```bash
docker run -p 3000:3000 ipfs-uploader
```

### Deploying to Vercel

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Deploy the project:**

```bash
vercel
```

Follow the prompts to link your project to your Vercel account and deploy.

## Usage

### Uploading a File

1. **Select a file:**
   Click on the file input to select a file from your local system.

2. **Upload the file:**
   Click on the "Add to IPFS" button to upload the selected file to IPFS.

3. **View the CID:**
   After uploading, the Content Identifier (CID) of the file will be displayed.

### Retrieving a File

1. **Click the "Retrieve from IPFS" button:**
   This will retrieve the file using the displayed CID.

2. **Download the file:**
   A download link for the retrieved file will be generated.

## Future Integration with Blockchain

The future version of this project will include:

1. **Smart Contracts:**
   - Deploying smart contracts to record file metadata on a blockchain network.

2. **Blockchain Interactions:**
   - Using web3.js or ethers.js to interact with the blockchain.

3. **Environment Variables:**
   - Securely managing blockchain-related keys using Vercel’s environment variables.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any features, bug fixes, or enhancements.

1. **Fork the repository**
2. **Create a new branch (`git checkout -b feature-branch`)**
3. **Commit your changes (`git commit -m 'Add new feature'`)**
4. **Push to the branch (`git push origin feature-branch`)**
5. **Open a Pull Request**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
