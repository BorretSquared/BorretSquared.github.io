const fs = require('fs');

const inputFile = 'wordsListGreaterThan3.txt';
const outputFile = 'wordsListGreaterThan32.txt';

const readStream = fs.createReadStream(inputFile);
const writeStream = fs.createWriteStream(outputFile);

let wordMap = new Map();

readStream.on('data', chunk => {
  const lines = chunk.toString().split('\n').filter(line => line.trim().length <= 8);
  
  lines.forEach((line) => {
    const word = line.trim();
    const length = word.length;
    
    if (wordMap.has(length)) {
      const wordsWithSameLength = wordMap.get(length);
      const sameLengthWords = wordsWithSameLength.filter((w) => w !== word && w.split('').sort().join('') !== word.split('').sort().join(''));
      sameLengthWords.push(word);
      wordMap.set(length, sameLengthWords);
    } else {
      wordMap.set(length, [word]);
    }
  });
});

readStream.on('end', () => {
  wordMap.forEach((words, length) => {
    const filteredWords = words.join('\n');
    writeStream.write(filteredWords + '\n');
  });
  
  console.log('File successfully filtered!');
});

readStream.on('error', err => {
  console.error(err);
});

writeStream.on('error', err => {
  console.error(err);
});

writeStream.on('finish', () => {
  console.log('File successfully written!');
});
