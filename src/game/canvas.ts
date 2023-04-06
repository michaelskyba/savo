const canvas = document.getElementById("canvas") as HTMLCanvasElement

canvas.width = 1325
canvas.height = 725

interface Context2 extends CanvasRenderingContext2D {
	textWidth(string): number
	text(text: string, x: number, y: number, maxWidth?: number): void
	frect(x: number, y: number, w: number, h: number): void

	bgBlack(): void
	bgWhite(): void

	// [w]idth, [h]eight, player/enemy [s]ize
	w: number
	h: number
	s: number
}

let c = canvas.getContext("2d") as Context2

// Abstractions
c.textWidth = (text: string) => c.measureText(text).width
c.text = c.fillText
c.frect = c.fillRect

c.w = canvas.width
c.h = canvas.height
c.s = 50

// The "default" is here so that people with dark mode extensions don't have
// white forced
const bgDefault = document.body.style.backgroundColor
c.bgBlack = () => {
	document.body.style.backgroundColor = "black"
}
c.bgWhite = () => {
	document.body.style.backgroundColor = bgDefault
}

export default c
