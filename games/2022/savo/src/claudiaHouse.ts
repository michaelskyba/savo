import c from "./canvas"
import player from "./player"

const claudiaHouse = {
	draw() {
		c.fillStyle = "#f9f9f9"
		c.frect(0, 0, 1325, 725)

		c.fillStyle = "#982c61"
		c.frect(400, 0, 925, 725)

		player.draw()

		window.requestAnimationFrame(this.draw)
	}
}
claudiaHouse.draw = claudiaHouse.draw.bind(claudiaHouse)

export default claudiaHouse
