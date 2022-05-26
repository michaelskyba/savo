import c from "../canvas"

class Sword {
	length: number

	constructor(length: number) {
		this.length = length
	}

	// Takes the x and y of the origin
	draw(x: number, y: number) {
		c.strokeStyle = "coral"
		c.lineWidth = 5

		c.beginPath()
		c.moveTo(x, y)
		c.lineTo(x + 100, y + 100)
		c.stroke()
	}
}

export default Sword
