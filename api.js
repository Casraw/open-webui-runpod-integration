const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 8081;

let timer = null;

app.get('/start-pod', (req, res) => {
    const podName = process.env.OLLAMA_POD_NAME;
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
    const podName = process.env.OLLAMA_POD_NAME;
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

// Hilfsfunktion, um den Pod-Status zu überprüfen
function checkPodIsReady(podName, callback) {
    const checkCmd = `sudo /usr/local/bin/runpodctl get pod | awk '/${podName}/ {print $7; exit}'`; // Angenommen, $3 gibt den Status zurück
    exec(checkCmd, (error, stdout, stderr) => {
        if (error || stderr) {
            console.error(`Error checking pod status: ${stderr}`);
            return setTimeout(() => checkPodIsReady(podName, callback), 1000); // Wiederholen nach 1 Sekunde
        }
        if (stdout.trim() === 'RUNNING') { // Annahme: 'Running' ist der Status eines einsatzbereiten Pods
            callback();
        } else {
            setTimeout(() => checkPodIsReady(podName, callback), 1000); // Wiederholen, bis der Status 'Running' ist
        }
    });
}

app.get('/install-pod', (req, res) => {
    const gpuCount = process.env.GPU_COUNT;
    const llm = process.env.LLM;
    const installCmd = `sudo /usr/local/bin/runpodctl create pod --name "ollama-node" --communityCloud --gpuCount ${gpuCount} --gpuType "NVIDIA GeForce RTX 3090" --containerDiskSize 20 --imageName "casraw/ollama-runpod:main" --volumeSize 100 --volumePath "/root/.ollama" --env LLM_MODEL=${llm} --ports "11434/http"`;

    exec(installCmd, (installError, installStdout, installStderr) => {
        if (installError) {
            console.error(`Error: ${installStderr}`);
            return res.status(500).send(`Error installing pod: ${installStderr}`);
        }

        // Warten, bis der Pod betriebsbereit ist
        checkPodIsReady('ollama-node', () => {
            const getPodIdCmd = `sudo /usr/local/bin/runpodctl get pod | awk '/ollama-node/ {print $1; exit}'`;
            exec(getPodIdCmd, (getPodIdError, ollamaPodId, getPodIdStderr) => {
                if (getPodIdError) {
                    console.error(`Get Pod ID error: ${getPodIdStderr}`);
                    return res.status(500).send(`Error retrieving ollama-node pod ID: ${getPodIdStderr}`);
                }
                const podId = ollamaPodId.trim();

                const getIdCmd = `sudo /usr/local/bin/runpodctl get pod | awk '/open-webui/ {print $1; exit}'`;
                exec(getIdCmd, (getIdError, webuiPodId, getIdStderr) => {
                    if (getIdError) {
                        console.error(`Get ID error: ${getIdStderr}`);
                        return res.status(500).send(`Error retrieving pod ID: ${getIdStderr}`);
                    }

                    const apiKey = process.env.API_KEY;
                    const data = {
                        query: `mutation {
                          podEditJob(input: {
                            podId: "${webuiPodId.trim()}",
                            containerDiskInGb: 5,
                            dockerArgs: "",
                            env: [
                              { key: "OLLAMA_BASE_URL", value: "https://${podId}-11434.proxy.runpod.net" },
                              { key: "API_KEY", value: "{{ RUNPOD_SECRET_runpod-api }}" },
                              { key: "OLLAMA_POD_NAME", value: "${podId}" },
                              { key: "LLM", value: "{{ RUNPOD_SECRET_llm }}" },
                              { key: "GPU_COUNT", value: "{{ RUNPOD_SECRET_gpucount }}" }
                            ],
                            imageName: "casraw/open-webui-runpod-integration:latest",
                            ports: "8080/http,8081/http",
                            volumeInGb: 0,
                            volumeMountPath: "/app/backend/data"
                          }) {
                            containerDiskInGb
                            costPerHr
                            desiredStatus
                            dockerArgs
                            env
                            gpuCount
                            id
                            imageName
                            lastStatusChange
                            locked
                            machineId
                            memoryInGb
                            name
                            networkVolume {
                              dataCenterId
                              id
                              name
                              size
                            }
                            podType
                            ports
                            templateId
                            uptimeSeconds
                            vcpuCount
                            volumeInGb
                            volumeMountPath
                          }
                        }`
                      };

                      fetch(`https://api.runpod.io/graphql?api_key=${apiKey}`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                      })
                      .then(response => response.json())
                      .then(data => console.log(data))
                      .catch(error => console.error('Error:', error));
                });
            });
        });
    });
});

app.get('/kill-pod', (req, res) => {
    const podName = process.env.OLLAMA_POD_NAME;
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
