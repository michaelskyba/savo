import c from "../game/canvas"
import player from "../game/player"

import Block from "./Block"

const buildings = [
	// Nero's house
	new Block(500, -50, 400, 300, "maroon")
]

const lerwick = {
	init() {
		document.onkeydown = event => player.handleKey("keydown", event.code)
		document.onkeyup = event => player.handleKey("keyup", event.code)
	},

	move: () => player.move("overworld", buildings),

	draw() {
		c.fillStyle = "#ff8936"
		c.frect(0, 0, 1325, 725)

		for (const building of buildings) {
			building.draw(player.x, player.y)
		}

		player.draw("overworld")
	}
}

export default lerwick
