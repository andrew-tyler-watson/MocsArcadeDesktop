export class LibraryEntry {
  isDownloaded = false;
  isUpdateAvailable = false;
  installPath = '';
  gameId = -1;
  caveId = -1;
  prereqsDir = '';
  playableVersions = [];

  constructor(gameId) {
    gameId = gameId;
  }
}
