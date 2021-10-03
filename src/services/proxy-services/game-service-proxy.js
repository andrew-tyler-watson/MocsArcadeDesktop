import { ajax } from 'rxjs/ajax';

export default class GameServiceProxy {
  gamesUrl = 'http://localhost:8081/api/games';

  constructor() {}

  getGames() {
    return ajax.getJSON(this.gamesUrl);
  }
}
