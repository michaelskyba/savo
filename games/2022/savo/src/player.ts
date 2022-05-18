import ctx from "./canvas"

const player = {
	x: 200,
	y: 200,
	size: 50,

	draw() {
		ctx.fillStyle = "#2c8898"
		ctx.fillRect(this.x, this.y, this.size, this.size)
	}
}

export default player
