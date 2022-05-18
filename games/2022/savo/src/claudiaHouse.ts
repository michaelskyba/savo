import {ctx} from "./canvas"

const claudiaHouse = {
	draw() {
		ctx.fillStyle = "#f9f9f9"
		ctx.fillRect(0, 0, 1325, 725)
		ctx.fillStyle = "#982c61"
		ctx.fillRect(400, 0, 1325, 725)

		window.requestAnimationFrame(this.draw)
	}
}
claudiaHouse.draw = claudiaHouse.draw.bind(claudiaHouse)

export default claudiaHouse
