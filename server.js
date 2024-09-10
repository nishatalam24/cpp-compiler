const express = require('express');
const cors = require('cors'); // Import cors middleware
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors("*")); // Use cors middleware
app.use(express.json());

app.post('/run', (req, res) => {
    const cppCode = req.body.code;
    const filename = 'program.cpp';

    // Write the C++ code to a file
    fs.writeFileSync(filename, cppCode);

    // Compile the C++ code
    exec(`g++ ${filename} -o program && ./program`, (error, stdout, stderr) => {
        if (error) {
            return res.json({ output: stderr });
        }
        res.json({ output: stdout });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
