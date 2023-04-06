import player from "../game/player"
import music from "../game/music"
import c from "../game/canvas"

import MenuOption from "../menus/MenuOption"
import Scene from "../menus/Scene"
import dialogue from "../events/7"
import password from "../events/password"

import Block from "./Block"
import Interactable from "./Interactable"

// Width of the wall
// I'm going to hardcode it because I don't think it /has/ to be c.s/2
const w = 25

// Door gap
const gap = 200 

const wallColour = "#c3272b"
const walls = [
	// Initial room after entering from Lerwick
	// Includes Claudius and door to room 1
	[
		new Block(0, 0, c.w, w, wallColour),
		new Block(0, c.h-w, c.w, w, wallColour),

		new Block(0, 0, w, (c.h-gap)/2, wallColour),
		new Block(0, (c.h-gap)/2 + gap, w, (c.h-gap)/2, wallColour),

		new Block(c.w - w, 0, w, (c.h-gap)/2, wallColour),
		new Block(c.w - w, (c.h-gap)/2 + gap, w, (c.h-gap)/2, wallColour)
	],

	// To the right of room 0
	// Includes Tiberius - is the center room that touches all other rooms
	[
		// Right opening
		// Needs to be drawn first so it's behind the other walls
		new Block(c.w - w, 0, w, (c.h-gap)/2, "#8db255"),
		new Block(c.w - w, (c.h-gap)/2 + gap, w, (c.h-gap)/2, "#8db255"),

		// Top opening
		new Block(0, 0, (c.w-gap)/2, w, wallColour),
		new Block((c.w-gap)/2 + gap, 0, (c.w-gap)/2, w, wallColour),

		// Bottom opening
		new Block(0, c.h - w, (c.w-gap)/2, w, wallColour),
		new Block((c.w-gap)/2 + gap, c.h - w, (c.w-gap)/2, w, wallColour),

		// Left opening
		new Block(0, 0, w, (c.h-gap)/2, wallColour),
		new Block(0, (c.h-gap)/2 + gap, w, (c.h-gap)/2, wallColour)
	],

	// The room which is above room 1
	[
		new Block(0, 0, c.w, w, wallColour),
		new Block(0, 0, w, c.h, wallColour),
		new Block(c.w - w, 0, w, c.h, wallColour),

		// Bottom opening
		new Block(0, c.h - w, (c.w-gap)/2, w, wallColour),
		new Block((c.w-gap)/2 + gap, c.h - w, (c.w-gap)/2, w, wallColour)
	],

	// The room which is below room 1
	[
		new Block(0, c.h - w, c.w, w, wallColour),
		new Block(0, 0, w, c.h, wallColour),
		new Block(c.w - w, 0, w, c.h, wallColour),

		// Top opening
		new Block(0, 0, (c.w-gap)/2, w, wallColour),
		new Block((c.w-gap)/2 + gap, 0, (c.w-gap)/2, w, wallColour)
	],
]

const claudius = new Interactable("Claudius", new Block(200, 600, c.s, c.s, "#1d697c"))
const tiberius = new Interactable("Tiberius", new Block(1000, 600, c.s, c.s, "#48929b"))

let scene = new Scene(dialogue.Claudius)
scene.playing = false

let prompt = {
	int: claudius,
	active: false,
	box: new MenuOption("=================================================", 0, 0)
}

class House {
	room = 0
	collisions = []

	init() {
		c.bgWhite()

		document.onkeydown = event => {
			let code = event.code

			if (scene.playing && code == "KeyZ")
				scene.progress()

			else if (code == "KeyX" && prompt.active) {
				prompt.active = false

				// Set the dialogue option based on the password
				let speech: string

				if (prompt.int.id == "Claudius") speech = "Claudius"

				// The right password was not entered
				else if (!password.peanuts) speech = "TiberiusBase"

				// The right password was entered, and this is the first time
				// Claudia speaks to Tiberius
				else if (!password.timeMachine) {
					speech = "TiberiusTransact"
					password.timeMachine = true
				}

				// The right password was entered and Claudia already recevied
				// the time machine from Tiberius
				else speech = "TiberiusAftermath"

				scene = new Scene(dialogue[speech])
			}

			else if (!scene.playing)
				player.handleKey("keydown", code)
		}

		document.onkeyup = event => {
			player.handleKey("keyup", event.code)
		}

		this.genCollisions()
	}

	genCollisions() {
		let room = this.room
		this.collisions = walls[room]

		if (room == 0) this.collisions.push(claudius.obj)
		if (room == 1) this.collisions.push(tiberius.obj)
	}

	transitions(): string | null {
		let oldRoom = this.room

		if (this.room == 0 && player.x < 0)
			return "Lerwick"

		else if (this.room == 1 && player.x > c.w - c.s)
			return "AugustusRoom"

		else if (this.room == 0 && player.x > c.w - c.s) {
			player.x = 0
			this.room = 1
		}

		else if (this.room == 1 && player.x < 0) {
			player.x = c.w - c.s
			this.room = 0
		}

		else if (this.room == 1 && player.y < 0) {
			player.y = c.h - c.s
			this.room = 2
		}

		else if (this.room == 3 && player.y < 0) {
			player.y = c.h - c.s
			this.room = 1
		}

		else if (this.room == 2 && player.y > c.h - c.s) {
			player.y = 0
			this.room = 1
		}

		else if (this.room == 1 && player.y > c.h - c.s) {
			player.y = 0
			this.room = 3
		}

		// We switched rooms
		if (this.room != oldRoom) this.genCollisions()

		// The location transition conditions failed, so we're not changing
		return null
	}

	move(time: number) {
		if (!scene.playing) player.move(time, "fixed", this.collisions)
	}

	draw() {
		// Floor
		c.fillStyle = "#dba97d"
		c.frect(0, 0, c.w, c.h)

		// Black entrance floor to Augustus's room
		if (this.room == 1) {
			c.fillStyle = "#000"
			c.frect(c.w - w/2, (c.h-gap)/2, w/2, gap)
		}

		for (const obj of this.collisions) {
			obj.draw()
		}

		// Math password hints
		if (this.room == 2) {
			c.font = "30px serif"
			c.fillStyle = "#111"
			c.text("How many numbers greater than 100 but less than 1000", 200, 100)
			c.text("are multiples of 10 but not of 6 or 13?", 200, 150)
			c.text("Call the answer 'a'.", 200, 250)

			/*
			(If you haven't tried it yourself, you shouldn't be reading this,
			unless you're so comfortable with counting that you think it would
			be redundant practice)

			My thought process for solving it:

			">100" and "<1000" means our range is 101-999.
			The word "multiple" means that we only consider integers.

			We should find the number of multiples of 10, multiples of 10 and 6,
			multiples of 10 and 13, and multiples of 10 and 6 and 13. Then,
			subtract the multiples of 10 and 6 and the multiples of 10 and 13
			but add the multiples of 10 and 6 and 13, because they would have
			been subtracted twice.

			Multiples of 10:
				110, 120, 130, ..., 980, 990
				--> 11, 12, 13, ..., 98, 99
				--> 1, 2, 3, ..., 88, 89
				= 89 multiples of 10
				(Applying these operations to each number in the set doesn't
				change the length)

			Multiples of 10 and 6:
				10 = 2 * 5
				6 = 2 * 3
				So, we're loooking for multiples of 2 * 3 * 5 = 30

				101 / 30 = 3.366...
				3 * 30 = 90
				4 * 30 = 120

				999 / 30 = 33.3
				33 * 30 = 990

				--> 120, 150, 180, ..., 960, 990
				--> 4, 5, 6, ..., 32, 33
				--> 1, 2, 3, ..., 29, 30
				= 30 multiples of 10 and 6

			Multiples of 10 and 13:
				13 is prime, so we're only looking at multiples of 10 * 13 = 130
				130 * 1 = 130
				999 / 130 = 7.68...

				Our lower bound is 1 and our upper bound is 7, so we already
				know there are 7 multiples of 10 and 13

			Multiples of 10 and 6 and 13:
				We just look at multiples of 13 * 30 = 390
				390 * 1 = 390
				390 * 2 = 780
				390 * 3 = 1170
				= 2 multiples of 10, 6, and 13

				We counted 390 and 780 twice earlier, so we subtract 2

			Final answer:
				89 - 30 - 7 + 2
				= 54

				Therefore, there are 54 numbers greater than 100 and less than
				1000 that are multiples of 10 but not of 6 or 13
			*/
		}

		else if (this.room == 3) {
			c.font = "30px serif"
			c.fillStyle = "#111"
			c.text("What is the value of the sum 52.5 + 53 + 53.5 + ... + 144.5 + 145?", 200, 550)
			c.text("Call the answer 'c'.", 200, 600)

			/*
			(Again: If you haven't tried it yourself, you shouldn't be reading this,
			unless you're so comfortable with counting that you think it would
			be redundant practice)

			My thought process for solving it:

			The .5s are sort of annoying, so I'd find it simpler to first factor
			them out.
			52.5 + 53 + ... + 144.5 + 155
			= 0.5(105) + 0.5(106) + ... + 0.5(289) + 0.5(290)
			= 0.5(105 + 106 + ... + 289 + 290)

			Let's say that x = 105 + 106 + ... + 289 + 290, so our answer would be
			0.5x = x/2. (This is for organization, again.)

			Then, what if we re-arrange the terms to clump opposites together?
			1 + 2 + 3 + 4 --> (1 + 4) + (2 + 3)

			x = 105 + 106 + ... + 289 + 290
			= (105 + 290) + (106 + 289) + ...?

			Each of these are going to sum to 395.
			395 / 2 is 197.5, so our inner-most pair would be 197 + 198.
			To confirm, |105 - 197| = 92 = |290 - 198|.

			We have the (105 + ...), (106 + ...), ... pairs up to (197 + 198)
			The set of first terms in each pair is {105, 106, ..., 196, 197}
			--> {1, 2, ..., 92, 93}
			Meaning that there are 93 first terms and hence 93 pairs

			Since each pair sums to 395, the total sum is 93 * 395 = 36735 = x.
			Our answer is x/2 (from earlier), which is 18367.5.
			*/
		}

		player.draw("fixed")

		if (!scene.playing && (this.room == 0 || this.room == 1)) {
			// int: Interactable
			const int = this.room == 0 ? claudius : tiberius

			if (int.inRange()) {
				// Create a prompt box if it hasn't been set
				if (!prompt.active)
					prompt.box = new MenuOption("Press X to interact.", int.obj.x - 60, int.obj.y - 60)

				prompt.int = int
				prompt.active = true
			}
			else prompt.active = false
		}

		if (prompt.active) prompt.box.show(false)
		scene.draw()
	}
}

const house = new House()
export default house
