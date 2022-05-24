import c from "../canvas"
import player from "../play/player"

import Block from "./Block"

const blocks = [
	new Block(237.5, 200, 400, 400)
]

const perinthus = {
	draw() {
		// Background (temporary)
		c.fillStyle = "green"
		c.frect(0, 0, 1325, 725)
		c.fillStyle = "purple"
		c.frect(0, 0, 500, 500)
		c.frect(500, 500, 825, 225)

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
