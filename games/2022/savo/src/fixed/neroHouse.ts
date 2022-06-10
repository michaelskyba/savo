import c from "../game/canvas"
import player from "../game/player"
import Wall from "./Wall"

let wallColour = "maroon"
let walls = [
	// First room
	[
		new Wall(0, 0, 1325, 25, wallColour),
		new Wall(0, 0, 25, 1325, wallColour),

		// Bottom intersection
		new Wall(0, 700, 512.5, 25, wallColour),
		new Wall(812.5, 700, 612.5, 25, wallColour),

		// Right intersection
		new Wall(1300, 0, 25, 212.5, wallColour),
		new Wall(1300, 512.5, 25, 212.5, wallColour)
	],

	// Second room - entered through the right of first room
	[
		new Wall(0, 700, 1325, 25, wallColour),

		// Left intersection
		new Wall(0, 0, 25, 212.5, wallColour),
		new Wall(0, 512.5, 25, 212.5, wallColour),

		// Top intersection
		new Wall(0, 0, 512.5, 25, wallColour),
		new Wall(812.5, 0, 612.5, 25, wallColour),

		new Wall(1300, 0, 25, 725, wallColour)
	],

	// Third room - entered through the top of second room
	[
		new Wall(0, 0, 1325, 25, wallColour),

		// Left intersection
		new Wall(0, 0, 25, 212.5, wallColour),
		new Wall(0, 512.5, 25, 212.5, wallColour),

		// Bottom intersection
		new Wall(0, 700, 512.5, 25, wallColour),
		new Wall(812.5, 700, 612.5, 25, wallColour),

		new Wall(1300, 0, 25, 725, wallColour)
	],

	// Fourth room - entered through the left of third room
	[
		new Wall(0, 0, 25, 1325, wallColour),
		new Wall(0, 0, 1325, 25, wallColour),

		// Right intersection
		new Wall(1300, 0, 25, 212.5, wallColour),
		new Wall(1300, 512.5, 25, 212.5, wallColour),

		// Bottom intersection
		new Wall(0, 700, 512.5, 25, wallColour),
		new Wall(812.5, 700, 612.5, 25, wallColour),
	],

	// Fifth (Nero's) room - entered through the bottom of the fourth room
	[
		new Wall(0, 0, 25, 725, wallColour),
		new Wall(0, 700, 1325, 25, wallColour),
		new Wall(1300, 0, 25, 725, wallColour),

		// Top intersection
		new Wall(0, 0, 512.5, 25, wallColour),
		new Wall(812.5, 0, 612.5, 25, wallColour),
	],

	// (Nero's) room - locked
	[
		new Wall(0, 0, 1325, 25, wallColour),
		new Wall(0, 0, 25, 1325, wallColour),
		new Wall(1300, 0, 25, 725, wallColour),
		new Wall(0, 700, 1325, 25, wallColour)
	]
]

const neroHouse = {
	room: 0,

	init() {
		document.onkeydown = event => player.handleKey("keydown", event.code)
		document.onkeyup = event => player.handleKey("keyup", event.code)
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

	move() {
		player.move("fixed", walls[this.room])
		this.roomTransitions()
	},

	draw() {
		// Background: floor
		c.fillStyle = "#fcc9b9"
		c.frect(0, 0, 1325, 725)

		player.draw("fixed")

		for (const wall of walls[this.room]) {
			wall.draw()
		}
	}
}

export default neroHouse
