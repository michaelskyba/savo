import c from "../canvas"

// "Block" is kind of a stupid name for this but I'm not sure what would be
// better. We can't use "Object".

class Block {
	x: number
	y: number
	width: number
	height: number

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}

	draw(scrollX: number, scrollY: number) {
		c.fillStyle = "yellow"
		c.frect(scrollX + this.x, scrollY + this.y, this.width, this.height)
	}
}

export default Block
