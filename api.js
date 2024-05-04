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
    const cmd = `sudo /usr/local/bin/runpodctl create pod --name "ollama-node" --communityCloud --gpuCount 1 --gpuType "NVIDIA GeForce RTX 3090" --containerDiskSize 20 --imageName "casraw/ollama-runpod" --volumeSize 100 --volumePath "/root/.ollama" --env LLM_MODEL=llama3 --ports "11434/http"`;
    
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send(`Error install pod: ${stderr}`);
        }
        res.send('Pod installed successfully!');

        // Set timer to automatically stop the pod after 10 minutes
        clearTimeout(timer);
        timer = setTimeout(() => {
            const stopCmd = `sudo /usr/local/bin/runpodctl stop pod ${podName}`;
            exec(stopCmd);
        }, 600000); // 600000 milliseconds = 10 minutes
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
