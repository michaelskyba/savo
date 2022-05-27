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
		let x2 = x1 + 50
		let y2 = y1 + 200

		let x3 = playerX
		let y3 = playerY

		// Player size = 50
		let x4 = x3 + 50
		let y4 = y3 + 50

		// Quick rejects: player out of range of diagonal box
		if (x1 > x4 || x2 < x3 || y1 > y4 || y2 < y3)
			return false

		// Quick accept: sword endpoint inside player
		if (x2 > x3 && x2 < x4 && y2 > y3 && y2 < y4)
			return true

		// Slope
		let m = (y2 - y1)/(x2 - x1)

		/*
		Y-intercept

		y = mx + b
		b = y - mx
		*/

		let b = y1 - m*x1

		// y value of equation when x = player left side (x)
		let intersectLeft = m * x3 + b

		// Check if the line intersects the left side of the player
		if (intersectLeft >= y3 && intersectLeft <= y4)
			return true

		// y value of equation when x = player right side (x + 50)
		let intersectRight = m * x4 + b

		// Check if the line intersects the right side of the player
		if (intersectRight >= y3 && intersectRight <= y4)
			return true

		// This logic shouldn't work for all cases
		// We'll get to that once we start changing x2 and y2

		return false
	}

	// Takes the x and y of the origin
	draw(x: number, y: number) {
		c.strokeStyle = this.colour

		c.lineWidth = 5

		c.beginPath()
		c.moveTo(x, y)
		c.lineTo(x + 50, y + 200)
		c.stroke()
	}
}

export default Sword
