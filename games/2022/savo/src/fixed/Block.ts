import c from "../game/canvas"

// This is the fixed location version of overworld/Block.ts.

export default class Wall {
	x: number
	y: number

	width: number
	height: number

	colour: string

	constructor(x: number, y: number, width: number, height: number, colour: string) {
		this.x = x
		this.y = y

		this.width = width
		this.height = height

		this.colour = colour
	}

	draw() {
		c.fillStyle = this.colour
		c.frect(this.x, this.y, this.width, this.height)
	}
}
