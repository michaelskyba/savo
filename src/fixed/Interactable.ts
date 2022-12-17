import Block from "./Block"
import Img from "./Img"

import player from "../game/player"
import c from "../game/canvas"

class Interactable {
	id: string
	obj: Block | Img

	constructor(id: string, obj: Block | Img) {
		this.id = id
		this.obj = obj
	}

	draw() {
		this.obj.draw()
	}

	// Is the player in range to interact?
	inRange(): boolean {
		const obj = this.obj
		const range = 75

		return (player.x > obj.x - range - c.s &&
				player.x < obj.x + obj.width + range &&
				player.y > obj.y - range - c.s &&
				player.y < obj.y + obj.height + range)
	}
}

export default Interactable
