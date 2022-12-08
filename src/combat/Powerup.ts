import player from "../game/player"
import c from "../game/canvas"
import { RNG } from "../game/functions"

class Powerup {
	x = 662.5
	y = 1100

	activated = false

	constructor() {
		this.newPos()
	}

	newPos() {
		this.x = [220, 662.5, 1100][RNG(0, 2)]
		this.y = [120, 362.5, 600][RNG(0, 2)]
	}

	draw() {
		// Don't draw if already activated
		if (this.activated) return

		c.fillStyle = "#2b193d"
		c.frect(this.x - 25, this.y - 25, 50, 50)
	}

	doesCollide(): boolean {
		let x = this.x - 25
		let y = this.y - 25

		let colX = player.x
		let colY = player.y

		return (x + 50 > colX &&
			x < colX + 50 &&
			y + 50 > colY &&
			y < colY + 50)
	}
}

export default Powerup
