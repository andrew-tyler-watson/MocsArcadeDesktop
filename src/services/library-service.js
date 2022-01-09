import { Observable, ReplaySubject } from 'rxjs';
import { ipcRenderer } from 'electron';
import IpcRequest from '../messages/IpcRequest';
import IpcNotification from '../messages/IpcNotification';

/**
 *
 *
 * @export
 * @class LibraryService
 */
export default class LibraryService {
  libraryPath = '';
  downloadEmitter$ = new ReplaySubject(1);
  downloadProgressEmitter$ = new ReplaySubject(1);

  /**
   * Sends a message to the main thread to initiate the download/install
   * @param {Game} game A game to download. Needs the itchId and game name to work
   * @returns {Observable} The observable emits a progress event object that looks like this {response: string, precent?: number}
   */
  downloadGame(game) {
    return new Observable((subscriber) => {
      ipcRenderer.on(IpcNotification.DownloadProgress, (event, args) => {
        subscriber.next({
          response: 'progress',
          percent: args,
        });
      });
      ipcRenderer.once(IpcNotification.DownloadComplete, (event, args) => {
        console.log(`received complete event: ${args}`);
        subscriber.next({ response: 'complete' });
      });

      ipcRenderer.send(IpcRequest.DownloadItchGame, [
        game.gameInfo.itchId,
        game.gameInfo.name,
      ]);
    });
  }
}
