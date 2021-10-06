var fs = require('fs');
var path = require('path');

import { ReplaySubject } from 'rxjs';
import { ipcRenderer } from 'electron';
import { Observable } from 'rxjs';
import { LibraryEntry } from '../models/libraryEntry'

export default class LibraryService {
  libraryEntries$ = new ReplaySubject(1);

  constructor(games) {
    this.buildLibraryEntries(games).subscribe(this.libraryEntries$);
  }

  isGameDownloaded(game) {}

  isLatestRequiredVersionDownloaded(game) {}

  isBetaVersionDownloaded(game) {}

  folderExists(path) {}

  downloadGame(game, revision, callback) {
    const gameUrl = this.getGoogleDriveDownloadUrl(revision.fileId);
    const outputPath = this.getLibraryOutputPath(game, revision);
    return new Observable((observer) => {
      this.ipcRenderer.on('downloadComplete', (event, arg) => {
        callback(arg);
      });

      ipcRenderer.send('download', gameUrl);
    });
  }

  buildLibraryEntry(game) {
    const entry = new LibraryEntry();

    entry.revisions = this.getLibraryEntryRevisions(game.gameInfo.name)

    entry.isDownloaded = entry.revisions.

  }

  getLibraryEntryRevisions(gameName){
    const homeDir = path.resolve(__dirname, 'library', gameName);

    return fs.readdir(homeDir).filter((file) => {
      return fs.stat(path.resolve(homeDir, file)).isDirectory();
    }).map(folder => { return { revision: folder.name }});
  }

  checkGame(game, gamesHomeDir) {
    let homeDir, versionDirs;

    [homeDir, ...versionDirs] = buildGameDirectoryLists(game, gamesHomeDir);

    fs.access();
  }

  buildGameDirectoryLists(game, gamesHomeDir) {
    let output = [];

    output.push(gamesHomeDir);

    game.revisionHistory.revisions.forEach((revision) => {
      output.push(
        gamesHomeDir + '/' + game.gameInfo.name + '/' + revision.version
      );
    });

    return output;
  }

  getLibraryOutputPath(game, revision) {
    return path.join(
      __dirname,
      'library',
      game.gameInfo.name,
      revision.version
    );
  }

  getGoogleDriveDownloadUrl(fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
}
