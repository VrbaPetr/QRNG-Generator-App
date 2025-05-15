![image](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![image](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)

## QRNG API
This document provides instructions for deploying the API server designed to interface with the QRNG card, as well as an overview of the available HTTP endpoints.

---

## Running the API with Docker

### 1. Build the Docker image
```bash
docker build -t qrng-api .
```

### 2. Run the container
```bash
docker run -p 3000:3000 qrng-api
```

### 3. Access the API
After deployment, the API will be accessible at:

```
http://localhost:3000
```

---

## Base Endpoint

### `GET /`
Used to verify that the API server is operational.

**Response:**
```json
"API uspěšně spuštěna!"
```

---

## Registered Routes

| Path         | Description                          |
|--------------|--------------------------------------|
| `/records`   | Endpoints for handling QRNG records  |
| `/temp`      | Endpoints for code synchronization   |
| `/logs`      | Endpoints for accessing logs         |
| `/access`    | Endpoints for authentication         |

Each router contains its own set of HTTP methods (e.g., GET, POST), which can be described in more detail depending on specific integration requirements.

---

## Configuration Notes

- The port `3000` is hardcoded in `server.js` and is not controlled via environment variables.
- The application is developed using [Express.js](https://expressjs.com/) and is fully containerized using Docker.
- Environment variable configuration for database access is supported.

### Example `.env` file for development
```env
DB_HOST=db
DB_PORT=3306
DB_USER=main_user
DB_PASSWORD=r8yjIPuM1hszPKPGPJ
DB_NAME=qrng_generated_results
```
