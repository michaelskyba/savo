import player from "../game/player"
import c from "../game/canvas"
import Block from "./Block"

import music from "../game/music"
import augustus from "../combat/augustus"

import dialogue from "../events/8"
import Scene from "../menus/Scene"
import password from "../events/password"

let scene = new Scene(dialogue[0])

// Wall width and door gap
const w = 25
const gap = 200

const wallColour = "#8db255"
const openWalls = [
	new Block(0, 0, c.w, w, wallColour),
	new Block(0, c.h - w, c.w, w, wallColour),

	new Block(0, 0, w, (c.h-gap)/2, wallColour),
	new Block(0, (c.h-gap)/2 + gap, w, (c.h-gap)/2, wallColour),

	new Block(c.w - w, 0, w, c.h, wallColour)
]
const closedWalls  = [
	new Block(0, 0, c.w, w, wallColour),
	new Block(0, c.h - w, c.w, w, wallColour),
	new Block(0, 0, w, c.h, wallColour),
	new Block(c.w - w, 0, w, c.h, wallColour)
]
let walls = openWalls

class Room {
	status = "dialogue_0"
	gameState = "playing"

	// The timestamp of the timer starting
	initTime = 0

	// How many ms have passed since the timer started
	time = 0

	init() {
		player.x = 30

		document.onkeydown = this.inputInit

		// Stop the trailing movement from the previous screen
		if (scene.playing) player.resetInput()

		document.onkeyup = event => {
			player.handleKey("keyup", event.code)
		}
	}

	fightInit() {
		this.status = "fighting"
		document.onkeydown = this.inputFight

		player.life.hp = 10
		player.life.threatened = false

		music.reset()
		music.climax_reasoning.play()

		walls = closedWalls

		// In case the player thinks that they're smart
		if (player.x < w) player.x = w
	}

	inputInit(event: KeyboardEvent) {
		let code = event.code

		if (scene.playing && code == "KeyZ") {
			scene.progress()

			if (!scene.playing) {
				if (this.status == "dialogue_0")
					this.status = "waiting"

				// i.e. this.status == "dialogue_1"
				else this.fightInit()
			}
		}
		else if (scene.playing) return

		// Skip wait if you have the time machine
		else if (code == "Space" && password.timeMachine)
			this.initTime = -180000

		else player.handleKey("keydown", code)
	}

	inputFight(event: KeyboardEvent) {
		let code = event.code
		player.handleKey("keydown", code)
		player.fixedKeys(code)
	}

	move(time: number) {
		if (this.status == "waiting") {
			player.move(time, "fixed", walls)

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

			augustus.move(time)
			player.move(time, "fixed", walls)

			if (player.status == "attacking")
				augustus.receiveDamage()

			// Have the player take damage if Augustus hits (sword) or overlaps
			if (augustus.collision(player.x, player.y)) {
				player.receiveDamage()

				// Tell steps.ts to render the lose screen
				if (player.life.hp < 1) this.gameState = "lose"
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
		let time = `${3-minutes}:${padding}${60-seconds}`

		c.fillStyle = "#eee"
		c.font = "40px serif"
		c.text(time, 100, 100)
	}

	draw() {
		c.fillStyle = "#000"
		c.frect(0, 0, c.w, c.h)

		if (this.status == "waiting") {
			this.drawTimer()

			if (password.timeMachine)
				c.text("Press 𝗦𝗽𝗮𝗰𝗲 to use your time machine.", 100, 625)
		}

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
