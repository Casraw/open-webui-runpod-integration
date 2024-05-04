#!/bin/bash

/etc/init.d/ssh start

# Download the right llm Model

/bin/ollama serve &
/bin/ollama pull $LLM