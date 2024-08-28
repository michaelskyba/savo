import claudiaHouse from "../fixed/claudiaHouse"
import akvedukto from "../fixed/akvedukto"
import neroHouse from "../fixed/neroHouse"
import tiberiusHouse from "../fixed/tiberiusHouse"
import augustusRoom from "../fixed/augustusRoom"

import perinthus from "../overworld/perinthus"
import lerwick from "../overworld/lerwick"

import mainMenu from "../menus/mainMenu"
import gameOver from "../menus/gameOver"
import player from "../game/player"
import music from "../game/music"

import c from "../game/canvas"

const steps = {
	mainMenu() {
		mainMenu.draw()

		if (mainMenu.screen == "Claudia's house") {
			claudiaHouse.init()
			window.requestAnimationFrame(this.claudiaHouse)
		}
		else window.requestAnimationFrame(this.mainMenu)
	},

	claudiaHouse(time: number) {
		claudiaHouse.move(time)
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

	perinthus(time: number) {
		perinthus.move(time)
		perinthus.draw()

		switch(perinthus.transitions()) {
			case null:
				// No transition, so we render perinthus again
				window.requestAnimationFrame(this.perinthus)
				break

			case "claudiaHouse":
				claudiaHouse.init()
				player.x = c.w - c.s - 5
				player.y = c.h/2 - c.s/2

				window.requestAnimationFrame(this.claudiaHouse)
				break

			case "akvedukto":
				akvedukto.init()
				player.x = c.w/2 - c.s/2
				player.y = c.h - c.s - 5

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

	lerwick(time: number) {
		lerwick.move(time)
		lerwick.draw()

		switch(lerwick.transitions()) {
			case null:
				window.requestAnimationFrame(this.lerwick)
				break

			case "akvedukto":
				akvedukto.init()
				player.x = c.w - c.s - 5
				player.y = c.h/2 - c.s/2

				window.requestAnimationFrame(this.akvedukto)
				break

			case "neroHouse":
				neroHouse.init()
				player.x = c.w/2 - c.s/2
				player.y = c.h - c.s - 5

				window.requestAnimationFrame(this.neroHouse)
				break

			case "tiberiusHouse":
				tiberiusHouse.init()
				player.x = 0
				player.y = c.h/2 - c.s/2

				// We can't have the music operations in tiberiusHouse.init() or
				// else it will have to run when coming back from augustusRoom
				music.reset()
				music.monomono_slots.play()

				window.requestAnimationFrame(this.tiberiusHouse)
		}
	},

	neroHouse(time: number) {
		neroHouse.move(time)

		neroHouse.draw()

		// Transition back to Lerwick
		if (neroHouse.locationTransitions()) {
			lerwick.init()

			player.x = 900
			player.y = -970

			window.requestAnimationFrame(this.lerwick)
			return
		}

		// Win or lose screen
		switch (neroHouse.gameOverTransitions()) {
			case "win":
				document.onkeydown = function(event) {
					if (event.code == "Space") {
						neroHouse.gameRestart()
						window.requestAnimationFrame(steps.neroHouse)
					}
				}

				window.requestAnimationFrame(gameOver.neroWin)
				break

			case "lose":
				document.onkeydown = function(event) {
					if (event.code == "Space") {
						neroHouse.gameRestart()
						window.requestAnimationFrame(steps.neroHouse)
					}
				}

				window.requestAnimationFrame(gameOver.neroLose)
				break

			// No win or lose, so we are still in the house
			default:
				window.requestAnimationFrame(this.neroHouse)
		}
	},

	tiberiusHouse(time: number) {
		tiberiusHouse.move(time)
		tiberiusHouse.draw()

		switch(tiberiusHouse.transitions()) {
			case null:
				window.requestAnimationFrame(this.tiberiusHouse)
				break

			case "Lerwick":
				lerwick.init()
				player.x = 1820
				player.y = -447.5

				window.requestAnimationFrame(this.lerwick)
				break

			case "AugustusRoom":
				augustusRoom.init()
				window.requestAnimationFrame(this.augustusRoom)
				break
		}
	},

	augustusRoom(time: number) {
		augustusRoom.move(time)
		augustusRoom.draw()

		switch(augustusRoom.transitions()) {
			case "TiberiusHouse":
				tiberiusHouse.init()
				player.x = 1220
				window.requestAnimationFrame(this.tiberiusHouse)
				break

			case "win":
				document.onkeydown = function(event) {
					if (event.code == "Space") {
						augustusRoom.gameRestart()
						window.requestAnimationFrame(steps.augustusRoom)
					}
				}

				window.requestAnimationFrame(gameOver.augustusWin)
				break

			case "lose":
				document.onkeydown = function(event) {
					if (event.code == "Space") {
						augustusRoom.gameRestart()
						window.requestAnimationFrame(steps.augustusRoom)
					}
				}

				window.requestAnimationFrame(gameOver.augustusLose)
				break

			default:
				window.requestAnimationFrame(this.augustusRoom)
				break
		}
	}
}

// Bind each "this" to "steps"
for (const step of Object.keys(steps)) {
	steps[step] = steps[step].bind(steps)
}

export default steps
