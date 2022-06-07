import c from "../game/canvas"
import player from "../game/player"
import Wall from "./Wall"

let wallColour = "maroon"
let walls = [
	new Wall(0, 0, 1325, 25, wallColour),
	new Wall(0, 0, 25, 1325, wallColour),

	// Bottom with intersection
	new Wall(0, 700, 512.5, 25, wallColour),
	new Wall(812.5, 700, 612.5, 25, wallColour),

	// Initially solid right wall
	new Wall(1300, 0, 25, 725, wallColour)
]

const neroHouse = {
	init() {
		document.onkeydown = event => player.handleKey("keydown", event.code)
		document.onkeyup = event => player.handleKey("keyup", event.code)
	},

	draw() {
		// Background: floor
		c.fillStyle = "#fcc9b9"
		c.frect(0, 0, 1325, 725)

		player.draw("fixed")

		for (const wall of walls) {
			wall.draw()
		}
	}
}

export default neroHouse
