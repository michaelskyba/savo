import c from "../game/canvas"
import TextBox from "../menus/TextBox"

export default class MenuOption extends TextBox {
	constructor(text: string, x: number, y: number) {
		super(text, x, y, 30, "serif", "purple", "white")
	}

	// We can't call it "draw" or it would violate TypeScript
	show(selected: boolean) {
		this.bgColour = selected ? "purple" : "white"
		this.fgColour = selected ? "white" : "black"

		this.draw()
	}
}
