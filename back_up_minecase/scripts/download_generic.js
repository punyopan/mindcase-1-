const https = require('https');
const fs = require('fs');
const path = require('path');

const fileUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Jigsaw_Puzzle_Piece.svg/240px-Jigsaw_Puzzle_Piece.svg.png";
const destPath = path.join(__dirname, '../puzzles/new_default.png');

const file = fs.createWriteStream(destPath);
https.get(fileUrl, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close(() => console.log("Download complete: new_default.png"));
  });
}).on('error', function(err) {
  fs.unlink(destPath); 
  console.error("Error downloading image:", err.message);
});
