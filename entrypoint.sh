#!/bin/bash

## Configure runpodctl

rm -r /root/.runpod/ssh
rm -r /root/.runpod/.runpod.yaml
sudo runpodctl config --apiKey $API_KEY

## Start the Proxy
nohup node /app/backend/mein-node-projekt/api.js &

## Start the UI

./start.sh