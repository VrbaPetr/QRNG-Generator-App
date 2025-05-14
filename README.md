![image](https://img.shields.io/badge/Ubuntu-77216F?style=for-the-badge&logo=ubuntu&logoColor=white)
![image](https://img.shields.io/badge/Python-306998?style=for-the-badge&logo=python&logoColor=white)
![image](https://img.shields.io/badge/Flask-FFD43B?style=for-the-badge&logo=flask&logoColor=white)
## QRNG Connecter
Software Extension for Ubuntu Operating System for communication with QRNG. Repository contains complete code with all important drivers for **Quantis QRNG PCIe-40M** Card and ready to go Python server. 
```
# easy install in two steps
# first download content of this repository
# copy all of the content into your system root (root permissions are required for this action)

sudo -i
cp {downloaded repository location} /qrng-connecter/

# for installation of prerequisities and server files please follow instructions in the next chapters
```
## Important Pre-Requisities
**Operating System:** Ubuntu 18.0.4 (important for drivers support)
Linux Packages
```
# module assistant
apt-get install module-assistant
m-a prepare

# quantis interface libraries
sudo apt-get install libqtcore4
sudo apt-get install libqtgui4

# sometimes you can be ask for additional resources during the make building process

# python prerequisities
sudo apt-get install python3
sudo apt-get install python3-pip

# python flask extension
pip3 install flask
```

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
## About QRNG python Server
Basic Responsibilities of QRNG Python Server
- provide endpoint /generate
- listen to calls with parameters for QRNG
- process parameters and contact QRNG
- return via REST API response with generated value
- store generated values in **generated_records** folder
- log activity on the endpoint in **logs** folder
