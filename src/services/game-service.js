import GameProxyService from './proxy-services/game-service-proxy';
import { ReplaySubject } from 'rxjs';

export default class GameService {
  proxyService = new GameProxyService();
  games$ = new ReplaySubject(1);

  constructor() {
    console.log('getting games');
    this.proxyService.getGames().subscribe(this.games$);
  }
}
