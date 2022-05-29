import c from "../canvas"

class Sword {
	length: number
	colour = "coral"

	angle: number

	offsetX: number
	offsetY: number

	constructor(length: number, angle: number) {
		this.length = length
		this.angle = angle

		this.genPoints()
	}

	rotate(change: number) {
		this.angle += change

		if (this.angle < 0) this.angle = 360 + this.angle % 360
		if (this.angle > 360) this.angle = this.angle % 360

		this.genPoints()
	}

	genPoints() {
		let rad = Math.round(this.angle) * Math.PI / 180

		this.offsetX = this.length * Math.cos(rad)
		this.offsetY = this.length * Math.sin(rad)
	}

	collision(originX: number, originY: number, playerX: number, playerY: number) {
		// I hope this is optimal enough to avoid causing a significant input lag
		// I might have been easier to compare angles instead

		let x1 = originX
		let y1 = originY

		let x2 = x1 + this.offsetX
		let y2 = y1 + this.offsetY

		let x3 = playerX
		let y3 = playerY

		// Player size = 50
		let x4 = x3 + 50
		let y4 = y3 + 50

		// Quick rejects: player out of range of diagonal box
		if (Math.min(x1, x2) > x4 || Math.max(x1, x2) < x3 ||
			Math.min(y1, y2) > y4 || Math.max(y1, y2) < y3)
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

		/*
		y = mx + b
		mx + b = y
		mx = y - b
		x = (y - b)/m
		*/

		// x value of equation when y = player top side (y)
		let intersectTop = (y3 - b) / m

		// Check if line intersects the top side of the player
		if (intersectTop >= x3 && intersectTop <= x4)
			return true

		// x value of equation when y = player bottom side (y + 50)
		let intersectBottom = (y4 - b) / m

		// Check if line intersects the bottom side of the player
		if (intersectBottom >= x3 && intersectBottom <= x4)
			return true

		return false
	}

	// Takes the x and y of the origin
	draw(x: number, y: number) {
		c.strokeStyle = this.colour

		c.lineWidth = 5

		c.beginPath()
		c.moveTo(x, y)
		c.lineTo(x + this.offsetX, y + this.offsetY)
		c.stroke()
	}
}

export default Sword
