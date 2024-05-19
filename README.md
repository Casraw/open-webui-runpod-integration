# RunPod Ollama Control Server

## Overview
This server manages Ollama instances on RunPod.io and serves as the backend, while the OpenWeb-UI functions as the frontend interface. It is specifically optimized for use on RunPod and utilizes RunPod Secrets for configuration. The server endpoints offer comprehensive management capabilities for pods.

## Features

- **Install Pod**: Installs a pod, downloads the specified LLM, updates the settings of the main OpenWeb-UI Pod, and restarts it via the `/install-pod` endpoint.
- **Kill Pod**: Completely removes the Ollama node via the `/kill-pod` endpoint.
- **Start Pod**: Launches an Ollama instance via the `/start-pod` endpoint.
- **Stop Pod**: Terminates an existing Ollama instance via the `/stop-pod` endpoint.
- **Automatic Shutdown**: Ollama pods automatically shut down after 10 minutes by default. To prevent this, invoke the `/start-pod` endpoint again before the 10 minutes expire.

## Requirements

The server is exclusively designed for operation on RunPod.io and uses specific RunPod Secrets:

- `API_KEY`: Read and Write API Key for RunPod (`{{ RUNPOD_SECRET_runpod-api }}`).
- `LLM`: Determines which Language Model (LLM) will be used (`{{ RUNPOD_SECRET_llm }}`).
- `GPU_COUNT`: Specifies the number of Nvidia RTX 3090 graphics cards to be used (`{{ RUNPOD_SECRET_gpucount }}`).

### Network Storage

The OpenWeb-UI requires network storage to ensure persistent data management across pod sessions. This storage should be configured to allow seamless data retrieval and updates by the OpenWeb-UI.

## RunPod Deployment

- **Docker Compatibility**: This server operates as a Docker container on RunPod.io. It is specifically optimized for this platform, meaning that the API endpoints utilize specific functions of RunPod.io that are not available in other environments.
- **RunPod Template**: For seamless integration and easy setup, use the specific template on RunPod.io. This template automatically configures all necessary settings and ensures that the container is correctly executed in the RunPod environment. [Deploy on RunPod](https://www.runpod.io/console/explore/cixh50m096)

## OpenWeb-UI

- **Frontend Integration**: The OpenWeb-UI serves as the frontend for this backend system, providing a user-friendly interface for managing Ollama instances. It allows users to start, stop, and monitor the status of the pods.

## Links

- **Website**: [Website](https://controlserver.ai)
- **GitHub**: [Casraw/open-webui-runpod-integration](https://github.com/Casraw/open-webui-runpod-integration)
- **DockerHub - Server Image**: [casraw/open-webui-runpod-integration](https://hub.docker.com/repository/docker/casraw/open-webui-runpod-integration/general)
- **DockerHub - Ollama Image**: [casraw/ollama-runpod](https://hub.docker.com/repository/docker/casraw/ollama-runpod/general)
- **RunPod.io Template**: [Deploy on RunPod](https://www.runpod.io/console/explore/cixh50m096)

## Contributing

- To contribute to development, please register using this [Referral Link](https://runpod.io?ref=vtmhuzd2) to RunPod and support the project.

## Future Plans

- Expand server functionality with additional APIs and improved authentication mechanisms.
- Integrate more features and tools in the OpenWeb-UI for better control and monitoring of Ollama instances.

For further questions or contributions, please open an issue or submit a pull request.
