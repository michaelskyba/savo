import c from "../canvas"
import Sword from "./Sword"

class Enemy {
	x: number
	y: number
	width: number
	height: number

	sword: Sword

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height

		this.sword = new Sword(100)
	}

	draw() {
		c.fillStyle = "coral"
		c.frect(this.x, this.y, this.width, this.height)

		this.sword.draw(this.x + this.width / 2, this.y + this.height / 2)
	}
}

export default Enemy
