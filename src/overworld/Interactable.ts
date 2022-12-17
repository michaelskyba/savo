import Block from "./Block"
import Img from "./Img"

import c from "../game/canvas"
import player from "../game/player"

class Interactable {
	id: string
	obj: Block | Img

	constructor(id: string, obj: Block | Img) {
		this.id = id
		this.obj = obj
	}

	draw() {
		this.obj.draw(player.x, player.y)
	}

	// Is the player in range to interact?
	inRange(): boolean {
		let obj = this.obj

		let x = obj.x - (c.w/2) + (c.s/2)
		let y = obj.y - (c.h/2) + (c.s/2)

		let range = 100
		return (player.x > x - range - c.s &&
				player.x < x + obj.width + range - c.s &&
				player.y > y - range - c.s &&
				player.y < y + obj.height + range - c.s)
	}
}

export default Interactable
