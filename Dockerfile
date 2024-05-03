FROM ghcr.io/open-webui/open-webui:main

# Set the shell to bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install dependencies
RUN apt-get update && apt-get install -y curl wget gnupg2 procps ca-certificates nginx git python3 sudo procps

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - &&\
apt-get install -y nodejs

RUN mkdir mein-node-projekt && cd mein-node-projekt && npm init -y && npm install express && cd -
COPY api.js /app/backend/mein-node-projekt/api.js

# Install Runpod
RUN wget -qO- cli.runpod.net |  bash

# Create API endpoint
COPY entrypoint.sh /app/backend/entrypoint.sh
EXPOSE 8081
RUN runpodctl config --apiKey test

CMD [ "bash", "entrypoint.sh" ]