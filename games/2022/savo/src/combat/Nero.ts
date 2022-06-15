import Enemy from "../combat/Enemy"
import player from "../game/player"

/*
elapsed {
	0: timer for movement (x,y manipulatioN)
	1: timer for countdown (attack counter manipulation)
}
*/

class Nero extends Enemy {
	moveStatus = "approaching"

	constructor() {
		// super(637.5, 445, [0, 0], 50, "maroon")
		super(637.5, 445, [0, 0], 3, "maroon")
		this.counter = 5
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

			this.x += dx / 20
			this.y += dy / 20
		}
	}

	constraints() {
		if (this.x > 1250) this.x = 1250
		if (this.x < 25) this.x = 25

		if (this.y > 650) this.y = 650
		if (this.y < 25) this.y = 25

		// Teleporting
		if ((this.x == 25 && this.y == 25) ||
			(this.x == 25 && this.y == 650) ||
			(this.x == 1250 && this.y == 650) ||
			(this.x == 1250 && this.y == 25)) {

			this.x = 637.5
			this.y = 337.5
		}
	}

	move(time: number) {
		this.timer("start", time)

		if (this.status == "attack") {
			return
		}

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
	}
}

export default Nero
