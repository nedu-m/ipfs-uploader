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
- **AWS ECR**: Container registry to store Docker images.
- **AWS ECS**: Container orchestration service for running and scaling containerized applications.
- **Application Load Balancer (ALB)**: Distributes incoming application traffic across multiple targets for increased availability.

## Project Structure

```
.
├── public
├── app
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

### Deploying to AWS ECS

1. **Create an ECR Repository:**

```bash
aws ecr create-repository --repository-name ipfs_uploader --region eu-north-1
```

2. **Tag and Push Docker Image to ECR:**

```bash
docker tag ipfs_uploader:latest <aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com/ipfs_uploader:latest
docker push <aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com/ipfs_uploader:latest
```

3. **Create ECS Cluster:**

```bash
aws ecs create-cluster --cluster-name ipfs-uploader-cluster --region eu-north-1
```

4. **Create Task Definition JSON File:**

```json
{
  "family": "ipfs-uploader-task",
  "networkMode": "awsvpc",
  "executionRoleArn": "arn:aws:iam::<aws_account_id>:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::<aws_account_id>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "ipfs_uploader",
      "image": "<aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com/ipfs_uploader:latest",
      "cpu": 512,
      "memory": 1024,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ipfs-uploader-task",
          "awslogs-region": "eu-north-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048"
}

```

5. **Register Task Definition:**

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

6. **Create Security Group and Allow Inbound Traffic:**

```bash
aws ec2 create-security-group --group-name ipfs-uploader-sg --description "Security group for IPFS uploader" --vpc-id <vpc-id> --region eu-north-1
aws ec2 authorize-security-group-ingress --group-id <security-group-id> --protocol tcp --port 80 --cidr 0.0.0.0/0 --region eu-north-1
```

6. **Create ECS Service:**

```bash
aws ecs create-service --cluster ipfs-uploader-cluster --service-name ipfs-uploader-service --task-definition ipfs-uploader-task --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[<subnet-1>,<subnet-2>,<subnet-3>],securityGroups=[<security-group-id>],assignPublicIp=ENABLED}" --region eu-north-1
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
