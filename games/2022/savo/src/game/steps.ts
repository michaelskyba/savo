import claudiaHouse from "../fixed/claudiaHouse"
import akvedukto from "../fixed/akvedukto"
import neroHouse from "../fixed/neroHouse"
import tiberiusHouse from "../fixed/tiberiusHouse"
import augustusRoom from "../fixed/augustusRoom"

import perinthus from "../overworld/perinthus"
import lerwick from "../overworld/lerwick"

import mainMenu from "../menus/mainMenu"
import player from "../game/player"

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

	lerwick(time: number) {
		lerwick.move(time)
		lerwick.draw()

		switch(lerwick.transitions()) {
			case null:
				window.requestAnimationFrame(this.lerwick)
				break

			case "akvedukto":
				akvedukto.init()
				player.x = 1270
				player.y = 337.5

				window.requestAnimationFrame(this.akvedukto)
				break

			case "neroHouse":
				neroHouse.init()
				player.x = 637.5
				player.y = 670

				window.requestAnimationFrame(this.neroHouse)
				break

			case "tiberiusHouse":
				tiberiusHouse.init()
				player.x = 0
				player.y = 337.5

				window.requestAnimationFrame(this.tiberiusHouse)
		}
	},

	gameOver() {
		if (neroHouse.gameState == "playing") return

		c.fillStyle = "#000"
		c.frect(0, 0, 1325, 725)

		c.font = "48px serif"
		c.fillStyle = "red"
		c.text("YOU DIED", 100, 100)

		c.font = "20px serif"
		c.fillStyle = "white"

		c.text("Nero has killed you! Are you this bad at video games?", 100, 200)
		c.text("Just log off if you're not even going to try.", 100, 230)
		c.text("Installing Linux is only for real gamers.", 100, 260)

		c.text("Press Space to reset back before the fight to try again...", 100, 350)
	},

	neroHouse(time: number) {
		neroHouse.move(time)

		if (neroHouse.gameState == "win") return
		if (neroHouse.gameState == "lose") {
			window.requestAnimationFrame(this.gameOver)

			// Space to try again
			document.onkeydown = function(event) {
				if (event.code == "Space") {
					neroHouse.gameState = "playing"
					neroHouse.room = 3
					neroHouse.init()

					player.x = 637.5
					player.y = 670

					window.requestAnimationFrame(steps.neroHouse)
				}
			}

			// Reset cooldowns - this is important so that the healing cooldown
			// isn't active. Otherwise, after pressing Space to return to the game,
			// you'll be stuck with slower movement speed
			player.resetCooldowns()

			return
		}

		neroHouse.draw()

		// Transition back to Lerwick
		if (neroHouse.locationTransitions()) {
			lerwick.init()

			player.x = 900
			player.y = -970

			window.requestAnimationFrame(this.lerwick)
		}

		else window.requestAnimationFrame(this.neroHouse)
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
				player.x = 1825
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
			case null:
				window.requestAnimationFrame(this.augustusRoom)
				break

			case "TiberiusHouse":
				window.requestAnimationFrame(this.tiberiusHouse)
				player.x = 1220
				break
		}
	}
}

// Bind each "this" to "steps"
for (const step of Object.keys(steps)) {
	steps[step] = steps[step].bind(steps)
}

export default steps
