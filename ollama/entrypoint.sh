#!/bin/bash

/etc/init.d/ssh start

# Download the right llm Model

/bin/ollama pull $LLM

/vin/ollama serve