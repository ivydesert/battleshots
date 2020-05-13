import { Grid } from './grid';

export class Game {
	public _id: string;
	public grid: Grid;
	public guesses: Grid;

	constructor(id?: string, grid?: Grid, guesses?: Grid) {
		this._id = id || this.generateId();
		this.grid = grid.board ? new Grid(grid.board) : new Grid();
		this.guesses = guesses?.board ? new Grid(guesses.board) : this.generateEmptyBoard();
	}

	generateId(): string {
		let id: string = '';
		const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const charactersLength: number = characters.length;

		const ID_LENGTH: number = 5;

		for ( let i = 0; i < ID_LENGTH; i++ ) {
			id += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return id;
	}

	generateEmptyBoard(): Grid {
		return new Grid(null, false);
	}

	randomizePieces(): any {
		return this.grid.randomizePieces();
	}

	guess(row: number, col: number): string {
		const result: string = this.grid.get(row, col);
		this.guesses.recordGuess(row, col, result);
		return result;
	}
}