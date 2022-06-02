import c from "../game/canvas"

import player from "../game/player"
import Frontinus from "../combat/Frontinus"

const frontinus = new Frontinus()

import Scene from "../menus/Scene"
import dialogue from "../events/2"

let scene = new Scene(dialogue.introduction)

const akvedukto = {
	// Which phase of akvedukto / the tutorial are you on?
	phase: 0,

	init() {
		player.x = 500
		player.y = 600

		player.resetInput()

		document.onkeydown = event => {
			if (scene.playing && event.code == "KeyZ") {
				scene.progress()

				// The last frame was finished, so the scene is over
				if (!scene.playing) {
					this.phase++

					// Skip attacking explanation for now, which is special
					// because it's a dialogue phase that follows a dialogue phase
					if (this.phase == 1) this.phase++
				}
			}

			else if (this.phase != 0) {
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
		// Skip movement during dialogue phases
		if (scene.playing) return

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
		if (player.status == "attacking") {
			frontinus.receiveDamage()

			// Frontinus was temporarily defeated, so we can proceed to the next
			// stage of the tutorial
			if (frontinus.life.hp < 1) {
				this.phase++

				// Set the dialogue based on the phase
				let next: string[][]
				switch(this.phase) {
					case 3:
						next = dialogue.timing
						break

					case 5:
						next = dialogue.healing
						break

					case 7:
						next = dialogue.dodging
						break

					case 9:
						next = dialogue.conclusion
						break
				}
				scene = new Scene(next)
			}
		}

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

		if (scene.playing) {
			scene.speech.draw()
			if (scene.speaker) scene.speaker.draw()
		}
	}
}

export default akvedukto
