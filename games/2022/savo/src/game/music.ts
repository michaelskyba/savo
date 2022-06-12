const music = {
	class_trial: document.getElementById("class_trial") as HTMLAudioElement,
	beautiful_ruin: document.getElementById("beautiful_ruin") as HTMLAudioElement,
	summer_salt: document.getElementById("summer_salt") as HTMLAudioElement,
	box_15: document.getElementById("box_15") as HTMLAudioElement,
	beautiful_dead: document.getElementById("beautiful_dead") as HTMLAudioElement,

	reset() {
		Object.keys(music).forEach(name => {
			if (name == "reset") return

			let track = music[name]
			track.currentTime = 0
			if (!track.paused) track.pause()
		})
	}
}

// Make all tracks loop
Object.keys(music).forEach(
	name => music[name].loop = true
)

export default music
