#!/bin/bash

/etc/init.d/ssh start

# Download the right llm Model

/bin/ollama pull llama3

/vin/ollama serve