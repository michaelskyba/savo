import c from "../canvas"
import player from "../play/player"

const akvedukto = {
	draw() {
		c.fillStyle = "white"
		c.frect(0, 0, 1325, 725)

		player.draw("fixed")
	}
}

export default akvedukto
