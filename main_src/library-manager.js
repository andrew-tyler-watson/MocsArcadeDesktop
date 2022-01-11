var fs = require('fs');
const { app, ipcMain } = require('electron');
const path = require('path');
const http = require('follow-redirects').https;
const butlerd = require('butlerd');
const { resolve } = require('path');

class LibraryManager {
  libraryPath = path.resolve(app.getPath('appData'), app.name, 'Library');
  itchApiKey = '';

  constructor(itchApiKey) {
    this.initLibrary();
    this.itchApiKey = itchApiKey;
  }

  getLibraryPath() {
    return this.libraryPath;
  }

  initLibrary() {
    if (!fs.existsSync(this.libraryPath)) {
      fs.mkdirSync(this.libraryPath);
    }
  }

  async launchItchGame(caveId) {
    return new Promise((resolve, reject) => {
      var client = this.makeClient().then((client) => {
        console.log('launch game');
        client.call(butlerd.createRequest('Launch'), {
          caveId: caveId,
          prereqsDir: '/prereqs',
        });
      });
    });
  }

  initDirectory(directory) {
    const theDir = path.join(this.libraryPath, directory);
    if (!fs.existsSync(theDir)) {
      fs.mkdirSync(theDir);
    }
  }

  async makeClient() {
    return new Promise((resolve, reject) => {
      let args = [
        '--dbpath',
        this.libraryPath.toString() + '/butler/butler.db',
        '--destiny-pid',
        `${process.pid}`,
      ];

      const instance = new butlerd.Instance({
        butlerExecutable: 'butler',
        args,
      });

      instance.getEndpoint().then((endpoint) => {
        resolve(new butlerd.Client(endpoint));
      }, reject);
    });
  }

  downloadGame(url, gameName, version, progressUpdater) {
    this.initDirectory(gameName);
    this.initDirectory(path.join(gameName, version));
    const outputPath = path.join(
      this.libraryPath,
      gameName,
      version,
      `${gameName}.zip`
    );

    const filePath = fs.createWriteStream(outputPath);

    http.get(url, function (response) {
      var len = parseInt(response.headers['content-length'], 10);
      var downloaded = 0;
      response.on('data', function (chunk) {
        downloaded += chunk.length;

        var percentDownloaded = ((100.0 * downloaded) / len).toFixed(2);

        progressUpdater(percentDownloaded);
      });
      response.on('close', function (event) {
        filePath.close();
      });
      response.pipe(filePath);
    });
  }
  /**
   * Takes a list of game ids and returns a list of library objects for those games.
   * @param {int[]} gameIds a list of game ids
   */

  async buildLibraryEntries(gameIds) {
    return new Promise((resolve, reject) => {
      this.makeClient()
        .then((client) => {
          return client.call(butlerd.createRequest('Fetch.Caves'), {});
        })
        .then((r) => {
          const libraryEntries = gameIds.map((game) => {
            return this.buildLibraryEntry(game, r.items);
          });

          resolve(libraryEntries);
        })
        .catch(reject);
    });
  }

  buildLibraryEntry(gameId, caves) {
    var output = {
      gameId: gameId,
    };
    const cave = caves.find((cave) => {
      return cave.game.id == gameId;
    });

    console.log(`the cave ${JSON.stringify(cave)}`);

    if (cave) {
      output.isDownloaded = true;
      output.installPath = cave.installInfo.installPath;
      output.caveId = cave.id;
    } else {
      output.isDownloaded = false;
    }

    return output;
  }

  /**
   * attempts to find the next logical update for a game and install it
   * @param {int} gameId the itch assigned game id
   * @param {function} progressUpdater a function that reports progress back to the front end through Electron IPC utilities
   */
  async updateItchGame(gameId, progressUpdater) {}

  async downloadUpdate(gameId, progressUpdater) {
    return new Promise();
  }

  async downloadItchGame(gameId, gameName, progressUpdater) {
    return new Promise((resolve, reject) => {
      var client = this.makeClient()
        .then((client) => {
          client
            .call(butlerd.createRequest('Profile.LoginWithAPIKey'), {
              apiKey: 'vDc2ysBDSEbdu7iIfc60Idaw1j2a2SB8WqV8ljXE',
            })
            .then((profile) => {
              return client.call(butlerd.createRequest('Search.Games'), {
                profileId: profile.profile.id,
                query: `${gameName}`,
              });
            })
            .then((games) => {
              console.log(`Games: ${JSON.stringify(games)}`);
              const game = games.games.find((x) => x.id == gameId);
              console.log(game);
              this.createInstallLocation(gameName, this.libraryPath, client)
                .then((installLocation) => {
                  return client.call(butlerd.createRequest('Install.Queue'), {
                    game: game,
                    installLocationId: installLocation.id,
                    installFolder: this.libraryPath,
                  });
                })
                .then((installQueueResponse) => {
                  return client.call(
                    butlerd.createRequest('Install.Perform'),
                    {
                      id: 'Short-Circuit',
                      stagingFolder: installQueueResponse.stagingFolder,
                    },
                    (conv) => {
                      //When we get the progress notification,
                      //throw it into the progress updater callback
                      conv.onNotification(
                        butlerd.createNotification('Progress'),
                        async (progress) => {
                          progressUpdater((progress.progress * 100).toFixed(2));
                        }
                      );
                      //When the task succeeds, resolve the downloadGame promise
                      conv.onNotification(
                        butlerd.createNotification('TaskSucceeded'),
                        async (arg) => {
                          resolve('Success');
                        }
                      );
                    }
                  );
                });
            });
        })
        .catch((reason) => {
          this.universalFailureCallback({
            remark: 'Failure in download',
            e: reason,
          });
          reject(reason);
        });
    });

    //const isDownloaded = this.getIsItchGameDownloaded();

    // if (isDownloaded) {
    //   this.updateItchCave();
    // } else {
    //   this.freshItchInstall();
    // }

    // This one is one I made. We'd need a more sophisticated search algorith in the future
    // NOTE: The cover image is returned in the games struct as a URL, so if we want users to browse games lists, there's that!
    // We can use Fetch.ProfileGames to get the MocsArcade games only
  }

  async updateItchCave() {}
  //returns a promise
  async freshItchInstall(gameId) {
    return new Promise((gameId) => {});
  }

  /**
   * Butler wrap Utility Functions
   *
   */

  async createInstallLocation(gameName, installPath, client) {
    return new Promise((resolve, reject) => {
      client
        .call(butlerd.createRequest('Install.Locations.List'))
        .then((locations) => {
          var installLocationSummary = locations.installLocations.find(
            (x) => x.id == gameName
          );
          if (installLocationSummary == null) {
            console.log('Setting in the if statement');
            return client.call(butlerd.createRequest('Install.Locations.Add'), {
              id: gameName,
              path: installPath,
            });
          } else {
            resolve(installLocationSummary);
          }
        })
        .then((installLocationSummary) => resolve(installLocationSummary))
        .catch((reason) =>
          this.universalFailureCallback({
            remark: 'Error while creating install location',
            e: reason,
          })
        );
    });
  }

  //return a promise
  async fetchGame(gameId, client) {
    return client.call(butlerd.createRequest('Fetch.Game'), {
      gameId: gameId,
      fresh: true,
    });
  }

  /**
   * Error handlers etc
   *
   */

  /**
   * This function is used to handle promise rejections
   * @param {string} remark An extra little comment to help explain at a high level what
   * @param {exception} e You already know tf is goin on
   */
  universalFailureCallback({ remark, e }) {
    console.log(`Error in library manager: ${remark}`);
    console.error(e);
  }
}

module.exports = LibraryManager;
