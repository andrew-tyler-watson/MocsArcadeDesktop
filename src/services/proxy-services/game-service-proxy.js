import { flatMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { ipcRenderer } from 'electron';
import IpcRequests from '../../messages/IpcRequests';
import IpcResponses from '../../messages/IpcResponses';
import { Observable } from 'rxjs';

export default class GameServiceProxy {
  //TODO: change this to an environment variable
  gamesUrl = 'http://localhost:8081/api/games';

  constructor() {}

  getGames() {
    return ajax
      .getJSON(this.gamesUrl)
      .pipe(flatMap((games) => this.addLibraryEntries(games)));
  }

  addLibraryEntries(games) {
    return new Observable((subscriber) => {
      ipcRenderer.once(
        IpcResponses.BuildLibraryEntriesResponse,
        (event, args) => {
          const output = games.map((game) => ({
            ...game,
            libraryEntry: args.find((x) => x.gameId == game.gameInfo.itchId),
          }));
          subscriber.next(output);
        }
      );
      ipcRenderer.send(IpcRequests.BuildLibraryEntries, [
        games.map((x) => x.gameInfo.itchId),
      ]);
    });
  }
}
