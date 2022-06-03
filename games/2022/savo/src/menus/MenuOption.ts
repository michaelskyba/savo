import c from "../game/canvas"
import TextBox from "../menus/TextBox"

export default class MenuOption extends TextBox {
	constructor(text: string, x: number, y: number) {
		super(text, x, y, 30, "serif", "maroon", "white")
	}

	// We can't call it "draw" or it would violate TypeScript
	// If we didn't have the boolean variable, I could name it "draw" and then
	// use super.draw() to call the superclass's draw.
	show(selected: boolean) {
		this.bgColour = selected ? "maroon" : "white"
		this.fgColour = selected ? "white" : "#111"

		this.draw()
	}
}
