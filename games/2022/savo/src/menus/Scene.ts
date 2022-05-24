import TextBox from "./TextBox"

class Scene {
	dialogue: string[][]
	playing = true

	frame = 0

	speaker: TextBox | null
	speech: TextBox

	// Create text boxes for the current frame
	setBoxes(frame: number) {
		let line = this.dialogue[frame]

		if (line[0])
			this.speaker = new TextBox(line[0], 50, 550, 30, "serif", "black", "white")
		else this.speaker = null

		this.speech = new TextBox(line[1], 50, 600, 30, "serif", "white", "black")
	}

	constructor(dialogue: string[][], playing?: boolean) {
		this.dialogue = dialogue
		this.setBoxes(this.frame)
	}

	progress() {
		if (this.frame <= this.dialogue.length - 2) {
			this.frame++
			this.setBoxes(this.frame)
		}

		// e.g. pressed z, frame = 5 (fifth frame), six total frames
		else {
			this.playing = false
		}
	}
}

export default Scene
