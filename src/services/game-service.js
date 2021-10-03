import GameProxyService from './proxy-services/game-service-proxy';

export default class GameService {
  proxyService = new GameProxyService();

  constructor() {}

  getGames() {
    console.log('getting games');
    return this.proxyService.getGames();
  }
}
