const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 8081;

let timer = null;

app.get('/start-pod', (req, res) => {
    const podName = process.env.OLLAMA_POD_NAME;;
    const cmd = `sudo /usr/local/bin/runpodctl start pod ${podName}`;
    
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send(`Error starting pod: ${stderr}`);
        }
        res.send('Pod started successfully!');

        // Set timer to automatically stop the pod after 10 minutes
        clearTimeout(timer);
        timer = setTimeout(() => {
            const stopCmd = `sudo /usr/local/bin/runpodctl stop pod ${podName}`;
            exec(stopCmd);
        }, 600000); // 600000 milliseconds = 10 minutes
    });
});

app.get('/stop-pod', (req, res) => {
    const podName = process.env.OLLAMA_POD_NAME;;
    const cmd = `sudo /usr/local/bin/runpodctl stop pod ${podName}`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send(`Error stopping pod: ${stderr}`);
        }
        res.send('Pod stopped successfully!');
        clearTimeout(timer);
        timer = null;
    });
});

app.get('/install-pod', (req, res) => {
    const installCmd = `sudo /usr/local/bin/runpodctl create pod --name "ollama-node" --communityCloud --gpuCount 1 --gpuType "NVIDIA GeForce RTX 3090" --containerDiskSize 20 --imageName "casraw/ollama-runpod" --volumeSize 100 --volumePath "/root/.ollama" --env LLM_MODEL=llama3 --ports "11434/http"`; 
    exec(installCmd, (installError, installStdout, installStderr) => {
        if (installError) {
            console.error(`Error: ${installStderr}`);
            return res.status(500).send(`Error installing pod: ${installStderr}`);
        }

        // Pod wurde erfolgreich installiert, hole die Pod-ID des "ollama-node" Pods
        const getPodIdCmd = `sudo /usr/local/bin/runpodctl get pod | awk '/ollama-node/ {print $1; exit}'`;
        exec(getPodIdCmd, (getPodIdError, ollamaPodId, getPodIdStderr) => {
            if (getPodIdError) {
                console.error(`Get Pod ID error: ${getPodIdStderr}`);
                return res.status(500).send(`Error retrieving ollama-node pod ID: ${getPodIdStderr}`);
            }
        const podId = ollamaPodId.trim();
            
        // Pod wurde erfolgreich installiert, hole die Pod-ID eines "open-webui"-Pods
        const getIdCmd = `sudo /usr/local/bin/runpodctl get pod | awk '/open-webui/ {print $1; exit}'`;
        exec(getIdCmd, (getIdError, webuiPodId, getIdStderr) => {
            if (getIdError) {
                console.error(`Get ID error: ${getIdStderr}`);
                return res.status(500).send(`Error retrieving pod ID: ${getIdStderr}`);
            }
            // Pod-ID für open-webui erhalten, führe das Curl-Kommando aus
            const apiKey = process.env.API_KEY;
            const curlCmd = `curl --request POST \
                --header 'content-type: application/json' \
                --url 'https://api.runpod.io/graphql?api_key=${apiKey}' \
                --data '{"query": "mutation { podEditJob(input: { podId: "${webuiPodId.trim()}", containerDiskInGb: 5, dockerArgs: \"\", env: [ { key: \"OLLAMA_BASE_URL\", value: \"https://${podId}-11434.proxy.runpod.net\" }, { key: \"API_KEY\", value: \"{{ RUNPOD_SECRET_runpod-api }}\" }, { key: \"OLLAMA_POD_NAME\", value: \"${podId}\" } ], imageName: \"casraw/open-webui-runpod-integration:latest\", ports: \"8080/http,8081/http\", volumeInGb: 0, volumeMountPath: \"/app/backend/data\" }) { containerDiskInGb costPerHr desiredStatus dockerArgs env gpuCount id imageName lastStatusChange locked machineId memoryInGb name networkVolume { dataCenterId id name size } podType ports templateId uptimeSeconds vcpuCount volumeInGb volumeMountPath } }"'`;

            exec(curlCmd, (curlError, curlStdout, curlStderr) => {
                if (curlError) {
                    console.error(`Curl error: ${curlStderr}`);
                    return res.status(500).send(`Error during API call: ${curlStderr}`);
                }
                res.send('Pod installed and configured successfully!');
            });
        });
    });
});


app.get('/kill-pod', (req, res) => {
    const podName = process.env.OLLAMA_POD_NAME;;
    const cmd = `sudo /usr/local/bin/runpodctl remove pods ollama-node`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send(`Error removing pod: ${stderr}`);
        }
        res.send('Pod removed successfully!');
        clearTimeout(timer);
        timer = null;
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
