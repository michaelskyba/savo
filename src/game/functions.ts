export const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}
