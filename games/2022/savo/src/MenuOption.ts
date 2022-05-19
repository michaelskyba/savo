import c from "./canvas"
import TextBox from "./TextBox"

let gray = "#f1f1f1"
let black = "#4a4a4a"
let white = "#f9f9f9"
let purple = "#982c61"

export default class MenuOption extends TextBox {
	constructor(text: string, x: number, y: number) {
		super(text, x, y, 30, "serif", purple, white)
	}

	// We can't call it "draw" or it would violate TypeScript
	show(selected: boolean) {
		this.bgColour = selected ? purple : gray
		this.fgColour = selected ? white : black

		this.draw()
	}
}
