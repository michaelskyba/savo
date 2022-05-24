import c from "../canvas"
import player from "../play/player"

import Block from "./Block"

const blocks = [
	new Block(-425, -150, 400, 300, "yellow")
]

const decorations = [
	new Block(-50, -50, 155, 100, "gray"),
	new Block(100, -1000, 200, 2000, "gray")
]

const perinthus = {
	draw() {
		c.fillStyle = "purple"
		c.frect(0, 0, 1325, 725)

		player.move([])

		for (const block of decorations) {
			block.draw(player.x, player.y)
		}

		for (const block of blocks) {
			block.draw(player.x, player.y)
		}

		player.draw("overworld")

		window.requestAnimationFrame(this.draw)
	}
}

// It's better to bind it outside of the requestAnimationFrame call so that a
// new binding doesn't have to be created every frame
perinthus.draw = perinthus.draw.bind(perinthus)

export default perinthus
