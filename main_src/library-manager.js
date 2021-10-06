const urllib = require('urllib');

class LibraryManager {
  constructor() {}

  downloadGame(url, outputPath) {
    const filePath = fs.createWriteStream(outputPath);

    filePath
      .on('finish', () => {
        filePath.close();
        return { response: 'success' };
      })
      .on('error', (err) => {
        return { response: 'error', error: err };
      });

    urllib.request(
      url,
      { followRedirect: true, writeStream: filePath },
      function (err, data, res) {
        if (err) {
          throw err; // you need to handle error
        }
      }
    );
  }
}

module.exports = LibraryManager;
