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

		this.width = this.img.width
		this.height = this.img.height
	}

	draw(scrollX: number, scrollY: number) {
		c.drawImage(this.img, this.x - scrollX, this.y - scrollY)
	}
}

export default Img
