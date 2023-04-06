import c from "../game/canvas"

const gameOver = {
	neroLose() {
		c.fillStyle = "#000"
		c.frect(0, 0, c.w, c.h)

		c.font = "48px serif"
		c.fillStyle = "red"
		c.text("YOU DIED", 100, 100)

		c.font = "20px serif"
		c.fillStyle = "white"

		c.text("Nero has killed you! Are you this bad at video games?", 100, 200)
		c.text("Just log off if you're not even going to try.", 100, 230)
		c.text("Installing Linux is only for real gamers.", 100, 260)

		c.text("Press Space to reset back before the fight to try again...", 100, 350)
	},

	neroWin() {
		c.fillStyle = "#fff"
		c.frect(0, 0, c.w, c.h)
		c.fillStyle = "#000"

		c.font = "48px serif"
		c.text("You win!", 100, 100)

		c.font = "20px serif"

		c.text("You have successfully killed Nero.", 100, 300)
		c.text("But, will you be able to sucessfully burn his body and generate the Linux CD-ROM?", 100, 330)
		c.text("Will you be able to program your GPU driver?", 100, 360)

		c.text("How come the pause key (Backspace) wasn't working?", 100, 420)
		c.text("How come Frontinus said you could replay the tutorial but you actually couldn't without restarting?", 100, 450)
		c.text("Find the answer to these questions in the full version of the game!", 100, 480)

		c.text("Available now! To access, send your parents' credit card numbers to nop04824@xcoxc.com!", 100, 550)
		c.text("Don't forget the expiration date and the three numbers on the back!", 100, 580)
		c.text("I definitely won't make any bank transactions! The game is free!", 100, 610)

		c.text("(You can press Space if you want to return to the game.)", 100, 660)
	}
}

export default gameOver
