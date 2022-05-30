import c from "../game/canvas"

import player from "../game/player"
import Frontinus from "../combat/Frontinus"

const frontinus = new Frontinus()

const akvedukto = {
	init() {
		player.x = 500
		player.y = 600

		document.onkeydown = event => {
			player.handleKey("keydown", event.code)
			player.life.handleKey(event.code)
		}
		document.onkeyup = event => player.handleKey("keyup", event.code)
	},

	move(time: number) {
		frontinus.move(time)

		player.move("fixed", [{
			x: frontinus.x,
			y: frontinus.y,
			width: 50,
			height: 50
		}])

		if (frontinus.collision(player.x, player.y))
			player.receiveDamage()
	},

	draw() {
		c.fillStyle = "floralwhite"
		c.frect(0, 0, 1325, 725)

		player.draw("fixed")

		frontinus.draw()

		player.life.draw()
		player.drawCooldowns()
	}
}

export default akvedukto
