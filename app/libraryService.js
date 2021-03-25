var fs = require("fs");

function checkGame(game, gamesHomeDir) {
  let homeDir, versionDirs;

  [homeDir, ...versionDirs] = buildGameDirectoryLists(game, gamesHomeDir);

  fs.access();
}
function buildGameDirectoryLists(game, gamesHomeDir) {
  let output = [];

  output.push(gamesHomeDir);

  game.revisions.array.forEach((revision) => {
    output.push(
      gamesHomeDir + "/" + game.gameInfo.name + "/" + revision.version
    );
  });

  return output;
}
