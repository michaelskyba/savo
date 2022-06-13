import c from "../game/canvas"
import player from "../game/player"
import Block from "./Block"

import dialogue from "../events/1"
import Scene from "../menus/Scene"
import TextBox from "../menus/TextBox"
import Img from "./Img"

import music from "../game/music"

const bindows = new Img("bindows", 0, 0)
const intro = new Scene(dialogue.main)
let scene = intro

let wallColour = "#bf823e"
const walls = [
	// Room 0 (left)
	[
		new Block(0, 0, 1325, 25, wallColour),
		new Block(0, 0, 25, 1325, wallColour),
		new Block(0, 700, 1325, 25, wallColour),

		new Block(1300, 0, 25, 262.5, wallColour),
		new Block(1300, 462.5, 25, 262.5, wallColour)
	],

	// Room 1 (right)
	[
		new Block(0, 0, 1325, 25, wallColour),
		new Block(0, 700, 1325, 25, wallColour),

		new Block(0, 0, 25, 262.5, wallColour),
		new Block(0, 462.5, 25, 262.5, wallColour),

		new Block(1300, 0, 25, 262.5, wallColour),
		new Block(1300, 462.5, 25, 262.5, wallColour)
	]
]

function drawScene(scene: Scene) {
	scene.speech.draw()
	if (scene.speaker) scene.speaker.draw()
}

const claudiaHouse = {
	room: 1,

	init() {
		document.onkeydown = event => {
			let key = event.code

			player.handleKey("keydown", key)
			this.handleInput(key)
		}

		document.onkeyup = event => {
			player.handleKey("keyup", event.code)
		}
	},

	handleInput(key: string) {
		// The player has to have pressed Z for anything to happen
		// I don't know if this structure is idiomatic but it saves an indent,
		// which seems to look cleaner?
		if (key != "KeyZ") return

		// The player pressed Z to progress the dialogue
		if (scene.playing) {
			let introPlaying = intro.playing
			scene.progress()

			// Start the next track once movement is open after the intro
			if (introPlaying && !scene.playing) {
				music.reset()
				music.beautiful_ruin.play()
			}
		}
	},

	move() {
		if (!scene.playing)
			player.move("fixed", walls[this.room])
	},

	transitions(): boolean {
		// 1275 = canvas width - player width

		if (player.x < 0) {
			this.room = 0
			player.x = 1275
		}

		if (player.x > 1275) {
			if (this.room == 0) {
				this.room = 1
				player.x = 0
			}

			// Leaving the house - read by steps.ts
			else return true
		}

		return false
	},

	draw() {
		// Special background for scene
		if (intro.playing)
			this.drawIntro()

		else this.drawRoom()
	},

	drawIntro() {
		// Draw the Bindows 10 background if it's relevant
		if (scene.frame > 2 && scene.frame < 12)
			bindows.draw()

		else {
			c.fillStyle = "#ddd"
			c.frect(0, 0, 1325, 725)
		}

		drawScene(scene)
	},

	drawRoom() {
		c.fillStyle = "#f0e68c"
		c.frect(0, 0, 1325, 725)

		if (this.room == 1) {
			c.fillStyle = "#006442"
			c.frect(200, 75, 50, 50)
		}

		player.draw("fixed")

		for (const wall of walls[this.room]) {
			wall.draw()
		}
	}
}
claudiaHouse.draw = claudiaHouse.draw.bind(claudiaHouse)

export default claudiaHouse
