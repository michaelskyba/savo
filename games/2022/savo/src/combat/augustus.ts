import c from "../game/canvas"

class Augustus {
	x = 993.75
	y = 337.5

	draw() {
		c.fillStyle = "#eee"
		c.frect(this.x, this.y, 50, 50)
	}
}

const augustus = new Augustus()
export default augustus
