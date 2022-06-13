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
	inRange() {
	}
}

export default Interactable
