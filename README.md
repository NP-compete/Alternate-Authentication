# 🎉🎊🏆Winners of Smart India Hackathon (World's Biggest Hackathon) 2019🎁🥇🎖️

# Alternative to traditional credential based authentication

**Organization:**      KG Info System Pvt. Ltd

**Category:**          Software

**Technology Bucket:** Software - Web App Development

**Problem Code:**      RV3

## Working Demo

A working demo can be seen [here](https://www.youtube.com/watch?v=SF3bruNefgk&feature=youtu.be)

## Initial Idea:

Implementing a new system induces high cost for any organization. So our solution upgrades the existing
system instead of replacing it. We propose a blockchain powered decentralized, and secure approach built on top of the existing system of username and password.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

1. Docker
2. Docker-compose
3. NodeJS

### Installing

#### Clone this repo

```
git clone https://github.com/NP-compete/Alternate-Authentication
```

#### Install Dependencies

```
cd Alternate-Authentication/
npm install
```

#### Install the chrome extension

```
goto: chrome://extensions in the browser and enable 'developer mode'
press Load unpacked and target the folder Application/Extension/
```

#### Home Users

##### Run server

```
cd Application/Desktop/
npm install
cd backend/
node server.js
```

##### Activate the extension

```
Activate the extension by clicking the extension icon
```

#### For enterprise

##### Start Bigchaindb

```
cd Alternate-Authentication/Enterprise/BlockChain/Server/bigchaindb
make run
```

##### For desktop app

The desktop app can be used for OTP Authentication and changing authentication level.

```
npm i
cd Alternate-Authentication/Application/Desktop/
npm start
```

Go to one of the websites where there is an login with a username and password , fill the fields and click login.
Load again the site and the fields will be filled in automatically
By default they are stored in Google Drive.


## Built With

* [Node JS](https://nodejs.org/en/) - The JavaScript RunTime
* [Electron](https://electronjs.org/) - For building cross-platform desktop application
* [BigChainDB](https://www.bigchaindb.com/) - Used to create the enterprise solution

## Authors

* **Soham Dutta** - [NP-compete](https://github.com/NP-compete)
* **Abhishek Verma** - [abhishek-verma](https://github.com/abhishek-verma)
* **V. Nandini Soni** - [nandini8](https://github.com/nandini8)
* **Mridul Gain** - [mridulgain](https://github.com/mridulgain)
* **Shivam Gangwar** - [shivamHCU](https://github.com/shivamHCU)
* **Gaurav** - [gaurav476](https://github.com/gaurav476)

See also the list of [contributors](https://github.com/NP-compete/Alternate-Authentication/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Dr Y V Subba Rao
* Dr Anjenya Swami Kare
