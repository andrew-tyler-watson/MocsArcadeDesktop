import { flatMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { ipcRenderer } from 'electron';
import IpcRequest from '../../messages/IpcRequest';
import IpcResponse from '../../messages/IpcResponse';
import { Observable } from 'rxjs';

export default class GameServiceProxy {
  //TODO: change this to an environment variable
  gamesUrl = 'http://localhost:8081/api/games';

  constructor() {}

  /**
   * gets games with library entries
   * @returns {Observable}
   */

  getGames() {
    return ajax
      .getJSON(this.gamesUrl)
      .pipe(flatMap((games) => this.addLibraryEntries(games)));
  }

  /**
   * Returns an observable that emits a list of games with library entries added
   * @param {Games[]} games a list of games to get library entries for
   * @returns {Observable<Game[]>} emits a list of games with library entry added
   */
  addLibraryEntries(games) {
    return new Observable((subscriber) => {
      ipcRenderer.once(
        IpcResponse.BuildLibraryEntriesResponse,
        (event, args) => {
          const output = games.map((game) => ({
            ...game,
            libraryEntry: args.find((x) => x.gameId == game.gameInfo.itchId),
          }));
          subscriber.next(output);
        }
      );
      ipcRenderer.send(IpcRequest.BuildLibraryEntries, [
        games.map((x) => x.gameInfo.itchId),
      ]);
    });
  }
}
