import Enemy from "./Enemy"
import player from "../game/player"
import c from "../game/canvas"
import Powerup from "./Powerup"
import { RNG } from "../util/functions"

/*
elapsed {
	0: timer for movement (x,y manipulation)
	1: timer for countdown (attack counter manipulation)
}

real
	true: Nero
	false: Ocarinus
*/

// Width of wall
const w = 25

class Nero extends Enemy {
	moveStatus = "approaching"
	powerup: Powerup

	// Different attack / counter patterns
	pattern = 0

	// Distance divisor
	dr: number

	constructor(real: boolean) {
		let bg = real ? "maroon" : "#111"
		let fg = real ? "#ffb5b5" : "#eee"

		super(637.5, 445, [0, 0], 50, bg, fg)

		this.dr = real ? 20 : 40
		this.counter = 10

		this.powerup = new Powerup()
	}

	retreat() {
		// Move backward every 10 ms
		let threshold = 10

		while (this.elapsed[0] > threshold) {
			this.elapsed[0] -= threshold

			let dx = player.x - this.x
			let dy = player.y - this.y

			if (Math.abs(dx) > 200 || Math.abs(dy) > 200) {
				this.moveStatus = "waiting"
				this.elapsed[0] = 0
				return
			}

			this.x -= 750 / dx
			this.y -= 750 / dy
		}
	}

	approach() {
		// Move forward every 10 ms
		let threshold = 10

		while (this.elapsed[0] > threshold) {
			this.elapsed[0] -= threshold

			let dx = player.x - this.x
			let dy = player.y - this.y

			if (Math.abs(dx) < 75 && Math.abs(dy) < 75) {
				this.moveStatus = "retreating"
				this.elapsed[0] = 0
				return
			}

			this.x += dx / this.dr
			this.y += dy / this.dr
		}
	}

	constraints() {
		if (this.x > c.w - w - c.s) this.x = c.w - w - c.s
		if (this.x < w) this.x = w

		if (this.y > c.h - w - c.s) this.y = c.h - w - c.s
		if (this.y < w) this.y = w

		// Teleporting
		if ((this.x == w && this.y == w) ||
			(this.x == w && this.y == c.h - w - c.s) ||
			(this.x == c.w - w - c.s && this.y == c.h - w - c.s) ||
			(this.x == c.w - w - c.s && this.y == w)) {

			this.x = 637.5
			this.y = 337.5
		}
	}

	move(time: number) {
		this.timer("start", time)

		if (this.status == "attack") {
			// We want a 180 degree rotation in 200ms, which means 180/200 = 0.9
			// degrees per millisecond
			this.sword.rotate((time - this.lastFrame) * 0.9)

			// It's done after 200 ms
			if (this.elapsed[1] > 200) {
				this.status = "countdown"
				this.elapsed[1] = 0

				this.pattern = Math.round(RNG(0, 200) / 100)
				switch(this.pattern) {
					case 2:
						this.counter = 99
						break

					default:
						this.counter = 10
						break
				}
			}
		}
		else this.attackCounter()

		switch(this.moveStatus) {
			case "approaching":
				this.approach()
				break

			case "retreating":
				this.retreat()
				break

			case "waiting":
				let threshold = 1000
				if (this.elapsed[0] > threshold) {
					this.moveStatus = "approaching"
					this.elapsed[0] = 0
				}
				break
		}

		this.constraints()
		this.timer("end", time)

		// Check for Powerup collision
		if (!this.powerup.activated && this.powerup.doesCollide())
			this.powerup.activated = true
	}

	// Progress attack coutner
	attackCounter() {
		switch(this.pattern) {
			case 0:
				if (this.elapsed[1] > 200) {
					this.counter -= 2
					this.elapsed[1] = 0

					if (this.counter == 0) this.startSwing()
				}
				break

			case 1:
				if (this.counter >= 10 && this.elapsed[1] > 100) {
					this.elapsed[1] = 0

					this.counter += 9
					if (this.counter > 90) this.counter = 3
				}

				else if (this.counter < 10 && this.elapsed[1] > 250) {
					this.elapsed[1] = 0
					this.counter--

					if (this.counter < 1) this.startSwing()
				}
				break

			case 2:
				if (this.elapsed[1] > 150) {
					this.elapsed[1] = 0

					this.counter -= 9
					if (this.counter < 1) {
						this.counter = 0
						this.startSwing()
					}
				}
				break
		}
	}

	drawPowerup() {
		this.powerup.draw()
	}

	receiveDamage() {
		super.receiveDamage()

		// Double damage with a powerup
		if (this.powerup.activated) {
			super.receiveDamage()

			this.powerup.activated = false
			this.powerup.newPos()
		}
	}
}

export default Nero
