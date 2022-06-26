import c from "../game/canvas"
import music from "../game/music"

import player from "../game/player"

import Block from "./Block"
import Img from "./Img"
import Grass from "./Grass"

import Interactable from "./Interactable"
import Scene from "../menus/Scene"
import MenuOption from "../menus/MenuOption"
import dialogue from "../events/5"

const buildings = [
	// Akvedukto
	new Img("akvedukto_overworld", -330, -125),

	// Nero's house
	new Block(700, -1300, 400, 300, "maroon"),

	// Tiberius's house
	new Block(1850, -650, 300, 400, "#c3272b")
]

const roads = [
	// 1. Connecting to Akvedukto and 2
	new Block(-50, -50, 1000, 100, "gray"),

	// 2. Connecting to Nero, 1, and 3
	new Block(850, -1000, 100, 1000, "gray"),

	// 3. Conencting to 2 and Tiberius
	new Block(850, -500, 1000, 100, "gray")
]

const doors = [
	// Akvedukto
	new Block(-55, -50, 25, 100, "black"),

	// Nero's house
	new Block(850, -1025, 100, 25, "brown"),

	// Tiberius's house
	new Block(1850, -500, 25, 100, "brown")
]

const interactables = [
	new Interactable("Hera", new Block(-185, 285, 50, 50, "#171412")),
	new Interactable("Musawer", new Block(550, -1200, 50, 50, "#c91f37")),
	new Interactable("Daria", new Block(1100, -275, 50, 50, "#817b69")),
	new Interactable("Althea", new Block(1725, -600, 50, 50, "#374231")),
	new Interactable("Corculum", new Block(910, -1400, 50, 50, "#d9b611")),
	new Interactable("Calypso", new Block(315, -500, 50, 50, "#fff"))
]

let prompt = {
	int: interactables[0],
	active: false,
	box: new MenuOption("=================================================", 0, 0)
}

let scene = new Scene(dialogue.Musawer)
scene.playing = false

const collision = [
	...interactables.map(int => int.obj),
	...buildings
]

const grass = [
	new Grass(430, 215),
	new Grass(710, -640),
	new Grass(1420, -745),
	new Grass(1710, -300)
]

const lerwick = {
	init() {
		document.onkeydown = event => {
			let key = event.code

			// The player pressed Z to progress the dialogue
			if (key == "KeyZ" && scene.playing)
				scene.progress()

			// The player entered an interaction prompt with X
			else if (key == "KeyX" && prompt.active) {
				prompt.active = false
				scene = new Scene(dialogue[prompt.int.id])
			}

			player.handleKey("keydown", key)
		}
		document.onkeyup = event => player.handleKey("keyup", event.code)

		music.reset()
		music.beautiful_dead.play()
	},

	transitions(): string | null {
		let x = player.x
		let y = player.y

		if (y == -975 && x > 825 && x < 975)
			return "neroHouse"

		if (x == -5 && y > -75 && y < 75)
			return "akvedukto"

		if (x == 1825 && y > -525 && y < -370)
			return "tiberiusHouse"

		else return null
	},

	move(time: number) {
		if (!scene.playing) player.move(time, "overworld", collision)

		for (const g of grass) {
			g.move(time)
		}

		// Looping
		if (player.y > 730) player.y = -1880
		if (player.y < -1880) player.y = 730
		if (player.x < -1020) player.x = 2950
		if (player.x > 2950) player.x = -1020
	},

	draw() {
		c.fillStyle = "#ff8936"
		c.frect(0, 0, 1325, 725)

		for (const road of roads) {
			road.draw(player.x, player.y)
		}

		for (const building of buildings) {
			building.draw(player.x, player.y)
		}

		for (const door of doors) {
			door.draw(player.x, player.y)
		}

		for (const int of interactables) {
			int.draw()
		}

		for (const g of grass) {
			g.draw()
		}

		player.draw("overworld")

		if (!scene.playing) {
			let wasSet = false

			for (const int of interactables) {
				if (int.inRange()) {

					// We only need to update the prompt box if it doesn't exist yet
					if (!prompt.active)
						prompt.box = new MenuOption("Press X to interact.", 120, 550)

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
	}
}

export default lerwick
