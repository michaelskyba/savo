import c from "./canvas"

import Life from "../combat/Life"
import Cooldown from "../combat/Cooldown"

// We need to convert to JSON and back so that JS clones by value instead of by
// reference
function deepClone(obj: any) {
	return JSON.parse(JSON.stringify(obj))
}

const defaultKeys = {
	left : false,
	right: false,
	up   : false,
	down : false,
	shift: false
}

let cooldowns = ["damage", "heal", "dodge", "action"]

class HealCooldown extends Cooldown {
	constructor() {
		// We need it to decrease by 725 in 1s
		// So, that's 725/1000 = 0.725 per millisecond
		super(c.w/4, c.w/4, "#ffff00", 0.725)
	}

	progress(time: number) {
		if (this.counter < 1) return

		super.progress(time)

		if (this.counter < 1) player.life.heal()
	}
}

const player = {
	x: 200,
	y: 200,

	life: new Life(99, 5, 5),
	status: "prepared",

	// Used for timing movement
	lastMove: 0,

	cooldowns: {
		// We need it to decrease by 725 in 0.5s
		// So, that's (725/0.5)/1000 = 1.45 per millisecond
		damage: new Cooldown(0, c.w/4, "#ff0000", 1.45),

		heal: new HealCooldown(),

		// Same as damage: 725p/0.5s --> 1.45
		dodge: new Cooldown(c.w/2, c.w/4, "#00ffff", 1.45),

		// Same as healing: 725p/s --> 0.725
		action: new Cooldown(c.w * 3/4, c.w/4, "#0000ff", 0.725)
	},

	keyPressed: deepClone(defaultKeys),
	resetInput() {
		this.keyPressed = deepClone(defaultKeys)
	},

	attack() {
		if (this.cooldowns.action.counter > 1) return

		this.cooldowns.action.start()

		// Only hit if the player is in range of the enemy
		if (this.status == "prepared")
			this.status = "attacking"

		// We have to use this status = "attacking" system so that the level can
		// compare states and administer damage. Trying to create damage in here
		// would require many imports as the number of possible enemies grows
		// and create dependency circles.
	},

	heal() {
		let cooldowns = this.cooldowns

		// The actual heal will trigger once the cooldown ends
		if (cooldowns.heal.counter < 1 &&
			cooldowns.action.counter < 1 &&
			this.life.threatened == true) {

			cooldowns.heal.start()
			cooldowns.action.start()
		}
	},

	dodge() {
		if (this.cooldowns.action.counter < 1) {
			this.cooldowns.action.start()
			this.cooldowns.dodge.start()
		}
	},

	fixedKeys(input: string) {
		if (input == "KeyZ") this.dodge()
		if (input == "KeyX") this.attack()
		if (input == "KeyC") this.heal()
	},

	// Used as both onkeydown and onkeyup (specify with inputType)
	// Sets this.keyPressed accordingly according to keys pressed and released
	handleKey(inputType: string, input: string) {
		let keys = {
			"ArrowLeft" : "left",
			"ArrowRight": "right",
			"ArrowUp"   : "up",
			"ArrowDown" : "down",
			"ShiftLeft" : "shift"
		}

		let key = keys[input]
		if (key) this.keyPressed[key] = inputType == "keydown"
	},

	move(time: number, mode: "fixed" | "overworld", collisions) {
		/*
		Player movement, like enemy movement, has to be time-based. Otherwise,
		somebody with a high refresh rate would move far too quickly. Mine, which
		the game is based on, is ~60, so we can use 1000/60 ~= 16 as the ms
		threshold.
		*/
		if (time - this.lastMove < 16) return
		else this.lastMove = time

		let speed = 8
		if (this.keyPressed.shift) speed = speed / 2
		if (this.cooldowns.heal.counter > 0) speed = speed / 2

		if (this.keyPressed.left ) this.x -= speed
		if (this.keyPressed.right) this.x += speed
		if (this.keyPressed.up   ) this.y -= speed
		if (this.keyPressed.down ) this.y += speed

		// Correct collisions

		for (const collision of collisions) {
			let colX = collision.x
			let colY = collision.y

			// We can't check for overworld once at the start because we would
			// have to modify the collisions array (or a copy), both of which
			// change it for perinthus.ts. I'm guessing that
			// Object.assign([], myArray) is even slower than this, though.

			// Correct for overworld display shifting
			if (mode == "overworld") {
				colX -= c.w/2 - c.s/2
				colY -= c.h/2 - c.s/2
			}

			if (this.x + c.s > colX &&
				this.x < colX + collision.width &&
				this.y + c.s > colY &&
				this.y < colY + collision.height) {

				// The way we correct the position depends on how the player collided

				// We have to make sure that the previous value did NOT satisfy
				// the collision so that we know how to handle it - otherwise we
				// might see "the player pressed left and up, and now they've collided"
				// and won't know which one it was

				if (this.keyPressed.left &&
					this.x + speed >= colX + collision.width)
					this.x = colX + collision.width

				if (this.keyPressed.right &&
					this.x - speed + c.s <= colX)
					this.x = colX - c.s

				if (this.keyPressed.up &&
					this.y + speed >= colY + collision.height)
					this.y = colY + collision.height

				if (this.keyPressed.down &&
					this.y - speed + c.s <= colY)
					this.y = colY - c.s
			}
		}
	},

	draw(mode: "fixed" | "overworld") {
		c.fillStyle = "maroon"

		if (mode == "fixed")
			c.frect(this.x, this.y, c.s, c.s)

		// Centered
		else c.frect(c.w/2 - c.s/2, c.h/2 - c.s/2, c.s, c.s)
	},

	// Player attack range
	drawRange(enemyX, enemyY) {
		let range = 100
		let width = c.s
		let widthOffset = width/2

		if (enemyX + width > this.x + widthOffset - range &&
			enemyY + width > this.y + widthOffset - range &&
			enemyX < this.x + widthOffset + range &&
			enemyY < this.y + widthOffset + range &&
			this.cooldowns.action.counter < 1) {

			if (this.status == "default") this.status = "prepared"

			c.globalAlpha = 0.3
			c.fillStyle = "maroon"

			let offset = widthOffset - range
			c.frect(this.x + offset, this.y + offset, range * 2, range * 2)

			c.globalAlpha = 1
		}
		else this.status = "default"
	},

	receiveDamage() {
		// Quit if invincible
		if (this.cooldowns.damage.counter > 0 ||
			this.cooldowns.dodge.counter > 0) return

		// You were already threatened before being hit, so you die instantly
		if (this.life.threatened) {
			this.life.hp = 0
			return
		}

		this.life.hit()
		this.cooldowns.damage.start()
	},

	drawCooldowns() {
		for (const cooldown of cooldowns) {
			this.cooldowns[cooldown].draw()
		}
	},

	resetCooldowns() {
		for (const cooldown of cooldowns) {
			this.cooldowns[cooldown].counter = 0
		}
	},

	progressCooldowns(time: number) {
		for (const cooldown of cooldowns) {
			this.cooldowns[cooldown].progress(time)
		}
	}
}

// Have damage and dodge cooldowns go backwards
const getY = (counter: number) => c.h - counter
player.cooldowns.damage.getY = getY
player.cooldowns.dodge.getY = getY

export default player
