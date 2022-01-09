import LibraryService from './library-service';
import GameService from './game-service';

export default class ServiceHub {
  libraryService;
  gameService;

  constructor() {
    this.gameService = new GameService();
    this.libraryService = new LibraryService();
  }
}
