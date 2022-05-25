import claudiaHouse from "./fixed/claudiaHouse"
import perinthus from "./overworld/perinthus"
import akvedukto from "./fixed/akvedukto"

import player from "./play/player"

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
				player.x = 1275
				player.y = 337.5

				window.requestAnimationFrame(this.claudiaHouse)
				break

			case "akvedukto":
				akvedukto.init()
				window.requestAnimationFrame(this.akvedukto)
				break
		}
	},

	akvedukto() {
		akvedukto.move()
		akvedukto.draw()

		window.requestAnimationFrame(this.akvedukto)
	}
}

// Bind each "this" to "steps"
for (const step of Object.keys(steps)) {
	steps[step] = steps[step].bind(steps)
}

export default steps
