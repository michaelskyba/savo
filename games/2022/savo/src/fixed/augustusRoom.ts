import player from "../game/player"
import c from "../game/canvas"
import Block from "./Block"

import music from "../game/music"
import augustus from "../combat/augustus"

import dialogue from "../events/8"
import Scene from "../menus/Scene"

const scene = new Scene(dialogue[0])

const wallColour = "#8db255"
const walls = [
	new Block(0, 0, 1325, 25, wallColour),
	new Block(0, 700, 1325, 25, wallColour),

	new Block(0, 0, 25, 262.5, wallColour),
	new Block(0, 462.5, 25, 262.5, wallColour),

	new Block(1300, 0, 25, 725, wallColour)
]

class Room {
	status = "dialogue"

	// The timestamp of the timer starting
	initTime = 0

	// How many ms have passed since the timer started
	time = 0

	collisions = [...walls, {
		x: augustus.x,
		y: augustus.y,
		width: 50,
		height: 50
	}]

	init() {
		player.x = 30

		// Initial waiting time
		document.onkeydown = event => {
			let code = event.code

			if (scene.playing && code == "KeyZ") {
				scene.progress()

				if (!scene.playing) this.status = "waiting"
			}

			else if (!scene.playing)
				player.handleKey("keydown", code)
		}

		// Stop the trailing movement from the previous screen
		if (scene.playing) player.resetInput()

		document.onkeyup = event => {
			player.handleKey("keyup", event.code)
		}
	}

	move(time: number) {
		player.move(time, "fixed", this.collisions)

		if (this.status == "waiting") {
			// Set the starting time
			if (!scene.playing && this.initTime == 0)
				this.initTime = time

			this.time = time - this.initTime
			if (this.time >= 180000) {
				this.status = "dialogue"
			}
		}
	}

	transitions() {
		if (player.x < 0) return "TiberiusHouse"
		else return null
	}

	drawTimer() {
		let seconds = Math.round(this.time / 1000)
		let minutes = Math.ceil(seconds / 60)
		seconds = seconds - (minutes-1) * 60

		let padding = 60 - seconds < 10 ? '0' : ''
		console.log(padding)

		let time = `${3-minutes}:${padding}${60-seconds}`

		c.fillStyle = "#fff"
		c.text(time, 100, 100)
	}

	draw() {
		c.fillStyle = "#000"
		c.frect(0, 0, 1325, 725)

		if (this.status == "waiting")
			this.drawTimer()

		for (const wall of walls) {
			wall.draw()
		}

		player.draw("fixed")
		augustus.draw()

		scene.draw()
	}
}

const room = new Room()
export default room
