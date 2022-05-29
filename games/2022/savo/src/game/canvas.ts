export const canvas = document.getElementById("canvas") as HTMLCanvasElement

interface Context2 extends CanvasRenderingContext2D {
	textWidth(string): number
	text(text: string, x: number, y: number, maxWidth?: number): void
	frect(x: number, y: number, w: number, h: number): void
}

let c = canvas.getContext("2d") as Context2

// Abstractions
c.textWidth = (text: string) => c.measureText(text).width
c.text = c.fillText
c.frect = c.fillRect

export default c
