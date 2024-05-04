#!/bin/bash

/etc/init.d/ssh start

# Download the right llm Model

/bin/ollama serve &
sleep 5
/bin/ollama pull $LLM_MODEL
sleep infinity