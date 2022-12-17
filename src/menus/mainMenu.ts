import c from "../game/canvas"
import MenuOption from "./MenuOption"
import claudiaHouse from "../fixed/claudiaHouse"

import steps from "../game/steps"
import music from "../game/music"
import { RNG } from "../util/functions"

import password from "../events/password"

class Particle {
	id: number
	active = true

	x: number
	y: number
	size: number
	speed: number

	constructor(id: number) {
		this.id = id

		this.speed = RNG(1, 5)
		this.size = RNG(25, 100)

		this.x = c.w
		this.y = RNG(0 - this.size, c.h)
	}

	draw() {
		// I can't be bothered to implement a timing system: the movement speed is
		// just decorative, so having it vary by frame rate is probably OK

		// The split line is at x = 500

		this.x -= this.speed

		// It's a special case: the particle is on the line
		if (this.x > 500 - this.size && this.x < 500) {
			let split1 = 500 - this.x

			c.fillStyle = "maroon"
			c.frect(this.x, this.y, split1, this.size)
			c.fillStyle = "#111"
			c.frect(this.x + split1, this.y, this.size - split1, this.size)

			// Slower movement during the split
			this.x += this.speed / 2

			return
		}

		// The particle isn't on the line, so we can draw a standard rectangle
		if (this.x >= 500)
			c.fillStyle = "#111"
		else
			c.fillStyle = "maroon"

		c.frect(this.x, this.y, this.size, this.size)
	}
}

let particles = []
let lastSpawn = 0
let lastID = -1

const mainMenu = {
	selected: 0,
	screen: "Controls",

	options: [
		new MenuOption("Start", 150, 200),
		new MenuOption("Controls", 150, 260),
		new MenuOption("Credits", 150, 320),
		new MenuOption("Source code", 150, 380),
		new MenuOption("Home", 150, 440),
		new MenuOption("Password", 150, 500),
	],

	init() {
		document.onkeydown = e => this.handleInput(e.code)
		music.class_trial.play()
	},

	handleInput(key: string) {
		// Option hovering
		if ((key == "ArrowUp" || key == "KeyK") && this.selected > 0)
			this.selected--
		if ((key == "ArrowDown" || key == "KeyJ") && this.selected < 5)
			this.selected++

		// Select option
		if (key == "KeyZ") {
			switch(this.selected) {
				// You pressed start, so enter the claudiaHouse object
				// steps.ts will react to the "screen" property
				case 0:
					this.screen = "Claudia's house"
					break

				case 1:
					this.screen = "Controls"
					break

				case 2:
					this.screen = "Credits"
					break

				// "Source code" button
				case 3:
					window.open("https://github.com/michaelskyba/savo", "_blank").focus()
					break

				// "Home" button
				case 4:
					window.location.href = "../../games/2022/index.html"
					break

				// "Password" button
				case 5:
					let code = prompt("Enter your code.")

					/*
					If you're reading this, there's a high probability that
					you're cheating. If that's the case, you should feel
					immensely ashamed of yourself. You're ruining the puzzle.
					*/

					switch(code) {
						case "11037":
							alert("Wait... useless!? (But no)")
							break

						case "#@abc$&":
							alert("[Claudius]\nI already said that it's not the literal string, idiot.")
							break

						case "#@549.918367.5$&":
							alert("[Claudius]\nYou misunderstood the format! How can you be so competent and incompetent at the same time?")
							break

						case "#@9819265.5$&":
							alert("Correct! You have now obtained a pack of 𝗽𝗲𝗮𝗻𝘂𝘁𝘀.")
							password.peanuts = true
							break

						default:
							alert("[Claudius]\nNo...? Think about it more before making such awful guesses.")
							break
					}
			}

		}
	},

	draw() {
		// Background
		c.fillStyle = "white"
		c.frect(0, 0, 500, c.h)
		c.fillStyle = "maroon"
		c.frect(500, 0, c.w-500, c.h)

		// Background particles spawning
		let time = Date.now()
		if (time - lastSpawn > 400) {
			lastID++
			particles.push(new Particle(lastID))

			lastSpawn = time
		}

		// Background particles drawing
		for (const particle of particles) {
			particle.draw()
		}

		// Background particles deletion
		particles = particles.filter(particle => particle.x > -particle.size)

		// Main title text
		c.font = "48px serif"
		c.fillStyle = "white"
		c.text("Malfacile", 770, 100)
		c.fillStyle = "#ddd"
		c.text("Gajnita Savo", 770, 150)
		c.fillStyle = "white"
		c.font = "20px serif"
		c.text("by Michael Skyba", 770, 250)

		// Divider
		c.fillStyle = "white"
		c.frect(650, 300, 525, 3)

		// Section title
		if (this.screen != "Claudia's house") {
			c.fillStyle = "white"
			c.font = "48px serif"
			c.text(this.screen, 770, 400)
			c.font = "20px serif"
		}

		if (this.screen == "Controls") {
			c.text("- Use arrow keys for player and UI movement", 700, 450)
			c.text("- Use Z for UI selection, including dialogue progression", 700, 480)
			c.text("- Use Backspace to pause the game", 700, 510)
			c.text("- Other keys (for combat) will be introduced later, in-game", 700, 540)
		}

		else if (this.screen == "Credits") {
			c.text("- I, Michael, did the development", 700, 450)
			c.text("- The music was stolen from Masafumi Takada", 700, 480)
			c.text("- ImageMagick was used to generate (image) assets", 700, 510)
			c.text("- TypeScript was used as the general programming language", 700, 540)
			c.text("- rollup.js was used to bundle the JavaScript", 700, 570)
			c.text("- Kakoune was used as the code editor", 700, 600)
			c.text("- GitHub is used for hosting the source code and production build", 700, 630)
			c.text("- Arch Linux was used as the development operating system", 700, 660)
		}

		for (let i = 0; i < this.options.length; i++) {
			this.options[i].show(this.selected == i)
		}
	}
}

mainMenu.init = mainMenu.init.bind(mainMenu)
mainMenu.draw = mainMenu.draw.bind(mainMenu)
mainMenu.handleInput = mainMenu.handleInput.bind(mainMenu)

export default mainMenu
