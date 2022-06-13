import c from "../game/canvas"
import Block from "./Block"

import music from "../game/music"

import player from "../game/player"
import Nero from "../combat/Nero"

const nero = new Nero()

let wallColour = "maroon"
let walls = [
	// First room
	[
		new Block(0, 0, 1325, 25, wallColour),
		new Block(0, 0, 25, 1325, wallColour),

		// Bottom intersection
		new Block(0, 700, 512.5, 25, wallColour),
		new Block(812.5, 700, 612.5, 25, wallColour),

		// Right intersection
		new Block(1300, 0, 25, 212.5, wallColour),
		new Block(1300, 512.5, 25, 212.5, wallColour)
	],

	// Second room - entered through the right of first room
	[
		new Block(0, 700, 1325, 25, wallColour),

		// Left intersection
		new Block(0, 0, 25, 212.5, wallColour),
		new Block(0, 512.5, 25, 212.5, wallColour),

		// Top intersection
		new Block(0, 0, 512.5, 25, wallColour),
		new Block(812.5, 0, 612.5, 25, wallColour),

		new Block(1300, 0, 25, 725, wallColour)
	],

	// Third room - entered through the top of second room
	[
		new Block(0, 0, 1325, 25, wallColour),

		// Left intersection
		new Block(0, 0, 25, 212.5, wallColour),
		new Block(0, 512.5, 25, 212.5, wallColour),

		// Bottom intersection
		new Block(0, 700, 512.5, 25, wallColour),
		new Block(812.5, 700, 612.5, 25, wallColour),

		new Block(1300, 0, 25, 725, wallColour)
	],

	// Fourth room - entered through the left of third room
	[
		new Block(0, 0, 25, 1325, wallColour),
		new Block(0, 0, 1325, 25, wallColour),

		// Right intersection
		new Block(1300, 0, 25, 212.5, wallColour),
		new Block(1300, 512.5, 25, 212.5, wallColour),

		// Bottom intersection
		new Block(0, 700, 512.5, 25, wallColour),
		new Block(812.5, 700, 612.5, 25, wallColour),
	],

	// Fifth (Nero's) room - entered through the bottom of the fourth room
	[
		new Block(0, 0, 25, 725, wallColour),
		new Block(0, 700, 1325, 25, wallColour),
		new Block(1300, 0, 25, 725, wallColour),

		// Top intersection
		new Block(0, 0, 512.5, 25, wallColour),
		new Block(812.5, 0, 612.5, 25, wallColour),
	],

	// (Nero's) room - locked
	[
		new Block(0, 0, 1325, 25, wallColour),
		new Block(0, 0, 25, 1325, wallColour),
		new Block(1300, 0, 25, 725, wallColour),
		new Block(0, 700, 1325, 25, wallColour)
	]
]

const neroHouse = {
	room: 0,

	init() {
		document.onkeydown = event => player.handleKey("keydown", event.code)
		document.onkeyup = event => player.handleKey("keyup", event.code)

		music.reset()
		music.box_15.play()
	},

	neroRoomInit() {
		document.onkeydown = event => {
			player.handleKey("keydown", event.code)
			player.fixedKeys(event.code)
		}
	},

	locationTransitions(): boolean {
		// Claudia left Nero's house back to Lerwick
		// 675 = canvas height - player height
		return player.y > 675 && this.room == 0
	},

	roomTransitions() {
		if (this.room == 0 && player.x > 1275) {
			this.room = 1
			player.x = 0
		}

		else if (this.room == 1 && player.x < 0) {
			this.room = 0
			player.x = 1275
		}

		else if (this.room == 1 && player.y < 0) {
			this.room = 2
			player.y = 675
		}

		else if (this.room == 2 && player.x < 0) {
			this.room = 3
			player.x = 1275
		}

		else if (this.room == 2 && player.y > 675) {
			this.room = 1
			player.y = 0
		}

		else if (this.room == 3 && player.y > 675) {
			this.room = 4
			player.y = 50
		}

		else if (this.room == 3 && player.x > 1275) {
			this.room = 2
			player.x = 0
		}

		else if (this.room == 4 && player.y < 0) {
			this.room = 3
			player.y = 675
		}
	},

	move(time: number) {
		nero.move(time)

		if (this.room == 4 || this.room == 5)
			player.move("fixed", [...walls[this.room], {
				x: nero.x,
				y: nero.y,
				width: 50,
				height: 50
			}])

		else player.move("fixed", walls[this.room])

		this.roomTransitions()

		if (this.room == 5)
			this.moveBattle(time)
	},

	moveBattle(time: number) {
		player.progressCooldowns(time)

		if (player.status == "attacking") {
			nero.receiveDamage()
		}
	},

	draw() {
		// Background: floor
		c.fillStyle = "#fcc9b9"
		c.frect(0, 0, 1325, 725)

		player.draw("fixed")

		for (const wall of walls[this.room]) {
			wall.draw()
		}

		if (this.room == 5)
			this.drawBattle()
	},

	drawBattle() {
		nero.draw()

		player.drawRange(nero.x, nero.y)
		player.drawCooldowns()

		nero.life.draw()
		player.life.draw()
	}
}

export default neroHouse
