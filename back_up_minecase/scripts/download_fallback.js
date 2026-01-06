const https = require('https');
const fs = require('fs');
const path = require('path');

const fileUrl = "https://placehold.co/400x300/EEE/31343C.png?text=Logic+Puzzle&font=montserrat";
const destPath = path.join(__dirname, '../puzzles/new_default.png');

console.log(`Downloading ${fileUrl}...`);

const file = fs.createWriteStream(destPath);
https.get(fileUrl, function(response) {
  if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(() => {
            const stat = fs.statSync(destPath);
            console.log(`Download complete: new_default.png (${stat.size} bytes)`);
        });
      });
  } else {
      console.error(`Failed with status ${response.statusCode}`);
      fs.unlink(destPath, () => {}); 
  }
}).on('error', function(err) {
  fs.unlink(destPath, () => {}); 
  console.error("Error downloading image:", err.message);
});
