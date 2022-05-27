import c from "../canvas"

class Sword {
	length: number
	colour = "coral"

	constructor(length: number) {
		this.length = length
	}

	collision(originX: number, originY: number, playerX: number, playerY: number) {
		let x1 = originX
		let y1 = originY

		// For now, assume that the line is constantly in the (+100, +100) position
		let x2 = x1 + 100
		let y2 = y1 + 100

		let x3 = playerX
		let y3 = playerY

		// Player size = 50
		let x4 = x3 + 50
		let y4 = y3 + 50

		// Quick rejects
		if (x1 > x4 || x2 < x3 || y1 > y4 || y2 < y3)
			return false

		return true
	}

	// Takes the x and y of the origin
	draw(x: number, y: number) {
		c.strokeStyle = this.colour

		c.lineWidth = 5

		c.beginPath()
		c.moveTo(x, y)
		c.lineTo(x + 100, y + 100)
		c.stroke()
	}
}

export default Sword
