import c from "./canvas"

const player = {
	x: 200,
	y: 200,
	size: 50,

	draw() {
		c.fillStyle = "#2c8898"
		c.frect(this.x, this.y, this.size, this.size)
	}
}

export default player
