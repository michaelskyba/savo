import c from "../game/canvas"

// A "Block" is just a coloured rectangle. Since it's in overworld/, it's meant
// to be placed in the overworld, which is why it keeps scroll xy in mind.
// There's also the respective fixed/Block.ts for fixed locations.

class Block {
	x: number
	y: number
	width: number
	height: number

	colour: string

	constructor(x: number, y: number, width: number, height: number, colour: string) {
		// We want (0, 0) to be the center of the player
		this.x = x + c.w/2
		this.y = y + c.h/2

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
