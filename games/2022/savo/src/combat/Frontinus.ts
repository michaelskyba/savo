import c from "../game/canvas"
import Enemy from "./Enemy"

import Life from "./Life"

import player from "../game/player"

class Frontinus extends Enemy {
	counterInit: number

	constructor(counterInit: number) {
		// 637.5 = horizontal center
		super(637.5, 200, [0], 5, "midnightblue")

		this.counterInit = counterInit
		this.counter = counterInit
	}

	move(time: number) {
		this.timer("start", time)

		// Counting down to the next attack
		if (this.status == "countdown") {
			let threshold = 500

			while (this.elapsed[0] > threshold) {
				this.counter--
				this.elapsed[0] -= threshold

				if (this.counter == 0) {
					this.status = "attack"
					this.elapsed[0] = 0

					// Math.atan2 gets the angle to the point from the origin.
					// Since our origin is frontinus's (x, y), we need to
					// subtract each from the player's corresponding value.
					// https://stackoverflow.com/a/28227643

					let x = player.x - this.x
					let y = player.y - this.y
					let angle = Math.atan2(y, x) * 180 / Math.PI

					this.sword.angle = angle
					this.sword.rotate(-90)
				}
			}
		}

		// Executing the attack
		else {
			// We want a 180 degree rotation in 200ms, which means 180/200 = 0.9
			// degrees per millisecond
			this.sword.rotate((time - this.lastFrame) * 0.9)

			// It's done after 200 ms
			if (this.elapsed[0] > 200) {
				this.status = "countdown"
				this.elapsed[0] = 0

				this.counter = this.counterInit
			}
		}

		this.timer("end", time)
	}
}

export default Frontinus
