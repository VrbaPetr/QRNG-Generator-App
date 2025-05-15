![image](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![image](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![image](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![image](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![image](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![image](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![image](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## QRNG Generator App - Develop Version

This document provides an overview of the main development repository for the QRNG project, including a breakdown of its core components and instructions for execution using Docker Compose.

**DEVELOPER VERSION IS FOR FURTHER DEVELOPMENT OF APP COMPONENTS WITHOUT QRNG CARD AVAILABLE AT A TIME**

---

## Repository Structure

The repository is composed of the following principal components:

- **API (`backend/`)**: A Node.js-based service that exposes endpoints for communication with the QRNG card and the underlying database.
- **Database (`database/`)**: A MySQL-based relational database initialized using SQL scripts to support the storage and retrieval of QRNG data.
- **Frontend (`frontend/`)**: A web interface built using modern web technologies, designed to interact with the API and provide user-facing features.

**This branch doesn't contain QRNG Driver - see saparate service or main branch**

---

## Running the Development Environment

The entire development environment is containerized. To build and start all services, use the following command from the root directory:

```bash
docker-compose up --build
```

This will initiate the API server, database, and frontend in their respective containers, as defined in the `docker-compose.yml` file.

---

## Cleaning the Environment

In cases where configuration changes or volume resets are required, it is advisable to remove all associated Docker volumes. This can be done with the following command:

```bash
docker-compose down --volumes
```

This will ensure that all persistent data and container volumes are deleted and a fresh setup can be executed.
