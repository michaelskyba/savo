import player from "../game/player"
import c from "../game/canvas"
import Block from "./Block"

import music from "../game/music"
import augustus from "../combat/augustus"

import dialogue from "../events/8"
import Scene from "../menus/Scene"

let scene = new Scene(dialogue[0])

const wallColour = "#8db255"
const openWalls = [
	new Block(0, 0, 1325, 25, wallColour),
	new Block(0, 700, 1325, 25, wallColour),

	new Block(0, 0, 25, 262.5, wallColour),
	new Block(0, 462.5, 25, 262.5, wallColour),

	new Block(1300, 0, 25, 725, wallColour)
]
const closedWalls  = [
	new Block(0, 0, 1325, 25, wallColour),
	new Block(0, 700, 1325, 25, wallColour),
	new Block(0, 0, 25, 725, wallColour),
	new Block(1300, 0, 25, 725, wallColour)
]
let walls = openWalls

class Room {
	status = "dialogue_0"

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

		document.onkeydown = this.inputInit

		// Stop the trailing movement from the previous screen
		if (scene.playing) player.resetInput()

		document.onkeyup = event => {
			player.handleKey("keyup", event.code)
		}
	}

	inputInit(event: KeyboardEvent) {
		let code = event.code

		if (scene.playing && code == "KeyZ") {
			scene.progress()

			if (!scene.playing) {
				if (this.status == "dialogue_0")
					this.status = "waiting"

				// i.e. this.status == "dialogue_1"
				else {
					this.status = "fighting"
					document.onkeydown = this.inputFight

					player.life.hp = 10
					player.life.threatened = false

					music.reset()
					music.climax_reasoning.play()

					walls = closedWalls
					this.collisions = [...walls, {
						x: augustus.x,
						y: augustus.y,
						width: 50,
						height: 50
					}]
				}
			}
		}

		else if (!scene.playing)
			player.handleKey("keydown", code)
	}

	inputFight(event: KeyboardEvent) {
		let code = event.code
		player.handleKey("keydown", code)
		player.fixedKeys(code)
	}

	move(time: number) {
		if (this.status == "waiting") {
			player.move(time, "fixed", this.collisions)

			// Set the starting time
			if (!scene.playing && this.initTime == 0)
				this.initTime = time

			this.time = time - this.initTime
			if (this.time >= 180000) {
				this.status = "dialogue_1"

				scene = new Scene(dialogue[1])
			}
		}

		// Augustus fight started
		else if (this.status == "fighting") {
			player.progressCooldowns(time)

			augustus.move()
			this.collisions[4].x = augustus.x
			this.collisions[4].y = augustus.y

			player.move(time, "fixed", this.collisions)

			if (player.status == "attacking")
				augustus.receiveDamage()
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
		let time = `${3-minutes}:${padding}${60-seconds}`

		c.fillStyle = "#eee"
		c.font = "40px serif"
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

		if (this.status == "fighting") {
			player.drawRange(augustus.x, augustus.y)
			player.drawCooldowns()

			augustus.life.draw()
			player.life.draw()
		}

		scene.draw()
	}
}

const room = new Room()
room.inputInit = room.inputInit.bind(room)
room.inputFight = room.inputFight.bind(room)

export default room
