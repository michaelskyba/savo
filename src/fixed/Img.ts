import c from "../game/canvas"
import BaseImg from "../util/BaseImg"

class Img extends BaseImg {
	draw() {
		this.checkDimensions()
		c.drawImage(this.img, this.x, this.y)
	}
}

export default Img
