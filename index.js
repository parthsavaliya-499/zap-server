const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Import morgan

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(morgan('tiny')); // Use morgan for logging

let hooks = [];

// Endpoint to handle subscription
app.post('/api/hooks', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing target URL' });
    }

    const hook = { id: hooks.length + 1, url };
    hooks.push(hook);

    res.status(201).json(hook);
});

// Endpoint to handle unsubscription
app.delete('/api/hooks/:id', (req, res) => {
    const { id } = req.params;

    hooks = hooks.filter(hook => hook.id !== parseInt(id));

    res.status(204).send();
});

// Endpoint to send data to subscribed URLs
app.post('/api/data', (req, res) => {
    const data = req.body;

    hooks.forEach(hook => {
        // Here you would send a request to the hook URL with the data.
        // For simplicity, we just log it to the console.
        console.log(`Sending data to ${hook.url}:`, data);
    });

    res.status(200).json({ message: 'Data sent to all hooks' });
});

// Endpoint to get all hooks
app.get('/api/hooks', (req, res) => {
    res.status(200).json(hooks);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
