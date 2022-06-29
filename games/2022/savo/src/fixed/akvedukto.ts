import c from "../game/canvas"
import music from "../game/music"

import Life from "../combat/Life"
import Block from "./Block"

import player from "../game/player"
import Frontinus from "../combat/Frontinus"

import Scene from "../menus/Scene"
import dialogue from "../events/2"

import Img from "./Img"

let frontinus = new Frontinus(5)
let scene = new Scene(dialogue.introduction)
let bg = new Img("akvedukto_fixed", 0, 0)

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
		new Block(0, 0, 1325, 25, wallColour),
		new Block(0, 0, 25, 1325, wallColour),

		// Bottom with intersection
		new Block(0, 700, 512.5, 25, wallColour),
		new Block(812.5, 700, 612.5, 25, wallColour),

		// Initially solid right wall
		new Block(1300, 0, 25, 725, wallColour)
	],

	// Door unblocked after tutorial
	[
		new Block(0, 0, 1325, 25, wallColour),
		new Block(0, 0, 25, 1325, wallColour),

		// Bottom with intersection
		new Block(0, 700, 512.5, 25, wallColour),
		new Block(812.5, 700, 612.5, 25, wallColour),

		// Intersection in right wall
		new Block(1300, 0, 25, 212.5, wallColour),
		new Block(1300, 512.5, 25, 212.5, wallColour)
	]
]

// This is the barrier from the tutorial, trapping Claudia into Frontinus's
// sword's range
let barrierColour = "midnightblue"
const barrier = [
	new Block(487.5, 50, 350, 50, barrierColour),
	new Block(487.5, 50, 50, 350, barrierColour),
	new Block(787.5, 50, 50, 350, barrierColour),
	new Block(487.5, 350, 350, 50, barrierColour)
]

// Which set of walls should we draw/collide?
function wallsIndex() {
	return akvedukto.phase == 10 ? 1 : 0
}

const akvedukto = {
	// Which phase of akvedukto / the tutorial are you on?
	phase: 0,

	init() {
		document.onkeydown = event => {
			if (scene.playing && event.code == "KeyZ") {
				scene.progress()

				// The last frame was finished, so the scene is over
				if (!scene.playing) {
					this.phase++

					// The attacking dialogue is the only one that follows
					// another dialogue (introduction)
					if (this.phase == 1) scene = new Scene(dialogue.attacking)

					if (this.phase == 6) {
						// Have Frontinus use a 10 * 500ms timer to give extra
						// time for healing
						frontinus = new Frontinus(10)
						frontinus.life.hp = 15
					}

					// Block Claudia in to force healing / dodging
					// The better option would be to have Frontinus chase you in
					// a way that makes it impossible to fully escape, but that
					// would take a huge amount of extra effort
					if (this.phase == 6 || this.phase == 8)
						player.y = 300

					player.resetInput()
				}
			}

			else if (!scene.playing) {
				// Only allow dodging in phase 8 (dodging practice)
				if (event.code == "KeyZ") {
					if (this.phase == 8) player.fixedKeys(event.code)
					else return
				}

				// Other keys are fine as long as the tutorial isn't running
				else if (this.phase != 10) player.fixedKeys(event.code)

				player.handleKey("keydown", event.code)
			}
		}

		document.onkeyup = event => {
			if (!scene.playing)
				player.handleKey("keyup", event.code)
		}

		music.reset()
		music.summer_salt.play()
	},

	transitions(): string {
		// 675 = canvas height - player size
		if (player.y > 675) return "Perinthus"

		// 1275 = canvas width - player size
		if (player.x > 1275) return "Lerwick"

		return null
	},

	move(time: number) {
		// Skip movement during dialogue phases
		if (scene.playing) return

		// Frontinus doesn't attack you in phase 2, when you're supposed to be
		// learning the attacking controls
		// Frontinus doesn't attack you in phase 10, when you're done the tutorial
		if (this.phase != 2 && this.phase != 10) frontinus.move(time)

		let frontinusBlock = {
			x: frontinus.x,
			y: frontinus.y,
			width: 50,
			height: 50
		}

		// Trapped collision: Frontinus and inner walls
		if (this.phase == 6 || this.phase == 8)
			player.move(time, "fixed", [...barrier, frontinusBlock])

		// Regular collision: Frontinus and outer walls
		else player.move(time, "fixed", [...walls[wallsIndex()], frontinusBlock])

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
		// Background
		c.fillStyle = "floralwhite"
		c.frect(0, 0, 1325, 725)
		c.globalAlpha = 0.2
		bg.draw()
		c.globalAlpha = 1

		// Only draw the attack range if you're in combat
		if (this.phase != 10)
			player.drawRange(frontinus.x, frontinus.y)

		player.draw("fixed")

		frontinus.draw()

		for (const wall of walls[wallsIndex()]) {
			wall.draw()
		}

		// Draw Claudia barrier if healing or dodging should be required
		if (this.phase == 6 || this.phase == 8) {
			for (const wall of barrier) {
				wall.draw()
			}
		}

		player.drawCooldowns()

		// Only draw life points if you're in combat (in the tutorial)
		if (this.phase != 10) {
			frontinus.life.draw()
			player.life.draw()
		}

		scene.draw()
	}
}

export default akvedukto
