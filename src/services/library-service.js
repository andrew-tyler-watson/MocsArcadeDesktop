var fs = require('fs');
var path = require('path');

import { ReplaySubject } from 'rxjs';
import { ipcRenderer } from 'electron';
import { Observable } from 'rxjs';
import { LibraryEntry } from '../models/libraryEntry';

export default class LibraryService {
  libraryPath = '';
  downloadEmitter$ = new ReplaySubject(1);
  downloadProgressEmitter$ = new ReplaySubject(1);

  constructor() {
    if (this.doesLibraryExist()) {
      fs.mkdir(this.libraryPath);
    }

    this.subscribeEmitters();

    ipcRenderer.send('requestLibraryPath');
    this.downloadProgressEmitter$.subscribe((r) => {
      console.log(`Download progress: ${r}`);
    });
  }

  doesLibraryExist() {
    return fs.existsSync(this.libraryPath);
  }

  isGameDownloaded(gameName) {
    const gamePath = path.resolve(this.libraryPath, gameName);
    fs.access(gamePath, function (error) {
      if (error) {
        return false;
      } else {
        return true;
      }
    });
  }

  downloadGame(game, revision) {
    // const gameUrl = this.getDownloadUrl(game, revision);

    // console.log(`The game: ${JSON.stringify(game)}`);
    // console.log(`The revision: ${JSON.stringify(revision)}`);
    // console.log(`The url: ${gameUrl}`);
    // const args = [game.gameInfo.name];

    return new Observable((subscriber) => {
      ipcRenderer.on('downloadProgress', (event, args) => {
        subscriber.next({
          response: 'progress',
          percent: args,
        });
      });
      ipcRenderer.once('downloadComplete', (event, args) => {
        subscriber.next({ response: 'complete' });
      });

      ipcRenderer.send('downloadItch', ['Short Circuit', 1086325]);
    });
  }

  getLibraryEntries(games) {
    const entries = games.map((x) => {
      return this.buildLibraryEntry(x);
    });
    return new Observable((subscriber) => {
      subscriber.next(entries);
    });
  }

  buildLibraryEntry(game) {
    const entry = new LibraryEntry();
    entry.gameName = game.gameInfo.name;
    entry.isDownloaded = this.isGameDownloaded(game.gameInfo.name);

    if (!entry.isDownloaded) {
      return entry;
    }

    entry.revisions = this.getLibraryEntryRevisions(game.gameInfo.name);

    entry.isLatestStableVersionDownloaded =
      entry.revisions.filter((x) => {
        x.name == game.revisionHistory.latestStableRelease;
      }).length > 0;
    entry.isUpdateRequired = !entry.isLatestRequiredVersionDownloaded;
    entry.launchScriptPath = path.resolve(
      __dirname,
      'library',
      gameName,
      game.revisionHistory.latestStableRelease
    );

    return entry;
  }

  getLibraryEntryRevisions(gameName) {
    const homeDir = path.resolve(this.libraryPath, gameName);

    return fs
      .readdir(homeDir)
      .filter((file) => {
        return fs.stat(path.resolve(homeDir, file)).isDirectory();
      })
      .map((folder) => {
        return { revision: folder.name };
      });
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
    return path.join(this.libraryPath, game.gameInfo.name, revision.version);
  }

  getDownloadUrl(game, revision) {
    if (game.isGoogleDriveDownload !== undefined) {
      return this.getGoogleDriveDownloadUrl(revision.fileId);
    }
    return revision.url;
  }

  getGoogleDriveDownloadUrl(fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  subscribeEmitters() {
    // ipcRenderer.on('downloadProgress', (event, args) => {
    //   this.downloadProgressEmitter$.next(args);
    //   console.log(args);
    // });
    // ipcRenderer.on('requestLibraryPathResponse', (event, args) => {
    //   console.log(`Getting the library dir ${args}`);
    //   this.libraryPath = args;
    // });
  }
}
