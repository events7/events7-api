const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const url = 'http://localhost:3000/docs-json';
const outputDir = path.join(__dirname, '..', 'src', 'shared', 'events7-shared');
const outputFile = path.join(outputDir, 'api-types.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const client = url.startsWith('https') ? https : http;

client
  .get(url, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Failed to fetch: Status Code ${res.statusCode}`);
      res.resume(); // Consume response data to free up memory
      process.exit(1);
    }

    const file = fs.createWriteStream(outputFile);
    res.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log(`Downloaded api-types.json to ${outputFile}`);
    });
  })
  .on('error', (err) => {
    console.error(`Request failed: ${err.message}`);
    process.exit(1);
  });
