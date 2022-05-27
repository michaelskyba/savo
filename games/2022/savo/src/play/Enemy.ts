import c from "../canvas"
import Sword from "./Sword"

class Enemy {
	x: number
	y: number

	sword: Sword

	constructor(x: number, y: number) {
		this.x = x
		this.y = y

		this.sword = new Sword(100)
	}

	collision = (playerX: number, playerY: number) => {
		let collided = this.sword.collision(this.x + 25, this.y + 25, playerX, playerY)
		this.sword.colour = collided ? "red" : "coral"
	}

	draw() {
		c.fillStyle = "coral"

		// 25 = enemy size / 2 (so the sword starts in the center)
		this.sword.draw(this.x + 25, this.y + 25)

		c.frect(this.x, this.y, 50, 50)
	}
}

export default Enemy
