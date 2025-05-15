# QRNG Database – Deployment and Structure Overview

This document outlines the essential information related to the deployment and structure of the database used in the QRNG project.

---

## Deployment Instructions

The database is containerized and can be initialized using Docker Compose. To build and run the database service, execute the following command in the root directory of the project:

```bash
docker-compose up --build
```

This will start the database container and apply the initial schema automatically.

---

## Schema Initialization

The file `init.sql` contains the SQL statements required to set up the database schema. It includes the creation of foundational tables, using conditional statements to ensure that tables are only created if they do not already exist.

This script is mounted as a volume and automatically executed on first startup.

---

## Access Credentials

The default database credentials are defined directly within the `docker-compose.yml` file. These credentials are used during container initialization and can be modified as needed.

### Example Credentials:
```yaml
MYSQL_ROOT_PASSWORD: example_root_password
MYSQL_DATABASE: qrng_generated_results
MYSQL_USER: main_user
MYSQL_PASSWORD: r8yjIPuM1hszPKPGPJ
```

These values should be kept secure and managed appropriately in production environments.
