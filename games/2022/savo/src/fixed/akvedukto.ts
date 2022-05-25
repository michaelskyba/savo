import c from "../canvas"

import player from "../play/player"
import Enemy from "../play/Enemy"

const enemy = new Enemy(200, 200, 50, 50)

const akvedukto = {
	init() {
		player.x = 500
		player.y = 600
	},

	draw() {
		c.fillStyle = "white"
		c.frect(0, 0, 1325, 725)

		player.draw("fixed")

		enemy.draw()
	}
}

export default akvedukto
