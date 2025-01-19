FROM ghcr.io/open-webui/open-webui:main

# Set the shell to bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install dependencies and upgrade
RUN apt-get update && apt-get upgrade -y && apt-get install -y curl wget gnupg2 procps ca-certificates nginx git python3 sudo procps
RUN pip install --upgrade pip

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - &&\
apt-get install -y nodejs

RUN mkdir mein-node-projekt && cd mein-node-projekt && npm init -y && npm install express && cd -
COPY api.js /app/backend/mein-node-projekt/api.js

# Install Runpod
RUN wget -qO- cli.runpod.net |  bash

# Create API endpoint
COPY entrypoint.sh /app/backend/entrypoint.sh
RUN chmod +x /app/backend/entrypoint.sh
EXPOSE 8081
RUN mkdir /root/.runpod &&  touch /root/.runpod/.runpod.yaml
RUN runpodctl config --apiKey test | echo "Needs to be fixed :-D"

CMD [ "bash", "entrypoint.sh" ]
