import player from "../game/player"
import c from "../game/canvas"
import { RNG } from "../util/functions"

// Size of Powerup
const s = 50

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
		c.frect(this.x - s/2, this.y - s/2, s, s)
	}

	doesCollide(): boolean {
		let x = this.x - s/2
		let y = this.y - s/2

		let colX = player.x
		let colY = player.y

		return (x + s > colX &&
			x < colX + c.s &&
			y + s > colY &&
			y < colY + c.s)
	}
}

export default Powerup
