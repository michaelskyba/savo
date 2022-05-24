import c from "../canvas"

export default class TextBox {
	text: string

	x: number
	y: number

	fontSize: number
	font: string
	textWidth: number

	width: number
	height: number

	fgColour: string
	bgColour: string

	constructor(text: string, x: number, y: number, fontSize: number,
	            fontFamily: string, bgColour: string, fgColour: string) {

		this.text = text

		this.x = x
		this.y = y

		this.fontSize = fontSize

		// The canvas context takes e.g. "48px monospace" as a font
		this.font = fontSize + "px " + fontFamily
		c.font = this.font

		this.textWidth = c.textWidth(text)

		this.width = this.textWidth + 40
		this.height = this.fontSize + 10

		this.fgColour = fgColour
		this.bgColour = bgColour
	}

	draw() {
		c.beginPath()

		c.strokeStyle = "black"
		c.font = this.font

		c.fillStyle = this.bgColour
		c.rect(this.x, this.y, this.width, this.height)

		c.fill()
		c.stroke()

		// The y position of c.text is higher than it's supposed to be
		// Adding the fontSize creates a decent but imperfect offset
		let y = this.y + this.fontSize

		c.fillStyle = this.fgColour
		c.text(this.text, this.x + 20, y)
	}
}
