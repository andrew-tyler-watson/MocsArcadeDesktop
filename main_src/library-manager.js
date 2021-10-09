const urllib = require('urllib');
var fs = require('fs');
const { app } = require('electron');
const path = require('path');

class LibraryManager {
  libraryPath = path.resolve(app.getPath('appData'), app.name, 'Library');

  constructor() {
    this.initLibrary();
  }

  getLibraryPath() {
    return this.libraryPath;
  }

  initLibrary() {
    if (!fs.existsSync(this.libraryPath)) {
      fs.mkdirSync(this.libraryPath);
    }
  }

  initDirectory(directory) {
    const theDir = path.join(this.libraryPath, directory);
    console.log(`Initializing ${theDir}`);
    if (!fs.existsSync(theDir)) {
      fs.mkdirSync(theDir);
    }
  }

  downloadGame(url, gameName, version) {
    this.initDirectory(gameName);
    this.initDirectory(path.join(gameName, version));
    const outputPath = path.join(
      this.libraryPath,
      gameName,
      version,
      `${gameName}.zip`
    );

    const filePath = fs.createWriteStream(outputPath);

    filePath
      .on('finish', () => {
        filePath.close();
        return { response: 'success' };
      })
      .on('error', (err) => {
        return { response: 'error', error: err };
      });

    urllib
      .request(url, {
        followRedirect: true,
        writeStream: filePath,
        timeout: 5000,
      })
      .then(function (result) {
        console.log(`Promise : ${JSON.stringify(result)}`);
      })
      .catch(function (err) {
        if (err) {
          console.log(`error in the ur lib request ${JSON.stringify(err)}`);
        }
      });
  }
}

module.exports = LibraryManager;
