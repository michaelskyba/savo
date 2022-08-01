import Img from "./Img"
import player from "../game/player"

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}

class Grass {
	x: number
	y: number

	frame: number
	img: Img

	threshold: number
	lastFrame: number
	elapsed = 0

	constructor(x: number, y: number) {
		this.threshold = RNG(500, 1000)
		this.lastFrame = Date.now()

		this.x = x
		this.y = y

		this.frame = RNG(0, 5)
		this.updateImg()
	}

	move(time: number) {
		let now = Date.now()
		this.elapsed += now - this.lastFrame

		// Progress the animation when it passes the threshold we chose
		while (this.elapsed > this.threshold) {
			this.elapsed -= this.threshold

			this.frame++
			if (this.frame > 5) this.frame = 0

			this.updateImg()
		}

		this.lastFrame = now
	}

	draw() {
		this.img.draw(player.x, player.y)
	}

	updateImg() {
		this.img = new Img("grass_" + this.frame, this.x, this.y)
	}
}

export default Grass
