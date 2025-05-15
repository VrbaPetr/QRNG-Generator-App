![image](https://img.shields.io/badge/Ubuntu-77216F?style=for-the-badge&logo=ubuntu&logoColor=white)
![image](https://img.shields.io/badge/Python-306998?style=for-the-badge&logo=python&logoColor=white)
![image](https://img.shields.io/badge/Flask-FFD43B?style=for-the-badge&logo=flask&logoColor=white)
![image](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![image](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![image](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![image](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![image](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![image](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![image](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## QRNG Generator App - PROD Version

This document provides an overview of the main development repository for the QRNG project, including a breakdown of its core components and instructions for execution using Docker Compose.

**PROD VERSION EXPECT COMMUNICATION WITH QRNG. THE QRNG CARD MUST ME AVAILABLE TO RUN THIS PROJECT**

---

## Repository Structure

The repository is composed of the following principal components:

- **API (`backend/`)**: A Node.js-based service that exposes endpoints for communication with the QRNG card and the underlying database.
- **Database (`database/`)**: A MySQL-based relational database initialized using SQL scripts to support the storage and retrieval of QRNG data.
- **Frontend (`frontend/`)**: A web interface built using modern web technologies, designed to interact with the API and provide user-facing features.

**This branch doesn't contain QRNG Driver - see saparate service or main branch**

---

## Running the  Environment

The entire environment is containerized. To build and start all services, use the following command from the root directory:

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

## QRNG Driver Install
Driver compilation is required for QRNG Card Access
```
# open terminal with root permissions
sudo -i

# navigate to qrng-connecter
cd /qrng-connecter/Drivers/linux/driver/

# build driver
make

# install driver
make install

# load driver to system
modprobe quantis_chip_pcie

# optionaly: to check if driver loaded properly
dmesg | grep quantis

# if system return serial number and chip version, driver is loaded successfuly
# now you can use EasyQuantis Parser
```
## Accessing QRNG 
If you want only to use Easy Quantis Application, use this command
```
EasyQuantis
```
If you want to use CLI Parser for EasyQuantis, use same command with specific flags to communicate with card
```
# for help menu
EasyQuantis -h

# to show all QRNG devices connected
EasyQuantis -l
```
More informations about ReasyQuantis CLI Parses are available in the project documentation

## Starting QRNG Python Server
Project contains custom made server with REST API point to generate specific data
```
# open terminal with root permissions
sudo -i

# navigate to project
cd /quantis-connecter/

# start server
python3 connecter.py
```

