import c from "../game/canvas"

import player from "../game/player"
import Frontinus from "../combat/Frontinus"

const frontinus = new Frontinus()

import Scene from "../menus/Scene"
import dialogue0 from "../events/2"

const scene = new Scene(dialogue0)

const akvedukto = {
	// Which phase of akvedukto / the tutorial are you on?
	phase: 0,

	init() {
		player.x = 500
		player.y = 600

		document.onkeydown = event => {
			if (this.phase == 0 && event.code == "KeyZ") {
				scene.progress()

				// The last frame was finished, so the scene is over
				if (!scene.playing) this.phase++
			}

			else {
				player.fixedKeys(event.code)
				player.handleKey("keydown", event.code)
			}
		}

		document.onkeyup = event => {
			if (this.phase != 0)
				player.handleKey("keyup", event.code)
		}
	},

	move(time: number) {
		if (this.phase == 0) return

		frontinus.move(time)

		player.move("fixed", [{
			x: frontinus.x,
			y: frontinus.y,
			width: 50,
			height: 50
		}])

		// Have the player take damage if Frontinus' sword hits them
		if (frontinus.collision(player.x, player.y))
			player.receiveDamage()

		// Have Frontinus take damage from the player's hits
		if (player.status == "attacking")
			frontinus.receiveDamage()

		player.progressCooldowns(time)
	},

	draw() {
		c.fillStyle = "floralwhite"
		c.frect(0, 0, 1325, 725)

		player.drawRange(frontinus.x, frontinus.y)
		player.draw("fixed")

		frontinus.draw()

		player.drawCooldowns()

		frontinus.life.draw()
		player.life.draw()

		if (this.phase == 0) {
			scene.speech.draw()
			if (scene.speaker) scene.speaker.draw()
		}
	}
}

export default akvedukto
