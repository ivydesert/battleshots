import { pieces } from './pieces.json';
import { _ } from 'lodash';

const VERTICAL: string = 'VERTICAL';
const HORIZONTAL: string = 'HORIZONTAL';

class Grid {
	public board: string[][];
	// private pieces: any;

	constructor(board?: string[][], randomize: boolean = true) {
		// this.pieces = pieces;
		this.board = board || new Array(10).fill(null).map(() => new Array(10).fill(null));
		if(randomize)
			this.randomizePieces();
	}

	placeShipNode(id: string, row: number, col: number): void {
		if(0 <= row && row < 10 && 0 <= col && col < 10) {
			this.board[row][col] = id;
		}
	}

	placeShipHorizontally(id: string, row: number, col: number, size: number): void {
		if(row + size >= 10) {
			throw new Error(`Cannot place ship of size ${size} at (${row}, ${col})`);
		}

		for(let i: number = 0; i < size; i++) {
			this.placeShipNode(id, row + i, col);
		}
	}

	placeShipVertically(id: string, row: number, col: number, size: number): void {
		if(col + size >= 10) {
			throw new Error(`Cannot place ship of size ${size} at (${row}, ${col})`);
		}

		for(let i: number = 0; i < size; i++) {
			this.placeShipNode(id, row, col + i);
		}
	}

	placeShip(id: string, row: number, col: number, size: number, orientation: string): void {
		if(orientation === VERTICAL) return this.placeShipVertically(id, row, col, size);
		else if(orientation === HORIZONTAL) return this.placeShipHorizontally(id, row, col, size);
	}

	getRandomOrientation(): string {
		return Math.floor(Math.random() * 2) ? VERTICAL : HORIZONTAL;
	}

	get(row: number, col: number): string {
		return this.board[row][col];
	}

	setGuess(row: number, col: number, result: string): string[][] {
		this.board[row][col] = result;
		return this.board;
	}

	randomizePieces(): any {

		_.forEach(pieces, (piece, key) => {
			const placement: any = this.findValidShipPlacement(piece.size);
			this.placeShip(key, placement.row, placement.col, piece.size, placement.orientation);
		});
		return this.toString();
	}

	findValidShipPlacement(size: number): any {
		let row: number;
		let col: number;
		let valid: boolean = false;
		const orientation: string = this.getRandomOrientation();
		const maxCoordinateValue: number = Math.floor(Math.random() * (9 - size));
		const rowMax: number = orientation === VERTICAL ? 9 : 9 - size;
		const colMax: number = orientation === HORIZONTAL ? 9 : 9 - size;

		while(!valid) {
			valid = true;
			row = Math.floor(Math.random() * rowMax);
			col = Math.floor(Math.random() * colMax);
			for(let i: number = 0; i < size; i++) {
				if( (orientation === VERTICAL   && this.board[row][col + i]) ||
					(orientation === HORIZONTAL && this.board[row + i][col]) ) {
					valid = false;
					break;
				}
			}
		}

		return {row, col, orientation};
	}

	toString(): string {
		let s: string = '';

		for(let row: number = 0; row < 10; row++) {
			const formattedRow = Array.from(this.board[row], r => {
				if(!r) return '-';
				else return pieces[r].shorthand;
			});
			s += formattedRow.toString().replace(/,/g, ' ') + '\n';
		}

		return s;
	}

	recordGuess(row, col, result): string[][] {
		// this.board[row, col] = result;
		return this.setGuess(row, col, result);
	}
}

export {Grid};