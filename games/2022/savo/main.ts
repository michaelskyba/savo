const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

const mainMenu = {
	x: 0,

	draw() {
		ctx.fillStyle = "#2c8898"
		ctx.fillRect(0, 0, 1325, 725)

		ctx.font = "48px monospace"
		ctx.fillStyle = "#000000"
		ctx.fillText("Malfacile Gajnita Savo", this.x, 50)

		this.x++

		window.requestAnimationFrame(this.draw)
	}
}
mainMenu.draw = mainMenu.draw.bind(mainMenu)

window.requestAnimationFrame(mainMenu.draw)
