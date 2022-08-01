import Block from "./Block"
import Img from "./Img"

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

		let x = obj.x - 662.5 + 25
		let y = obj.y - 362.5 + 25

		// Made with the assumption that player is (50, 50) in width and height
		return (player.x > x - 125 &&
				player.x < x + obj.width + 75 &&
				player.y > y - 125 &&
				player.y < y + obj.height + 75)
	}
}

export default Interactable
