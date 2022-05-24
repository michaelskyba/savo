import c from "../canvas"

// "Block" is kind of a stupid name for this but I'm not sure what would be
// better. We can't use "Object".

class Block {
	x: number
	y: number
	width: number
	height: number

	colour: string

	constructor(x: number, y: number, width: number, height: number, colour: string) {
		// So, (0, 0) would be the center of the player
		this.x = x + 662.5
		this.y = y + 362.5

		this.width = width
		this.height = height

		this.colour = colour
	}

	draw(scrollX: number, scrollY: number) {
		c.fillStyle = this.colour
		c.frect(this.x - scrollX, this.y - scrollY, this.width, this.height)
	}
}

export default Block
