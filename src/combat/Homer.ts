import Enemy from "../combat/Enemy"
import c from "../game/canvas"
import player from "../game/player"
import { RNG } from "../util/functions"

// Wall width inside augustusRoom
const w = 25

/*
elapsed {
	0: timer for x movement
	1: timer for y movement
	2: timer for countdown (attack counter manipulation)
}
*/

class Homer extends Enemy {
	counterThreshold: number

	moveInterval = 20
	moveMultiplier = 0.01

	// Buffer for elapsed[0] and elapsed[1]
	buffer: {x: number, y: number}

	constructor(x: number, y: number) {
		super(x, y, [0, 0, 0], 0, "#8db255", "#111")

		this.buffer = {x: 0, y: 0}
		this.initCounter()
	}

	initCounter() {
		this.counter = RNG(10, 15) * 2
		this.counterThreshold = RNG(200, 400)
	}

	attackCounter() {
		if (this.elapsed[2] > this.counterThreshold) {
			this.counter -= 1
			this.elapsed[2] = 0

			if (this.counter == 0) {
				this.startSwing()

				this.buffer.x = this.elapsed[0]
				this.buffer.y = this.elapsed[1]
			}
		}
	}

	attack(time: number) {
		// We want a 180 degree rotation in 200ms, which means 180/200 = 0.9
		// degrees per millisecond
		this.sword.rotate((time - this.lastFrame) * 0.9)

		if (this.elapsed[2] > 200) {
			// Reset to old, pre-attack values
			this.status = "countdown"

			this.elapsed[0] = this.buffer.x
			this.elapsed[1] = this.buffer.y

			this.elapsed[2] = 0
			this.initCounter()
		}
	}

	countdown() {
		// Move forward every 10 ms
		let threshold = 10

		while (this.elapsed[0] > threshold) {
			this.elapsed[0] -= threshold

			let dx = player.x - this.x
			let dy = player.y - this.y

			this.x += dx / 100
			this.y += dy / 100
		}

		this.attackCounter()
	}

	move(time: number) {
		this.timer("start", time)

		// attack() or countdown()
		this[this.status](time)

		this.timer("end", time)
	}
}

export default Homer
