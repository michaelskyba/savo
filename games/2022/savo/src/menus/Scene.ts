import TextBox from "./TextBox"

class Scene {
	dialogue: string[][]
	playing = true

	frame = 0

	speaker: TextBox | null
	speech: TextBox

	constructor(dialogue: string[][], playing?: boolean) {
		this.dialogue = dialogue
		this.setBoxes(this.frame)
	}

	// Create text boxes for the current frame
	setBoxes(frame: number) {
		let line = this.dialogue[frame]

		let fg = "white"
		let bg = "#111"

		switch(line[0]) {
			// Copy-pasting is bad but I just want to be done with this
			// It's not like it's an important project

			case "Claudia":
				bg = "maroon"
				break

			case "Claudius":
				bg = "#1d697c"
				break

			case "Messalina":
				bg = "#006442"
				break

			case "Palinurus":
				bg = "#ebf6f7"
				fg = "#111"
				break

			case "Dorus":
				bg = "#763568"
				break

			case "Ovicula":
				bg = "#f3c13a"
				fg = "#111"
				break

			case "Frontinus":
				bg = "midnightblue"
				break

			case "Hera":
				bg = "#171412"
				break

			case "Musawer":
				bg = "#c91f37"
				break

			case "Daria":
				bg = "#817b69"
				fg = "#111"
				break

			case "Althea":
				bg = "#374231"
				break

			case "Corculum":
				bg = "#d9b611"
				fg = "#111"
				break

			case "Calypso":
				bg = "#fff"
				fg = "#111"
				break

			case "Mercury":
				bg = "#776d5a"
				break

			case "Hector":
				bg = "#16db93"
				break

			case "Serapio":
				bg = "#20063b"
				break

			case "Nero":
				bg = "maroon"
				break

			case "Tiberius":
				bg = "#48929b"
				break

			case "Augustus":
				bg = "#eee"
				fg = "#111"
		}

		if (line[0])
			this.speaker = new TextBox(line[0], 50, 550, 30, "serif", bg, fg)
		else this.speaker = null

		this.speech = new TextBox(line[1], 50, 600, 30, "serif", "white", "#111")
	}

	progress() {
		if (this.frame <= this.dialogue.length - 2) {
			this.frame++
			this.setBoxes(this.frame)
		}

		// e.g. pressed z, frame = 5 (fifth frame), six total frames
		else this.playing = false
	}

	draw() {
		if (!this.playing) return

		this.speech.draw()
		if (this.speaker) this.speaker.draw()
	}
}

export default Scene
