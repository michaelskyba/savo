import textBox from "./textBox"

class Scene {
	dialogue: string[][]
	playing: boolean

	frame = 1

	speaker: textBox | null
	speech: textBox

	constructor(dialogue: string[][], playing?: boolean) {
		this.dialogue = dialogue

		// If it's not provided (undefined), let it be true
		this.playing = (playing !== false)

		let line = dialogue[this.frame]

		if (line[0])
			this.speaker = new textBox(line[0], 50, 550, 30, "serif", "black", "white")
		else this.speaker = null

		this.speech = new textBox(line[1], 50, 600, 30, "serif", "white", "black")
	}
}

export default Scene
