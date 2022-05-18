import c from "./canvas"

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

		c.font = this.font
		this.textWidth = c.textWidth(text)

		// this.width = this.textWidth * 1.1
		this.width = this.textWidth * 1.1 + 20
		this.height = this.fontSize + 10
	}

	draw(selected: boolean) {
		c.font = this.font

		let x = 100
		let y = 100 + 100 * this.id

		c.beginPath()
		c.strokeStyle = "#4a4a4a"

		// Selected: Blue
		// Not selected: Light gray
		c.fillStyle = selected ? "#2c8898" : "#f1f1f1"
		c.rect(x, y, this.width, this.height)
		c.fill()
		c.stroke()

		// Selected: White
		// Not selected: Dark gray
		c.fillStyle = selected ? "#f9f9f9" : "#4a4a4a"
		c.text(this.text, x + this.textWidth * 0.05 + 10, y + this.fontSize)
	}
}
