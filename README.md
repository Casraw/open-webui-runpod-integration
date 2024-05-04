# RunPod Ollama Control Server

This project is an Express web server that interfaces with the open-webui to manage Ollama instances on RunPod. It includes a set of RESTful API endpoints to start and stop Ollama pods dynamically, with additional functionalities and security features planned for future updates.

## Features

- **Start Pod**: Trigger the start of an Ollama instance via the `/start-pod` endpoint.
- **Stop Pod**: Terminate an existing Ollama instance via the `/stop-pod` endpoint.
- **Automatic Shutdown**: By default, the started Ollama pod will automatically shut down after 10 minutes. To prevent this, call the `/start-pod` endpoint again before the 10-minute mark.

## Requirements

This server is intended to run on a RunPod.io pod as a Docker container. The following environment variables are necessary:

- `API_KEY`: Read and write API key for RunPod.
- `OLLAMA_BASE_URL`: Endpoint URL for the Ollama backend.
- `OLLAMA_POD_NAME`: Currently requires the pod ID (not the name).

## Docker Container

The server runs inside a Docker container. The Docker image is available on Docker Hub:

```
casraw/open-webui-runpod-integration
```

### Pulling the Docker Image

Pull the Docker image using:

```bash
docker pull casraw/open-webui-runpod-integration
```

### Running the Docker Container

To run the container on your local machine or another environment, use:

```bash
docker run -p 8081:8081 -p 8080:8080 -e API_KEY=<Your_API_Key> -e OLLAMA_BASE_URL=<Your_Ollama_Base_URL> -e OLLAMA_POD_NAME=<Your_Ollama_Pod_ID> -v open-webui:/app/backend/data casraw/open-webui-runpod-integration
```

Make sure to replace `<Your_API_Key>`, `<Your_Ollama_Base_URL>`, and `<Your_Ollama_Pod_ID>` with your actual environment variable values. The volume mount `-v open-webui:/app/backend/data` is recommended to preserve user data.

### RunPod Template

For those looking to deploy directly on RunPod.io, a template is available which simplifies the process of setting up and running this Docker container in the RunPod environment. This template includes pre-configured settings optimized for use with RunPod services.

## Volume Mounts

It is recommended to use the standard volume mount to preserve user data:
- Mount `open-webui:/app/backend/data`.

## Links

- **DockerHub**: [casraw/open-webui-runpod-integration](https://hub.docker.com/r/casraw/open-webui-runpod-integration)
- **GitHub**: [Casraw/open-webui-runpod-integration](https://github.com/Casraw/open-webui-runpod-integration)

## Contributing

Interested in contributing? Great! You can start by registering on RunPod using this [referral link](https://runpod.io?ref=vtmhuzd2) to help support the project.

## Future Plans

- Implement authentication mechanisms.
- Extend the API with more functionalities.

For any issues or contributions, please open an issue or submit a pull request.