import c from "../game/canvas"

class Cooldown {
	x: number
	width: number
	colour: string

	constructor(x: number, width: number, colour: string) {
		this.x = x
		this.width = width
		this.colour = colour
	}

	draw() {
		c.globalAlpha = 0.2
		c.fillStyle = this.colour

		c.frect(this.x, 0, this.width, 725)

		c.globalAlpha = 1
	}
}

export default Cooldown
