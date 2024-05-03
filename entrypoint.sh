#!/bin/bash

## Configure runpodctl

runpodctl config --apiKey $API_KEY

## Start the Proxy
nohup node /app/backend/mein-node-projekt/api.js &

## Start the UI

./start.sh