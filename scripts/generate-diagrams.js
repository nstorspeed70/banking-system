const fs = require('fs');
const https = require('https');
const path = require('path');

// Read the PlantUML content
const pumlContent = fs.readFileSync(path.join(__dirname, '../docs/architecture-diagrams.puml'), 'utf8');

// Split the content into individual diagrams
const diagrams = pumlContent.split('@startuml').slice(1);

// Function to encode PlantUML text for the URL
function encodePlantUML(pumlText) {
    return Buffer.from(pumlText).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

// Function to download image
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filename);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
        }).on('error', reject);
    });
}

// Process each diagram
async function generateDiagrams() {
    for (let i = 0; i < diagrams.length; i++) {
        const diagram = '@startuml' + diagrams[i];
        const encoded = encodePlantUML(diagram);
        const url = `https://www.plantuml.com/plantuml/png/${encoded}`;
        
        // Extract diagram name from title or use index
        const titleMatch = diagram.match(/title\s+["'](.+?)["']/);
        const filename = titleMatch 
            ? titleMatch[1].replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '.png'
            : `diagram-${i + 1}.png`;
        
        const outputPath = path.join(__dirname, '../docs/diagrams', filename);
        
        console.log(`Generating ${filename}...`);
        await downloadImage(url, outputPath);
        console.log(`Generated ${filename}`);
    }
}

// Create diagrams directory if it doesn't exist
const diagramsDir = path.join(__dirname, '../docs/diagrams');
if (!fs.existsSync(diagramsDir)) {
    fs.mkdirSync(diagramsDir, { recursive: true });
}

// Generate all diagrams
generateDiagrams().then(() => {
    console.log('All diagrams generated successfully!');
}).catch(console.error);
