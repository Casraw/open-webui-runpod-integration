#!/bin/bash

## Configure runpodctl

runpodctl config --apiKey $API_KEY
rm -r /root/.runpod/.runpod.yaml

## Start the Proxy
nohup node /app/backend/mein-node-projekt/api.js &

## Start the UI

./start.sh