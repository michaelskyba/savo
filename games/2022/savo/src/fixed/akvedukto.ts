import c from "../canvas"

import player from "../play/player"
import Enemy from "../play/Enemy"

const enemy = new Enemy(200, 200, 50, 50)

const akvedukto = {
	init() {
		player.x = 500
		player.y = 600

		document.onkeydown = event => player.handleKey("keydown", event.code)
		document.onkeyup = event => player.handleKey("keyup", event.code)
	},

	move: () => player.move("fixed", [enemy]),

	draw() {
		c.fillStyle = "floralwhite"
		c.frect(0, 0, 1325, 725)

		player.draw("fixed")

		enemy.draw()
	}
}

export default akvedukto
