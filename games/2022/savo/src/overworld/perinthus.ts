import c from "../game/canvas"
import player from "../game/player"

import music from "../game/music"

import Block from "./Block"
import Img from "./Img"
import Grass from "./Grass"

import Interactable from "./Interactable"
import MenuOption from "../menus/MenuOption"

import dialogue from "../events/4"
import Scene from "../menus/Scene"

const buildings = [
	// Claudia's house
	new Block(-425, -150, 400, 300, "#bf823e"),

	// Akvedukto
	new Img("akvedukto_overworld", 50, -1150)
]

const interactables = [
	new Interactable("Ovicula", new Block(550, -550, 50, 50, "#f3c13a")),
	new Interactable("Dorus", new Block(175, 1100, 50, 50, "#763568")),
	new Interactable("Palinurus", new Block(-300, 700, 50, 50, "#ebf6f7"))
]

let prompt = {
	int: interactables[0],
	active: false,
	box: new MenuOption("=================================================", 0, 0)
}

let scene = new Scene(dialogue.Ovicula)
scene.playing = false

const roads = [
	// To claudiaHouse
	new Block(-50, -50, 155, 100, "gray"),

	// Main vertical
	new Block(100, -1000, 200, 2000, "gray")
]

const doors = [
	new Block(-50, -50, 25, 100, "brown"),
	new Block(150, -925, 100, 25, "black")
]

const collision = [
	...buildings,
	...interactables.map(i => i.obj)
]

const grass = [
	new Grass(-11, -500),
	new Grass(525, -72),
	new Grass(500, 500),
	new Grass(-100, 1000)
]

const perinthus = {
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

		/*
		We shouldn't use music.reset() because there would be an audible cut,
		even if we play() right after. It's better to manually pause Summer Salt
		without touching Beautiful Ruin. Furthermore, we do not have to reset
		Summer Salt's playback position because that would already happen in
		akvedukto's music.reset() call.
		*/
		music.summer_salt.pause()
		music.beautiful_ruin.play()
	},

	move(time: number) {
		if (!scene.playing) player.move("overworld", collision)

		// Progress each grass animation
		for (const g of grass) {
			g.move(time)
		}
	},

	transitions(): string | null {
		let x = player.x
		let y = player.y

		if (x == 0 && y > -75 && y < 75)
			return "claudiaHouse"

		else if (y == -875 && x > 125 && x < 275)
			return "akvedukto"

		else return null
	},

	draw() {
		c.fillStyle = "#8fbc8f"
		c.frect(0, 0, 1325, 725)

		for (const road of roads) {
			road.draw(player.x, player.y)
		}

		for (const building of buildings) {
			building.draw(player.x, player.y)
		}

		for (const int of interactables) {
			int.draw()
		}

		for (const door of doors) {
			door.draw(player.x, player.y)
		}

		for (const g of grass) {
			g.draw()
		}

		player.draw("overworld")

		// Check if the player went into any prompt ranges
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

// It's better to bind it outside of the requestAnimationFrame call so that a
// new binding doesn't have to be created every frame
perinthus.draw = perinthus.draw.bind(perinthus)

export default perinthus
