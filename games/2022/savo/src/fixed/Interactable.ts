import Block from "./Block"
import Img from "./Img"

import player from "../game/player"

class Interactable {
	obj: Block | Img

	constructor(obj: Block | Img) {
		this.obj = obj
	}

	draw() {
		this.obj.draw()
	}

	// Is the player in range to interact?
	inRange(): boolean {
		let obj = this.obj

		// Made with the assumption that player is (50, 50) in width and height
		return (player.x > obj.x - 125 &&
				player.x < obj.x + obj.width + 75 &&
				player.y > obj.y - 125 &&
				player.y < obj.y + obj.height + 75)
	}
}

export default Interactable
