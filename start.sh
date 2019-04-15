#!/usr/bin/env bash

python -m pip install bigchaindb-driver

cd Alternate-Authentication/
npm install

cd Application/Desktop/
npm install
sh ../../Enterprise/Blockchain/Server/fixBuffer.sh
cd backend/
node server.js

