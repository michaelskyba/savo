import player from "../game/player"
import music from "../game/music"
import c from "../game/canvas"

import Scene from "../menus/Scene"
import dialogue from "../events/7"

import Block from "./Block"
import Interactable from "./Interactable"

const wallColour = "#c3272b"
const walls = [
	// Initial room after entering from Lerwick
	// Includes Claudius and door to room 1
	[
		new Block(0, 0, 1325, 25, wallColour),
		new Block(0, 700, 1325, 25, wallColour),

		new Block(0, 0, 25, 262.5, wallColour),
		new Block(0, 462.5, 25, 262.5, wallColour),

		new Block(1300, 0, 25, 262.5, wallColour),
		new Block(1300, 462.5, 25, 262.5, wallColour)
	],

	// To the right of room 0
	// Includes Tiberius - is the center room that touches all other rooms
	[
		// Right opening
		// Needs to be drawn first so it's behind the other walls
		new Block(1300, 0, 25, 262.5, "#8db255"),
		new Block(1300, 462.5, 25, 262.5, "#8db255"),

		// Top opening
		new Block(0, 0, 562.5, 25, wallColour),
		new Block(762.5, 0, 562.5, 25, wallColour),

		// Bottom opening
		new Block(0, 700, 562.5, 25, wallColour),
		new Block(762.5, 700, 562.5, 25, wallColour),

		// Left opening
		new Block(0, 0, 25, 262.5, wallColour),
		new Block(0, 462.5, 25, 262.5, wallColour)
	],

	// The room which is above room 1
	[
		new Block(0, 0, 1325, 25, wallColour),
		new Block(0, 0, 25, 725, wallColour),
		new Block(1300, 0, 25, 725, wallColour),

		// Bottom opening
		new Block(0, 700, 562.5, 25, wallColour),
		new Block(762.5, 700, 562.5, 25, wallColour)
	],

	// The room which is below room 1
	[
		new Block(0, 700, 1325, 25, wallColour),
		new Block(0, 0, 25, 725, wallColour),
		new Block(1300, 0, 25, 725, wallColour),

		// Top opening
		new Block(0, 0, 562.5, 25, wallColour),
		new Block(762.5, 0, 562.5, 25, wallColour)
	],
]

const claudius = new Interactable("Claudius", new Block(200, 600, 50, 50, "#1d697c"))
const tiberius = new Interactable("Tiberius", new Block(1000, 600, 50, 50, "#48929b"))

let scene = new Scene(dialogue.Claudius)
scene.playing = false

class House {
	room = 0
	collisions = []

	init() {
		document.onkeydown = event => {
			let code = event.code

			if (scene.playing && code == "KeyZ")
				scene.progress()

			else if (!scene.playing)
				player.handleKey("keydown", code)
		}

		document.onkeyup = event => {
			if (!scene.playing)
				player.handleKey("keyup", event.code)
		}

		this.genCollisions()

		music.reset()
		music.climactic_return.play()
	}

	genCollisions() {
		let room = this.room
		this.collisions = walls[room]

		if (room == 0) this.collisions.push(claudius.obj)
		if (room == 1) this.collisions.push(tiberius.obj)
	}

	transitions(): string | null {
		let oldRoom = this.room

		if (this.room == 0 && player.x < 0)
			return "Lerwick"

		else if (this.room == 1 && player.x > 1275)
			return "AugustusRoom"

		else if (this.room == 0 && player.x > 1275) {
			player.x = 0
			this.room = 1
		}

		else if (this.room == 1 && player.x < 0) {
			player.x = 1275
			this.room = 0
		}

		else if (this.room == 1 && player.y < 0) {
			player.y = 675
			this.room = 2
		}

		else if (this.room == 3 && player.y < 0) {
			player.y = 675
			this.room = 1
		}

		else if (this.room == 2 && player.y > 675) {
			player.y = 0
			this.room = 1
		}

		else if (this.room == 1 && player.y > 675) {
			player.y = 0
			this.room = 3
		}

		// We switched rooms
		if (this.room != oldRoom) this.genCollisions()

		// The location transition conditions failed, so we're not changing
		return null
	}

	move(time: number) {
		if (!scene.playing) player.move(time, "fixed", this.collisions)
	}

	draw() {
		// Floor
		c.fillStyle = "#dba97d"
		c.frect(0, 0, 1325, 725)

		// Black entrance floor to Augustus's room
		if (this.room == 1) {
			c.fillStyle = "#111"
			c.frect(1312.5, 262.5, 12.5, 200)
		}

		for (const obj of this.collisions) {
			obj.draw()
		}

		player.draw("fixed")

		/*
		if (!scene.playing) this.checkRanges()
		if (prompt.active) prompt.box.show(false)
		scene.draw()
		*/
	}
}

const house = new House()
export default house
