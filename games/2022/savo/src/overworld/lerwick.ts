import c from "../game/canvas"
import player from "../game/player"

import Block from "./Block"

const buildings = [
	// Akvedukto
	new Block(-330, -100, 300, 200, "lightblue"),

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
	new Block(-55, -50, 25, 100, "brown"),

	// Nero's house
	new Block(850, -1025, 100, 25, "brown"),

	// Tiberius's house
	new Block(1850, -500, 25, 100, "brown")
]

const lerwick = {
	init() {
		document.onkeydown = event => player.handleKey("keydown", event.code)
		document.onkeyup = event => player.handleKey("keyup", event.code)
	},

	transitions(): string | null {
		return null
	},

	move: () => player.move("overworld", buildings),

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

		c.text(`(${player.x}, ${player.y})`, 50, 50)

		player.draw("overworld")
	}
}

export default lerwick
