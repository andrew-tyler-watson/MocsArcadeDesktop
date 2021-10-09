import GameProxyService from './proxy-services/game-service-proxy';
import { ReplaySubject } from 'rxjs';

export default class GameService {
  proxyService = new GameProxyService();
  games$ = new ReplaySubject(1);

  constructor() {
    console.log('getting games');
    this.proxyService.getGames().subscribe(this.games$);
  }

  compareVersion(a, b) {
    var versionPiecesA = a.split('.').map((x) => {
      return parseInt(x);
    });
    var versionPiecesB = b.split('.').map((x) => {
      return parseInt(x);
    });

    const length =
      versionPiecesA > versionPiecesB
        ? versionPiecesB.length
        : versionPiecesA.length;
    for (const i = 0; i < length; i++) {
      if (versionPiecesA[i] > versionPiecesB[i]) {
        return 1;
      }
      if (versionPiecesA[i] < versionPiecesB[i]) {
        return -1;
      }
    }
    return 0;
  }
}
