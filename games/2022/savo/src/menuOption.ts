import {ctx} from "./canvas"

export default class menuOption {
	id: number
	text: string

	fontSize = 20
	font = this.fontSize + "px serif"

	textWidth: number

	width: number
	height: number

	constructor(id: number, text: string) {
		this.id = id
		this.text = text

		ctx.font = this.font
		this.textWidth = ctx.measureText(text).width

		// this.width = this.textWidth * 1.1
		this.width = this.textWidth * 1.1 + 20
		this.height = this.fontSize + 10
	}

	draw(selected: boolean) {
		ctx.font = this.font

		let x = 100
		let y = 100 + 100 * this.id

		ctx.beginPath()
		ctx.strokeStyle = "#4a4a4a"

		// Selected: Blue
		// Not selected: Light gray
		ctx.fillStyle = selected ? "#2c8898" : "#f1f1f1"
		ctx.rect(x, y, this.width, this.height)
		ctx.fill()
		ctx.stroke()

		// Selected: White
		// Not selected: Dark gray
		ctx.fillStyle = selected ? "#f9f9f9" : "#4a4a4a"
		ctx.fillText(this.text, x + this.textWidth * 0.05 + 10, y + this.fontSize)
	}
}
