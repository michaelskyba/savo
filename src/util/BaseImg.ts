import c from "../game/canvas"
import BaseImg from "../util/BaseImg"

// No draw because we might have () or (number number) as args

class Img {
	x: number
	y: number

	width: number
	height: number

	img: HTMLImageElement

	constructor(id: string, x: number, y: number) {
		this.x = x
		this.y = y

		this.img = document.getElementById(id) as HTMLImageElement
		this.initDimensions()
	}

	initDimensions() {
		this.width = this.img.width
		this.height = this.img.height
		console.log(this.img.id, "setting new dimensions", this.width, this.height)
	}

	// <img> dimensions are set to 0 before they are fully loaded, which will
	// lead to collision errors if they are not checked constantly
	checkDimensions() {
		if (this.width == 0 || this.height == 0)
			this.initDimensions()
	}
}

export default Img
