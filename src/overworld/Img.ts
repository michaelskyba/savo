import c from "../game/canvas"

class Img {
	x: number
	y: number

	width: number
	height: number

	img: HTMLImageElement

	constructor(id: string, x: number, y: number) {
		this.x = x + 662.5
		this.y = y + 362.5

		this.img = document.getElementById(id) as HTMLImageElement
		this.initDimensions()
	}

	initDimensions() {
		this.width = this.img.width
		this.height = this.img.height
		console.log(this.img.id, "setting new dimensions", this.width, this.height)
	}

	draw(scrollX: number, scrollY: number) {
		if (this.width == 0 || this.height == 0) {
			this.initDimensions()
			console.log(this.img.id, "Width or height is 0")
		}
		// else console.log(this.img.id, "Width and height aren't 0")

		c.drawImage(this.img, this.x - scrollX, this.y - scrollY)
	}
}

export default Img
