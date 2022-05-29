import c from "../game/canvas"

export default class Wall {
	x: number
	y: number
	width: number
	height: number

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}

	draw() {
		c.fillStyle = "red"
		c.frect(this.x, this.y, this.width, this.height)
	}
}
