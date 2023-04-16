import c from "../game/canvas"
import Block from "./Block"
import Img from "./Img"

import music from "../game/music"

import player from "../game/player"
import Nero from "../combat/Nero"

import Interactable from "./Interactable"
import Scene from "../menus/Scene"
import MenuOption from "../menus/MenuOption"
import dialogue from "../events/6"
import password from "../events/password"

import { RNG } from "../util/functions"

let nero: Nero
let ocarinus: Nero

// Wall width
const w = 25

// Door gap
const gap = 300

let wallColour = "maroon"
let objects = [
	// First room
	[
		new Block(0, 0, c.w, w, wallColour),
		new Block(0, 0, w, c.w, wallColour),

		// Bottom intersection
		new Block(0, c.h - w, (c.w-gap)/2, w, wallColour),
		new Block((c.w-gap)/2 + gap, c.h - w, (c.w-gap)/2, w, wallColour),

		// Right intersection
		new Block(c.w - w, 0, w, (c.h-gap)/2, wallColour),
		new Block(c.w - w, (c.h-gap)/2 + gap, w, (c.h-gap)/2, wallColour)
	],

	// Second room - entered through the right of first room
	[
		new Block(0, c.h - w, c.w, w, wallColour),

		// Left intersection
		new Block(0, 0, w, (c.h-gap)/2, wallColour),
		new Block(0, (c.h-gap)/2 + gap, w, (c.h-gap)/2, wallColour),

		// Top intersection
		new Block(0, 0, (c.w-gap)/2, w, wallColour),
		new Block((c.w-gap)/2 + gap, 0, (c.w-gap)/2, w, wallColour),

		new Block(c.w - w, 0, w, c.h, wallColour)
	],

	// Third room - entered through the top of second room
	[
		new Block(0, 0, c.w, w, wallColour),

		// Left intersection
		new Block(0, 0, w, (c.h-gap)/2, wallColour),
		new Block(0, (c.h-gap)/2 + gap, w, (c.h-gap)/2, wallColour),

		// Bottom intersection
		new Block(0, c.h - w, (c.w-gap)/2, w, wallColour),
		new Block((c.w-gap)/2 + gap, c.h - w, (c.w-gap)/2, w, wallColour),

		new Block(c.w - w, 0, w, c.h, wallColour),

		new Img("armour", 1075, 60)
	],

	// Fourth room - entered through the left of third room
	[
		new Block(0, 0, w, c.w, wallColour),
		new Block(0, 0, c.w, w, wallColour),

		// Right intersection
		new Block(c.w - w, 0, w, (c.h-gap)/2, wallColour),
		new Block(c.w - w, (c.h-gap)/2 + gap, w, (c.h-gap)/2, wallColour),

		// Bottom intersection
		new Block(0, c.h - w, (c.w-gap)/2, w, wallColour),
		new Block((c.w-gap)/2 + gap, c.h - w, (c.w-gap)/2, w, wallColour),
	],

	// Fifth (Nero's) room - entered through the bottom of the fourth room
	[
		new Block(0, 0, w, c.h, wallColour),
		new Block(0, c.h - w, c.w, w, wallColour),
		new Block(c.w - w, 0, w, c.h, wallColour),

		// Top intersection
		new Block(0, 0, (c.w-gap)/2, w, wallColour),
		new Block((c.w-gap)/2 + gap, 0, (c.w-gap)/2, w, wallColour),
	],

	// (Nero's) room - locked
	[
		new Block(0, 0, c.w, w, wallColour),
		new Block(0, 0, w, c.w, wallColour),
		new Block(c.w - w, 0, w, c.h, wallColour),
		new Block(0, c.h - w, c.w, w, wallColour)
	]
]

const interactables = [
	[new Interactable("Mercury", new Block(637.5, 337.5, c.s, c.s, "#776d5a"))],
	[],
	[new Interactable("Hector", new Block(935, 80, c.s, c.s, "#16db93"))],
	[new Interactable("Serapio", new Block(1100, 600, c.s, c.s, "#20063b"))],
	[],
	[]
]

let prompt = {
	int: interactables[0][0],
	active: false,
	box: new MenuOption("=================================================", 0, 0)
}

let scene = new Scene(dialogue.Nero)
scene.playing = false

// Generate the collisions array - what physical objects can Claudia collide
// with in the current room?
function genCollisions() {
	let room = neroHouse.room

	let collisions = [
		...objects[room],
		...interactables[room].map(int => int.obj)
	]

	if (room == 5)
		return [
			{
				x: nero.x,
				y: nero.y,
				width: 50,
				height: 50
			},
			{
				x: ocarinus.x,
				y: ocarinus.y,
				width: 50,
				height: 50
			},
			...collisions
		]
	else return collisions
}

const neroHouse = {
	room: 0,
	dualBattle: false,

	init() {
		this.dualBattle = password.timeMachine

		player.life.hp = 10
		player.life.threatened = false

		document.onkeydown = event => {
			let key = event.code

			// The player pressed Z to progress the dialogue
			if (key == "KeyZ" && scene.playing) {
				scene.progress()

				// Progress to fake battle room (5) after fight intro dialogue
				if (!scene.playing && neroHouse.room == 4)
					neroHouse.neroRoomInit()
			}

			// The player entered an interaction prompt with X
			else if (key == "KeyX" && prompt.active) {
				prompt.active = false
				scene = new Scene(dialogue[prompt.int.id])
			}

			player.handleKey("keydown", key)
		}
		document.onkeyup = event => player.handleKey("keyup", event.code)

		music.reset()

		if (this.dualBattle)
			music.despair_searching.play()
		else
			music.box_15.play()

		// Important resets after a game over
		collisions = genCollisions()
		nero = new Nero(true)
		ocarinus = new Nero(false)
		ocarinus.x = 100
	},

	neroRoomInit() {
		document.onkeydown = event => {
			player.handleKey("keydown", event.code)
			player.fixedKeys(event.code)
		}

		neroHouse.room = 5
		collisions = genCollisions()
	},

	locationTransitions(): boolean {
		// Claudia left Nero's house back to Lerwick
		return player.y > c.h - c.s && this.room == 0
	},

	roomTransitions() {
		let oldRoom = this.room

		if (this.room == 0 && player.x > c.w - c.s) {
			this.room = 1
			player.x = 0
		}

		else if (this.room == 1 && player.x < 0) {
			this.room = 0
			player.x = c.w - c.s
		}

		else if (this.room == 1 && player.y < 0) {
			this.room = 2
			player.y = c.h - c.s
		}

		else if (this.room == 2 && player.x < 0) {
			this.room = 3
			player.x = c.w - c.s
		}

		else if (this.room == 2 && player.y > c.h - c.s) {
			this.room = 1
			player.y = 0
		}

		else if (this.room == 3 && player.y > c.h - c.s) {
			this.room = 4
			player.y = c.s

			scene = new Scene(dialogue.Nero)
		}

		else if (this.room == 3 && player.x > c.w - c.s) {
			this.room = 2
			player.x = 0
		}

		else if (this.room == 4 && player.y < 0) {
			this.room = 3
			player.y = c.h - c.s
		}

		// There was a room switch, so let's update the collisions
		if (oldRoom != this.room)
			collisions = genCollisions()
	},

	move(time: number) {
		if (this.room == 5)
			this.moveBattle(time)

		else {
			// Only check for scenes outside of battle
			if (!scene.playing) player.move(time, "fixed", collisions)
			this.roomTransitions()
		}
	},

	moveBattle(time: number) {
		player.progressCooldowns(time)
		nero.move(time)

		if (this.dualBattle) {
			ocarinus.move(time)

			let enemyOverlap = Math.abs(ocarinus.x - nero.x) < 5 && Math.abs(ocarinus.y - nero.y) < 5
			if (enemyOverlap) {
				switch(RNG(1, 4)) {
					case 1:
						ocarinus.x = w + c.s
						ocarinus.y = w + c.s
						break

					case 2:
						ocarinus.x = c.w - w - c.s - c.s
						ocarinus.y = w + c.s
						break

					case 3:
						ocarinus.x = w + c.s
						ocarinus.y = c.h - w - c.s - c.s
						break

					case 4:
						ocarinus.x = c.w - w - c.s - c.s
						ocarinus.y = c.h - w - c.s - c.s
						break
				}
			}
		}

		// The first collision is Nero, but the collisions array doesn't keep
		// track of his movement

		collisions[0].x = nero.x
		collisions[0].y = nero.y

		// (The second is Ocarinus)

		collisions[1].x = ocarinus.x
		collisions[1].y = ocarinus.y

		if (player.status == "attacking")
			nero.receiveDamage()

		player.move(time, "fixed", collisions)

		// Have the player take damage if Nero or Ocarinus's sword hits them
		if (nero.collision(player.x, player.y))
			player.receiveDamage()
		if (ocarinus.collision(player.x, player.y))
			player.receiveDamage()
	},

	gameOverTransitions(): string {
		if (player.life.hp < 1) return "lose"
		if (nero.life.hp < 1) return "win"
		return "none"
	},

	draw() {
		// Background: floor
		c.fillStyle = "#fcc9b9"
		c.frect(0, 0, c.w, c.h)

		player.draw("fixed")

		for (const wall of objects[this.room]) {
			wall.draw()
		}

		// Only worry about interactables outside of the Nero fight
		if (this.room < 5) {
			for (const int of interactables[this.room]) {
				int.draw()
			}

			if (!scene.playing) {
				let wasSet = false

				for (const int of interactables[this.room]) {
					if (int.inRange()) {

						// We only need to update the prompt box if it doesn't
						// exist yet
						if (!prompt.active)
							prompt.box = new MenuOption("Press X to interact.", int.obj.x - 60, int.obj.y - 60)

						prompt.int = int
						prompt.active = true

						wasSet = true
					}
				}

				// If none of them are inRange, make sure that no prompt is open
				if (!wasSet) prompt.active = false
			}

			// Show the prompt box if in range
			if (prompt.active) prompt.box.show(false)

			// Show the scene text if it's playing
			scene.draw()

			// Don't worry about the battle besides the Nero placement, so it
			// doesn't look like Claudia is talking to nothing
			if (this.room == 4) {
				nero.draw()

				if (this.dualBattle)
					ocarinus.draw()
			}
		}

		if (this.room == 5)
			this.drawBattle()
	},

	drawBattle() {
		nero.draw()
		nero.drawPowerup()

		if (this.dualBattle)
			ocarinus.draw()

		player.drawRange(nero.x, nero.y)
		player.drawCooldowns()

		nero.life.draw()
		player.life.draw()
	},

	gameRestart() {
		this.room = 3
		this.init()

		player.x = c.w/2 - c.s/2
		player.y = c.h - c.s - 5

		// Reset cooldowns - this is important so that the healing cooldown
		// isn't active. Otherwise, after pressing Space to return to the game,
		// you'll be stuck with slower movement speed
		player.resetCooldowns()
	}
}

let collisions = genCollisions()

export default neroHouse
