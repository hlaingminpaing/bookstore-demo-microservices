# 📚 CloudRead — Microservices Bookstore

A modern **cloud-native bookstore** built using a **microservices architecture**.  
This project demonstrates a complete end-to-end implementation using **React**, **Node.js**, **Python Flask**, **Docker**, **Kubernetes (EKS)**, and **GitOps** powered by **GitLab CI** + **ArgoCD**.

---

## 🚀 Project Overview

**CloudRead** simulates a real-world e-commerce platform with separate microservices for:

- Frontend (React UI)
- Backend (Catalog & Order APIs)
- Recommendation Service (Python microservice)

It features a full CI/CD workflow including:

- SonarQube Code Quality Scanning  
- Trivy Security Scans  
- Automated Docker builds  
- GitOps Deployments with ArgoCD  

---

## ⭐ Key Features

### 🛍️ Customer Portal
- Google Authentication  
- Book catalog with search  
- Cart & wishlist with persistent state  
- Checkout (Cash on Delivery)  
- Order history  
- “Book of the Day” AI recommendation  

### 🛡️ Admin Dashboard
- Admin login (`admin/password`)  
- Inventory management (CRUD)  
- Order management  
- Real-time stock validation  

---

## 🏗️ Architecture Overview

CloudRead follows a **Monorepo** structure where each microservice lives inside a single repository but is deployed independently.

### Tech Stack

| Component | Technology |
|----------|------------|
| Frontend | React, Vite, Tailwind, Firebase Auth, Lucide Icons |
| Backend | Node.js, Express |
| ML Service | Python 3.9, Flask |
| Containerization | Docker |
| Orchestration | Kubernetes (EKS), Ingress |
| CI/CD | GitLab CI, ArgoCD |
| Quality & Security | SonarQube, Trivy |

---

## 🛠️ Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Docker

---

### 1. Clone Repository
```bash
git clone https://gitlab.com/your-username/cloudread.git
cd cloudread

cd backend
npm install
node server.js

cd recommendation-service
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py


cd frontend
npm install
npm run dev
```

## 🎡 CI/CD Pipeline & GitOps Flow

### 🔐 Required GitLab CI Variables

Go to **Settings → CI/CD → Variables** and add the following:

| Variable          | Description                                 | Type      | Protected |
|-------------------|---------------------------------------------|-----------|-----------|
| `DOCKER_USERNAME` | Docker Hub username                         | Variable  | No        |
| `DOCKER_PASSWORD` | Docker Hub access token                     | Variable  | Yes       |
| `SONAR_HOST_URL`  | SonarQube server URL                        | Variable  | No        |
| `SONAR_TOKEN`     | SonarQube authentication token              | Variable  | Yes       |
| `CI_PUSH_TOKEN`   | GitLab Project Access Token (write access)  | Variable  | Yes       |


## 🎡 CI Pipeline Workflow

| Stage             | Description                      |
|-------------------|----------------------------------|
| **Test**          | SonarQube scan                   |
| **Build**         | Build Docker image               |
| **Scan**          | Trivy vulnerability scan         |
| **Push**          | Push image with commit SHA       |
| **Update Manifests** | Update image tag in YAML      |
| **Deploy (GitOps)** | ArgoCD syncs the cluster       |

---

## 📂 Project Structure

```text
cloudread/
├── frontend/                   # React application
│   ├── src/
│   ├── Dockerfile
│   └── vite.config.js
├── backend/                    # Node.js API
│   ├── server.js
│   └── Dockerfile
├── recommendation-service/     # Python Flask API
│   ├── app.py
│   └── Dockerfile
├── k8s/                        # Kubernetes manifests
│   ├── backend.yaml
│   ├── frontend.yaml
│   ├── recommendation.yaml
│   └── ingress.yaml
├── .gitlab-ci.yml              # CI/CD pipeline
└── sonar-project.properties    # SonarQube config
```


---

## 🔗 API Reference

### **Backend (Node.js) – Port 3001**

| Method | Endpoint            | Description         |
|--------|----------------------|---------------------|
| GET    | `/api/books`         | List all books      |
| POST   | `/api/books`         | Add book (Admin)    |
| PUT    | `/api/books/:id`     | Update book (Admin) |
| DELETE | `/api/books/:id`     | Delete book         |
| GET    | `/api/orders`        | List orders         |
| POST   | `/api/orders`        | Place order         |

---

### **Recommendation Service (Python) – Port 5000**

| Method | Endpoint                | Description                         |
|--------|--------------------------|-------------------------------------|
| GET    | `/api/recommendations`   | Returns a random book recommendation |
