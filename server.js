const express = require('express');
const cors = require('cors'); // Import cors middleware
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 4000;

// Use CORS middleware to allow requests from all origins
app.use(cors('*' ));
app.use(express.json());

app.post('/run', (req, res) => {
    const cppCode = req.body.code;
    const inputs = req.body.inputs || []; // Default to empty array if no inputs are provided
    const filename = 'program.cpp';

    // Write the C++ code to a file
    fs.writeFileSync(filename, cppCode);

    // Compile the C++ code
    exec(`g++ ${filename} -o program`, (error, stdout, stderr) => {
        if (error) {
            return res.json({ output: stderr });
        }

        // Execute the compiled program with inputs
        const inputStr = inputs.join('\n');
        
        exec(`echo "${inputStr}" | ./program`, (runError, runStdout, runStderr) => {
            if (runError) {
                return res.json({ output: runStderr });
            }
            res.json({ output: runStdout });
        });
    });
});


app.post('/commandrun', (req, res) => {
    const { command } = req.body;

    console.log(command)
    exec(command, (error, stdout, stderr) => {
      if (error) {
        res.send({ output: stderr });
      } else {
        res.send({ output: stdout });
      }
    });
  });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
