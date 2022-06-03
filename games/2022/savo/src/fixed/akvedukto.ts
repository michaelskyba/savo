import c from "../game/canvas"

import Life from "../combat/Life"
import Wall from "./Wall"

import player from "../game/player"
import Frontinus from "../combat/Frontinus"

import Scene from "../menus/Scene"
import dialogue from "../events/2"

let frontinus = new Frontinus(5)
let scene = new Scene(dialogue.introduction)

function resetCombat() {
	frontinus = new Frontinus(5)
	player.resetCooldowns()

	player.life = new Life(99, 5, 5)

	// horizontal center based on canvas and player width
	player.x = 637.5
	player.y = 625
}

// Set the dialogue based on the phase
function setDialogue() {
	let next: string[][]
	switch(akvedukto.phase) {
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

let wallColour = "#a69583"
const walls = [
	// Initial position with door blocked
	[
		new Wall(0, 0, 1325, 25, wallColour),
		new Wall(0, 0, 25, 1325, wallColour),

		// Bottom with intersection
		new Wall(0, 700, 512.5, 25, wallColour),
		new Wall(812.5, 700, 612.5, 25, wallColour),

		// Initially solid right wall
		new Wall(1300, 0, 25, 725, wallColour)
	],

	// Door unblocked after tutorial
	[
		new Wall(0, 0, 1325, 25, wallColour),
		new Wall(0, 0, 25, 1325, wallColour),

		// Bottom with intersection
		new Wall(0, 700, 512.5, 25, wallColour),
		new Wall(812.5, 700, 612.5, 25, wallColour),

		// Intersection in right wall
		new Wall(1300, 0, 25, 212.5, wallColour),
		new Wall(1300, 512.5, 25, 212.5, wallColour)
	]
]

// Which set of walls should we draw/collide?
function wallsIndex() {
	return akvedukto.phase == 10 ? 1 : 0
}

const akvedukto = {
	// Which phase of akvedukto / the tutorial are you on?
	phase: 0,

	init() {
		player.x = 637.5
		player.y = 625

		document.onkeydown = event => {
			if (scene.playing && event.code == "KeyZ") {
				scene.progress()

				// The last frame was finished, so the scene is over
				if (!scene.playing) {
					this.phase++

					// The attacking dialogue is the only one that follows
					// another dialogue (introduction)
					if (this.phase == 1) scene = new Scene(dialogue.attacking)

					// Have Frontinus use a 10 * 500ms timer to give extra time for healing
					if (this.phase == 6) {
						frontinus = new Frontinus(10)
						frontinus.life.hp = 15
					}

					player.resetInput()
				}
			}

			else if (!scene.playing) {
				// Only allow dodging in phase 8 (dodging practice)
				if (event.code == "KeyZ") {
					if (this.phase == 8) player.fixedKeys(event.code)
					else return
				}

				else player.fixedKeys(event.code)

				player.handleKey("keydown", event.code)
			}
		}

		document.onkeyup = event => {
			if (!scene.playing)
				player.handleKey("keyup", event.code)
		}
	},

	move(time: number) {
		// Skip movement during dialogue phases
		if (scene.playing) return

		// Frontinus doesn't attack you in phase 2, when you're supposed to be
		// learning the attacking controls
		if (this.phase != 2) frontinus.move(time)

		player.move("fixed", [...walls[wallsIndex()], {
			x: frontinus.x,
			y: frontinus.y,
			width: 50,
			height: 50
		}])

		// Have the player take damage if Frontinus' sword hits them
		if (frontinus.collision(player.x, player.y)) {
			player.receiveDamage()

			// You were hit on a phase besides 6
			let phaseDefault = player.life.threatened && this.phase != 6

			// You were hit while threatened on phase 6 (bringing hp down to 0)
			let phaseHealing = player.life.hp == 0 && this.phase == 6

			// The player messed up in following the instructions, so explain it
			// again for them
			if (phaseDefault || phaseHealing) {
				this.phase--
				setDialogue()
				resetCombat()
			}
		}

		// Have Frontinus take damage from the player's hits
		if (player.status == "attacking") {
			frontinus.receiveDamage()

			// Frontinus was temporarily defeated, so we can proceed to the next
			// stage of the tutorial
			if (frontinus.life.hp < 1) {
				this.phase++
				setDialogue()
				resetCombat()
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

		for (const wall of walls[wallsIndex()]) {
			wall.draw()
		}

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
