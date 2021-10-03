var fs = require('fs');

export default class LibraryService {
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
}
