var fs = require('fs');
const { app, ipcMain } = require('electron');
const path = require('path');
const http = require('follow-redirects').https;
const butlerd = require('butlerd');
import { LibraryEntry } from '../src/models/libraryEntry'

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

  initDirectory(directory) {
    const theDir = path.join(this.libraryPath, directory);
    if (!fs.existsSync(theDir)) {
      fs.mkdirSync(theDir);
    }
  }

 
  async makeClient(){
    let args = [
      '--dbpath',
      this.libraryPath.toString() + 'butler.db',
      '--destiny-pid',
      `${process.pid}`,
    ];

    const instance = new butlerd.Instance({
      butlerExecutable: 'butler',
      args,
    });
    return instance.getEndpoint()
      .then(
        endpoint =>{
          new butlerd.Client(endpoint)
        },
        (reject) =>{
          this.universalFailureCallback(`Failure making client.`, reject.error);
        })
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

  async buildLibraryEntries(gameIds){
    return new Promise((resolve, reject)=>{
      try{
        this.makeClient()
          .then(client =>{
            client.call(butlerd.createRequest('Fetch.Caves'), {})
          }, )
          .then(r => {
            const libraryEntries = gameIds.map(game => {
              this.buildLibraryEntry(game, r.items, client);
            });
            resolve(libraryEntries);
          }, reject);
      }
      catch(e){
        reject({remark: `Failure building library entries`, exception: e})
      }
    });
  }

  buildLibraryEntry(gameId, caves, client){
    var output = new LibraryEntry(gameId);
    const cave = caves.filter(cave => { return cave.game.id == gameId });

    if(cave){
      output.isDownloaded = true;
      output.installPath = cave.installInfo.installPath;
    }
    else{
      output.isDownloaded = false;
    }

    return output;
  }

/**
 * attempts to find the next logical update for a game and install it
 * @param {int} gameId the itch assigned game id
 * @param {function} progressUpdater a function that reports progress back to the front end through Electron IPC utilities
 */
  async updateItchGame(gameId, progressUpdater){

  }

  async downloadUpdate(gameId, progressUpdater){
    return new Promise()
  }

  async downloadItchGame(gameId, progressUpdater) {
    try {
     
      var client = this.makeClient();

      const isDownloaded = this.getIsItchGameDownloaded();

      if(isDownloaded){
        this.updateItchCave();
      }
      else{
        this.freshItchInstall();
      }

      const profile = await client.call(
        butlerd.createRequest('Profile.LoginWithAPIKey'),
        { apiKey: 'vDc2ysBDSEbdu7iIfc60Idaw1j2a2SB8WqV8ljXE' }
      );
      console.log(profile);

      // This one is one I made. We'd need a more sophisticated search algorith in the future
      // NOTE: The cover image is returned in the games struct as a URL, so if we want users to browse games lists, there's that!
      // We can use Fetch.ProfileGames to get the MocsArcade games only
      const games = await client.call(butlerd.createRequest('Search.Games'), {
        profileId: profile.profile.id,
        query: `${gameName}`,
      });
      const game = games.games.find((x) => x.id === gameId);
      console.log(game);
      const installLocation = this.createInstallLocation(gameName);
      const installQueueResponse = await client.call(
        butlerd.createRequest('Install.Queue'),
        {
          game: game,
          installLocationId = installLocation.id,
        }
      );

      const installPerformResponse = await client.call(
        butlerd.createRequest('Install.Perform'),
        { id: 'Short-Circuit', stagingFolder: installQueueResponse.stagingFolder }
      );

      console.log(installQueueResponse);
    } catch (e) {
      console.error(e);
    }
  }

  async updateItchCave(){

  }
  //returns a promise
  async freshItchInstall(gameId){
    return new Promise((gameId) => {

    });
  }

  

  /**
   * Butler wrap Utility Functions
   * 
   */

  async createInstallLocation(gameName, installPath, client){
    const installPath = path.resolve('./Library', 'Short-Circuit');
    const installLocations = await client.call(
      butlerd.createRequest('Install.Locations.List')
    );
    var installLocationSummary = installLocations.installLocations.find(
      (x) => x.id == 'Short Circuit'
    );
    if (installLocationSummary == null) {
      console.log('Setting in the if statement');
      installLocationSummary =  await client.call(
        butlerd.createRequest('Install.Locations.Add'),
        {
          id: gameName,
          path: installPath,
        }
      ).installLocation;
    }

    return installLocationSummary;
  }

  //return a promise
  async fetchGame(gameId, client){
    return client.call(butlerd.createRequest('Fetch.Game', ), {gameId: gameId, fresh: true});
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
  universalFailureCallback({remark, e}){
    console.log(`Error in library manager: ${remark}`);
    console.error(e);
  }

}

module.exports = LibraryManager;
