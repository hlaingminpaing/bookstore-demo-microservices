📚 CloudRead - Microservices Bookstore

A modern, cloud-native bookstore application built with a microservices architecture. This project demonstrates a full-stack implementation using React, Node.js, and Python, deployed on Kubernetes (EKS) with a GitOps workflow using GitLab CI and ArgoCD.

🚀 Project Overview

CloudRead is designed to simulate a real-world e-commerce platform with separate services for the frontend, backend logic, and product recommendations. It features a robust CI/CD pipeline that includes code quality checks (SonarQube), security scanning (Trivy), and automated deployments.

Key Features

🛍️ Customer Portal

Google Authentication: Secure sign-in for users.

Product Catalog: Browse and search for books.

Shopping Cart & Wishlist: Persistent local state management.

Checkout: Cash on Delivery (COD) flow with simulated order processing.

Order History: Track past purchases and status.

Smart Recommendations: "Book of the Day" feature powered by a Python microservice.

🛡️ Admin Dashboard

Secure Login: Dedicated username/password authentication (admin/password).

Inventory Management: CRUD operations for books with stock tracking.

Order Management: View all customer orders and shipping details.

Real-time Updates: Stock quantity validation prevents overselling.

🏗️ Architecture

The application follows a Monorepo structure where all services reside in a single Git repository but are deployed independently.

Frontend: React + Vite + Tailwind CSS (Served via Nginx).

Backend Service: Node.js + Express (Handles Catalog & Orders).

Recommendation Service: Python + Flask (Handles AI/Logic for recommendations).

Database: In-memory storage (simulated for demo purposes).

Infrastructure: Kubernetes (EKS) with Ingress Controller.

Tech Stack

Component

Technology

Frontend

React, Vite, Tailwind CSS, Firebase Auth, Lucide Icons

Backend

Node.js, Express, CORS

ML Service

Python 3.9, Flask

Containerization

Docker, Multi-stage builds

Orchestration

Kubernetes (K8s), Ingress

CI/CD

GitLab CI, ArgoCD

Quality & Security

SonarQube, Trivy

🛠️ Getting Started (Local Development)

Follow these steps to run the entire microservices stack locally.

Prerequisites

Node.js (v18+)

Python (v3.9+)

Docker

1. Clone the Repository

git clone [https://gitlab.com/your-username/cloudread.git](https://gitlab.com/your-username/cloudread.git)
cd cloudread


2. Start the Node.js Backend

cd backend
npm install
node server.js
# Server runs on http://localhost:3001


3. Start the Python Recommendation Service

Open a new terminal:

cd recommendation-service
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
# Service runs on http://localhost:5000


4. Start the Frontend

Open a third terminal. Ensure your vite.config.js has the proxy settings enabled for local development.

cd frontend
npm install
npm run dev
# App runs on http://localhost:5173


Visit http://localhost:5173 to see the app!

Admin Credentials:

Username: admin

Password: password

🎡 CI/CD Pipeline & GitOps

This project uses a sophisticated GitOps workflow to ensure stability and security.

🔐 CI/CD Configuration (Required Secrets)

To run the pipeline successfully, go to Settings > CI/CD > Variables in GitLab and add the following:

Variable Key

Value Description

Type

Protected?

DOCKER_USERNAME

Your Docker Hub username.

Variable

No

DOCKER_PASSWORD

Your Docker Hub Access Token.

Variable

Yes

SONAR_HOST_URL

URL of your SonarQube server.

Variable

No

SONAR_TOKEN

Authentication token from SonarQube.

Variable

Yes

CI_PUSH_TOKEN

Project Access Token with write_repository scope (allows the pipeline to push tag updates back to Git).

Variable

Yes

Continuous Integration (GitLab CI)

The pipeline is triggered on push and performs the following based on path changes:

Test: Runs SonarQube analysis to check for code smells and bugs.

Build: Creates Docker images for the specific service that changed (frontend, backend, or recommendation-service).

Scan: Uses Trivy to scan the Docker image for vulnerabilities (CVEs).

Push: Pushes the safe image to Docker Hub with the commit SHA tag.

Continuous Deployment (ArgoCD)

Update Manifests: The CI pipeline automatically updates the Kubernetes YAML files in the k8s/ folder with the new image tag.

Sync: ArgoCD detects the change in the Git repository and automatically synchronizes the Kubernetes cluster to match the new state.

📂 Project Structure

cloudread/
├── frontend/                # React Application
│   ├── src/
│   ├── Dockerfile           # Nginx build
│   └── vite.config.js       # Proxy config
├── backend/                 # Node.js API
│   ├── server.js
│   └── Dockerfile
├── recommendation-service/  # Python Flask API
│   ├── app.py
│   └── Dockerfile
├── k8s/                     # Kubernetes Manifests
│   ├── backend.yaml
│   ├── frontend.yaml
│   ├── recommendation.yaml
│   └── ingress.yaml
├── .gitlab-ci.yml           # CI/CD Configuration
└── sonar-project.properties # Code Quality Config


🔗 API Reference

Backend (Node.js) - Port 3001

GET /api/books - List all books

POST /api/books - Add a book (Admin)

PUT /api/books/:id - Update a book (Admin)

DELETE /api/books/:id - Remove a book (Admin)

GET /api/orders - List orders

POST /api/orders - Place a new order

Recommendation Service (Python) - Port 5000

GET /api/recommendations - Get a random recommended book

🤝 Contributing

Fork the repository.

Create a feature branch (git checkout -b feature/amazing-feature).

Commit your changes (git commit -m 'Add some amazing feature').

Push to the branch (git push origin feature/amazing-feature).

Open a Merge Request.

📄 License

Distributed under the MIT License. See LICENSE for more information.