import c from "../canvas"

import player from "../play/player"
import Enemy from "../play/Enemy"

const enemy = new Enemy(200, 200)

const akvedukto = {
	init() {
		player.x = 500
		player.y = 600

		document.onkeydown = event => player.handleKey("keydown", event.code)
		document.onkeyup = event => player.handleKey("keyup", event.code)
	},

	move(time: number) {
		enemy.move(time)

		player.move("fixed", [{
			x: enemy.x,
			y: enemy.y,
			width: 50,
			height: 50
		}])
	},

	draw() {
		c.fillStyle = "floralwhite"
		c.frect(0, 0, 1325, 725)

		player.draw("fixed")

		enemy.collision(player.x, player.y)
		enemy.draw()
	}
}

export default akvedukto
