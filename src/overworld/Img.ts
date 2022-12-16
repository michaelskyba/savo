import c from "../game/canvas"
import BaseImg from "../util/BaseImg"

class Img extends BaseImg {
	constructor(id: string, x: number, y: number) {
		super(id, x, y)
		this.x += 662.5
		this.y += 362.5
	}

	draw(scrollX: number, scrollY: number) {
		this.checkDimensions()
		c.drawImage(this.img, this.x - scrollX, this.y - scrollY)
	}
}

export default Img
