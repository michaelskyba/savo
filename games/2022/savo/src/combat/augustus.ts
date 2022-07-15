import c from "../game/canvas"
import Enemy from "../combat/Enemy"

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}

class Augustus extends Enemy {
	origin = {
		x: 993.75,
		y: 337.5
	}
	angle = 0
	radius = 300

	status = "circling"

	constructor() {
		super(993.75, 337.5, [0, 0], 99, "#eee", "#111")
		this.counter = 63
	}

	constraints() {
		// Don't move through walls
		if (this.x > 1250) this.x = 1250
		if (this.y > 650) this.y = 650
		if (this.x < 25) this.x = 25
		if (this.y < 25) this.y = 25
	}

	// 19, 37, 54.5, 1:12

	circle() {
		this.angle++
		if (this.angle > 360) this.angle = this.angle % 360
		let radian = Math.round(this.angle) * Math.PI / 180

		this.x = this.origin.x + this.radius * Math.cos(radian)
		this.y = this.origin.y + this.radius * Math.sin(radian)

		this.constraints()
	}

	move(time: number) {
		this.timer("start", time)

		switch(this.status) {
			case "circling":
				this.circle()
				break
		}

		this.timer("end", time)
	}
}

const augustus = new Augustus()
export default augustus
