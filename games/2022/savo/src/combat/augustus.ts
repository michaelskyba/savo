import c from "../game/canvas"

class Augustus {
	x = 100
	y = 100

	draw() {
		c.fillStyle = "#eee"
		c.frect(this.x, this.y, 50, 50)
	}
}

const augustus = new Augustus()
export default augustus
