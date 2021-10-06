import { ajax } from 'rxjs/ajax';

export default class GameServiceProxy {
  //TODO: change this to an environment variable
  gamesUrl = 'http://localhost:8081/api/games';

  constructor() {}

  getGames() {
    return ajax.getJSON(this.gamesUrl);
  }
}
