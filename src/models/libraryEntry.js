export class LibraryEntry {
  isDownloaded = false;
  isUpdateAvailable = false;
  installPath = '';
  gameId = -1;
  playableVersions = [];

  constructor(gameId) {
    gameId = gameId;
  }
}
