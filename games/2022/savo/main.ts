const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

class menuOption {
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

const mainMenu = {
	options: [
		new menuOption(0, "Start"),
		new menuOption(1, "Credits")
	],

	draw() {
		ctx.fillStyle = "#f9f9f9"
		ctx.fillRect(0, 0, 1325, 725)

		ctx.font = "48px monospace"
		ctx.fillStyle = "#4a4a4a"
		ctx.fillText("Malfacile Gajnita Savo", 50, 50)

		this.options[0].draw(true)
		this.options[1].draw(false)

		window.requestAnimationFrame(this.draw)
	}
}
mainMenu.draw = mainMenu.draw.bind(mainMenu)

window.requestAnimationFrame(mainMenu.draw)
