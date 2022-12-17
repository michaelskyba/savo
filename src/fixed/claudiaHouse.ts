import c from "../game/canvas"
import player from "../game/player"

import dialogue from "../events/1"
import Scene from "../menus/Scene"
import MenuOption from "../menus/MenuOption"

import Block from "./Block"
import Img from "./Img"

import music from "../game/music"

import Interactable from "./Interactable"
import intDialogue from "../events/3"

const bindows = new Img("bindows", 0, 0)
const intro = new Scene(dialogue.main)
let scene = intro

const interactables = [
	// Room 0 (left)
	[
		new Interactable("stove", new Img("stove", 150, 75)),
		new Interactable("Claudius", new Block(200, 600, c.s, c.s, "#1d697c"))
	],

	// Room 1 (right)
	[
		new Interactable("Messalina", new Block(200, 75, c.s, c.s, "#006442")),
		new Interactable("bookshelf", new Img("bookshelf", 650, 75)),
		new Interactable("bed", new Img("bed", 150, 550))
	]
]

// Prompt for interacting with an interactable
// [0][0] is just a default which shouldn't pop up by itself
let prompt = {
	int: interactables[0][0],
	active: false,
	box: new MenuOption("=================================================", 0, 0)
}

// Wall width
const w = 25

// Door gap
const gap = 200

let wallColour = "#bf823e"
const walls = [
	// Room 0 (left)
	[
		new Block(0, 0, c.w, w, wallColour),
		new Block(0, 0, w, c.w, wallColour),
		new Block(0, c.h - w, c.w, w, wallColour),

		new Block(c.w - w, 0, w, (c.h-gap)/2, wallColour),
		new Block(c.w - w, (c.h-gap)/2 + gap, w, (c.h-gap)/2, wallColour)
	],

	// Room 1 (right)
	[
		new Block(0, 0, c.w, w, wallColour),
		new Block(0, c.h - w, c.w, w, wallColour),

		new Block(0, 0, w, (c.h-gap)/2, wallColour),
		new Block(0, (c.h-gap)/2 + gap, w, (c.h-gap)/2, wallColour),

		new Block(c.w - w, 0, w, (c.h-gap)/2, wallColour),
		new Block(c.w - w, (c.h-gap)/2 + gap, w, (c.h-gap)/2, wallColour)
	]
]
let collision

class ClaudiaHouse {
	room = 1

	constructor() {
	}

	init() {
		document.onkeydown = event => {
			let key = event.code

			player.handleKey("keydown", key)
			this.handleInput(key)
		}

		document.onkeyup = event => {
			player.handleKey("keyup", event.code)
		}

		this.genCollision()
	}

	genCollision() {
		collision = [
			...walls[this.room],

			// The Img/Block is stored in the .obj property in the Interactable class
			...interactables[this.room].map(i => i.obj)
		]
	}

	handleInput(key: string) {
		// The player pressed Z to progress the dialogue
		if (key == "KeyZ" && scene.playing) {
			let introPlaying = intro.playing
			scene.progress()

			// Start the next track once movement is open after the intro
			if (introPlaying && !scene.playing) {
				music.reset()
				music.beautiful_ruin.play()
			}
		}

		// The player entered an interaction prompt with X
		else if (key == "KeyX" && prompt.active) {
			prompt.active = false
			scene = new Scene(intDialogue[prompt.int.id])
		}
	}

	// Give input to the player, but only if a dialogue isn't playing
	move(time: number) {
		if (!scene.playing) player.move(time, "fixed", collision)
	}

	transitions(): boolean {
		// 1275 = canvas width - player width

		if (player.x < 0) {
			this.room = 0
			player.x = 1275

			this.genCollision()
		}

		if (player.x > 1275) {
			if (this.room == 0) {
				this.room = 1
				player.x = 0

				this.genCollision()
			}

			// Leaving the house - read by steps.ts
			else return true
		}

		return false
	}

	draw() {
		// Special background for scene
		if (intro.playing)
			this.drawIntro()

		else this.drawRoom()
	}

	drawIntro() {
		// Draw the Bindows 10 background if it's relevant
		if (scene.frame > 2 && scene.frame < 12)
			bindows.draw()

		else {
			c.fillStyle = "#ddd"
			c.frect(0, 0, c.w, c.h)
		}

		scene.draw()
	}

	drawRoom() {
		c.fillStyle = "#f0e68c"
		c.frect(0, 0, c.w, c.h)

		player.draw("fixed")

		for (const wall of walls[this.room]) {
			wall.draw()
		}

		// Drawing the objects
		for (const interactable of interactables[this.room]) {
			interactable.draw()
		}

		if (!scene.playing) this.checkRanges()
		if (prompt.active) prompt.box.show(false)

		scene.draw()
	}

	checkRanges() {
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
}

// I'm making a temporary class here to avoid commas after methods, binding
// "this", etc.
const claudiaHouse = new ClaudiaHouse()
export default claudiaHouse
