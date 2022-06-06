import claudiaHouse from "../fixed/claudiaHouse"
import akvedukto from "../fixed/akvedukto"

import perinthus from "../overworld/perinthus"
import lerwick from "../overworld/lerwick"

import player from "../game/player"

const steps = {
	claudiaHouse() {
		claudiaHouse.move()
		claudiaHouse.draw()

		// If the transitions function determines that we can transition to
		// perinthus, we should do so here. We can't run perinthus.init() inside
		// claudiaHouse.ts or else we'd end up with a dependency cycle.

		// Keeping the logic separated like this is kind of messy but it's the
		// best way, from what I can see. I'd otherwise have to keep much more
		// of the code in the same .ts file, which is even messier.

		if (claudiaHouse.transitions()) {
			perinthus.init()

			player.x = 5
			player.y = 0

			window.requestAnimationFrame(this.perinthus)
		}

		else window.requestAnimationFrame(this.claudiaHouse)
	},

	perinthus() {
		perinthus.move()
		perinthus.draw()

		switch(perinthus.transitions()) {
			case null:
				// No transition, so we render perinthus again
				window.requestAnimationFrame(this.perinthus)
				break

			case "claudiaHouse":
				player.x = 1270
				player.y = 337.5

				window.requestAnimationFrame(this.claudiaHouse)
				break

			case "akvedukto":
				akvedukto.init()
				player.x = 637.5
				player.y = 670

				window.requestAnimationFrame(this.akvedukto)
				break
		}
	},

	akvedukto(time: number) {
		akvedukto.move(time)
		akvedukto.draw()

		switch(akvedukto.transitions()) {
			case null:
				window.requestAnimationFrame(this.akvedukto)
				break

			case "Perinthus":
				perinthus.init()

				player.x = 200
				player.y = -870

				window.requestAnimationFrame(this.perinthus)
				break

			case "Lerwick":
				lerwick.init()

				player.x = 0
				player.y = 0

				window.requestAnimationFrame(this.lerwick)
				break
		}

	},

	lerwick() {
		lerwick.move()
		lerwick.draw()

		window.requestAnimationFrame(this.lerwick)
	}
}

// Bind each "this" to "steps"
for (const step of Object.keys(steps)) {
	steps[step] = steps[step].bind(steps)
}

export default steps
