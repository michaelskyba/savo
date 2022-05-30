import TextBox from "../menus/TextBox"

// 0: Not threatened
// 1: Threatened
let bg = ["#fff", "#ff0000"]
let fg = ["#000", "#fff"]

class Life extends TextBox {
	hp: number
	threatened = false

	constructor(hp: number, x: number, y: number) {
		super("00", x, y, 40, "monospace", "#fff", "#000")
		this.hp = hp
	}

	handleKey(code: string) {
		if (code == "KeyC") this.threatened = false
	}

	hit() {
		this.threatened = true
		this.hp--
	}

	draw() {
		let colIdx = this.threatened ? 1 : 0
		this.bgColour = bg[colIdx]
		this.fgColour = fg[colIdx]

		this.text = this.hp.toString()

		// Draws the TextBox
		super.draw()
	}
}

export default Life
