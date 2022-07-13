import c from "../game/canvas"
import Enemy from "../combat/Enemy"

class Augustus extends Enemy {
	origin = {
		x: 993.75,
		y: 337.5
	}
	angle = 0
	radius = 300

	constructor() {
		super(993.75, 337.5, [], 99, "#eee", "#111")
		this.counter = 63
	}

	move() {
		this.angle++
		if (this.angle > 360) this.angle = this.angle % 360
		let radian = Math.round(this.angle) * Math.PI / 180

		this.x = this.origin.x + this.radius * Math.cos(radian)
		this.y = this.origin.y + this.radius * Math.sin(radian)
	}
}

const augustus = new Augustus()
export default augustus
