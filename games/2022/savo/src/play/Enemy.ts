import c from "../canvas"

class Enemy {
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
		c.fillStyle = "coral"
		c.frect(this.x, this.y, this.width, this.height)
	}
}

export default Enemy
