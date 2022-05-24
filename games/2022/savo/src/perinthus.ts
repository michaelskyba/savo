import c from "./canvas"
import player from "./player"

const perinthus = {
	draw() {
		// Background (temporary)
		c.fillStyle = "green"
		c.frect(0, 0, 1325, 725)
		c.fillStyle = "purple"
		c.frect(0, 0, 500, 500)
		c.frect(500, 500, 825, 225)

		player.draw("overworld")

		window.requestAnimationFrame(this.draw)
	}
}

// It's better to bind it outside of the requestAnimationFrame call so that a
// new binding doesn't have to be created every frame
perinthus.draw = perinthus.draw.bind(perinthus.draw)

export default perinthus
