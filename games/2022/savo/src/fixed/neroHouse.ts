import c from "../game/canvas"
import Block from "./Block"

import music from "../game/music"

import player from "../game/player"
import Nero from "../combat/Nero"

import Interactable from "./Interactable"
import Scene from "../menus/Scene"
import MenuOption from "../menus/MenuOption"
import dialogue from "../events/6"

const nero = new Nero()

let wallColour = "maroon"
let objects = [
	// First room
	[
		new Block(0, 0, 1325, 25, wallColour),
		new Block(0, 0, 25, 1325, wallColour),

		// Bottom intersection
		new Block(0, 700, 512.5, 25, wallColour),
		new Block(812.5, 700, 612.5, 25, wallColour),

		// Right intersection
		new Block(1300, 0, 25, 212.5, wallColour),
		new Block(1300, 512.5, 25, 212.5, wallColour)
	],

	// Second room - entered through the right of first room
	[
		new Block(0, 700, 1325, 25, wallColour),

		// Left intersection
		new Block(0, 0, 25, 212.5, wallColour),
		new Block(0, 512.5, 25, 212.5, wallColour),

		// Top intersection
		new Block(0, 0, 512.5, 25, wallColour),
		new Block(812.5, 0, 612.5, 25, wallColour),

		new Block(1300, 0, 25, 725, wallColour)
	],

	// Third room - entered through the top of second room
	[
		new Block(0, 0, 1325, 25, wallColour),

		// Left intersection
		new Block(0, 0, 25, 212.5, wallColour),
		new Block(0, 512.5, 25, 212.5, wallColour),

		// Bottom intersection
		new Block(0, 700, 512.5, 25, wallColour),
		new Block(812.5, 700, 612.5, 25, wallColour),

		new Block(1300, 0, 25, 725, wallColour)
	],

	// Fourth room - entered through the left of third room
	[
		new Block(0, 0, 25, 1325, wallColour),
		new Block(0, 0, 1325, 25, wallColour),

		// Right intersection
		new Block(1300, 0, 25, 212.5, wallColour),
		new Block(1300, 512.5, 25, 212.5, wallColour),

		// Bottom intersection
		new Block(0, 700, 512.5, 25, wallColour),
		new Block(812.5, 700, 612.5, 25, wallColour),
	],

	// Fifth (Nero's) room - entered through the bottom of the fourth room
	[
		new Block(0, 0, 25, 725, wallColour),
		new Block(0, 700, 1325, 25, wallColour),
		new Block(1300, 0, 25, 725, wallColour),

		// Top intersection
		new Block(0, 0, 512.5, 25, wallColour),
		new Block(812.5, 0, 612.5, 25, wallColour),
	],

	// (Nero's) room - locked
	[
		new Block(0, 0, 1325, 25, wallColour),
		new Block(0, 0, 25, 1325, wallColour),
		new Block(1300, 0, 25, 725, wallColour),
		new Block(0, 700, 1325, 25, wallColour)
	]
]

const interactables = [
	[new Interactable("Mercury", new Block(637.5, 337.5, 50, 50, "#776d5a"))],
	[],
	[new Interactable("Hector", new Block(935, 80, 50, 50, "#16db93"))],
	[new Interactable("Serapio", new Block(1100, 600, 50, 50, "#20063b"))],
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
			...collisions
		]
	else return collisions
}

const neroHouse = {
	room: 0,

	init() {
		document.onkeydown = event => {
			let key = event.code

			// The player pressed Z to progress the dialogue
			if (key == "KeyZ" && scene.playing) {
				scene.progress()

				// Progress to fake battle room (5) after fight intro dialogue
				if (!scene.playing && neroHouse.room == 4) {
					neroHouse.room = 5
					neroHouse.neroRoomInit()
					collisions = genCollisions()
				}
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
		music.box_15.play()
	},

	neroRoomInit() {
		document.onkeydown = event => {
			player.handleKey("keydown", event.code)
			player.fixedKeys(event.code)
		}
	},

	locationTransitions(): boolean {
		// Claudia left Nero's house back to Lerwick
		// 675 = canvas height - player height
		return player.y > 675 && this.room == 0
	},

	roomTransitions() {
		let oldRoom = this.room

		if (this.room == 0 && player.x > 1275) {
			this.room = 1
			player.x = 0
		}

		else if (this.room == 1 && player.x < 0) {
			this.room = 0
			player.x = 1275
		}

		else if (this.room == 1 && player.y < 0) {
			this.room = 2
			player.y = 675
		}

		else if (this.room == 2 && player.x < 0) {
			this.room = 3
			player.x = 1275
		}

		else if (this.room == 2 && player.y > 675) {
			this.room = 1
			player.y = 0
		}

		else if (this.room == 3 && player.y > 675) {
			this.room = 4
			player.y = 50

			scene = new Scene(dialogue.Nero)
		}

		else if (this.room == 3 && player.x > 1275) {
			this.room = 2
			player.x = 0
		}

		else if (this.room == 4 && player.y < 0) {
			this.room = 3
			player.y = 675
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
			if (!scene.playing) player.move("fixed", collisions)
			this.roomTransitions()
		}

	},

	moveBattle(time: number) {
		player.progressCooldowns(time)
		nero.move(time)

		// The first collision is Nero, but the collisions array doesn't keep
		// track of his movement

		/*
		TypeScript isn't smart enough to figure out that if this block is
		running, collisions[0] has to have a .x and .y. But, I don't know how to
		tell it that. Since I'm running out of time, it's easier to just ingore
		these.
		*/

		// @ts-ignore
		collisions[0].x = nero.x

		// @ts-ignore
		collisions[0].y = nero.y

		if (player.status == "attacking") {
			nero.receiveDamage()
		}

		player.move("fixed", collisions)
	},

	draw() {
		// Background: floor
		c.fillStyle = "#fcc9b9"
		c.frect(0, 0, 1325, 725)

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

						// We only need to update the prompt box if it doesn't exist yet
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
			if (scene.playing) {
				scene.speech.draw()
				if (scene.speaker) scene.speaker.draw()
			}

			// Don't worry about the battle besides the Nero placement, so it
			// doesn't look like Claudia is talking to nothing
			if (this.room == 4) nero.draw()
		}

		if (this.room == 5)
			this.drawBattle()
	},

	drawBattle() {
		nero.draw()

		player.drawRange(nero.x, nero.y)
		player.drawCooldowns()

		nero.life.draw()
		player.life.draw()
	}
}

let collisions = genCollisions()

export default neroHouse
