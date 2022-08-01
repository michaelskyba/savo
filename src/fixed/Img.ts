import c from "../game/canvas"

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

		this.width = this.img.width
		this.height = this.img.height
	}

	draw() {
		c.drawImage(this.img, this.x, this.y)
	}
}

export default Img
