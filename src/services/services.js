import LibraryService from './library-service';
import GameService from './game-service';

export default class ServiceHub {
  libraryService;
  gameService;

  constructor() {
    this.libraryService = new LibraryService();
    this.gameService = new GameService();
  }
}
