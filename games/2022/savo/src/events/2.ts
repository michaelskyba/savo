// The Akvedukto tutorial and introduction

/*
(I just have jokes from https://en.wikipedia.org/wiki/Russian_jokes
for now as a placeholder instead of dialogue)
*/

const dialogue = {
	// When Claudia first comes in and meets Frontinus
	introduction: [
		["???", "Who has entered the Nova Anio-akvedukto?"],
		["Claudia", "Uh..."],
		["???", "Oh, it's you!"],
		["Frontinus", "Greetings, Claudia. My name is Frontinus and I am here to help."],
		["Claudia", "Is there some kind of door you're supposed to show me?"],
		["Frontinus", "I see. Of course that's why you're here..."],
		["Frontinus", "Anyway, before we get to that, there are things you need to learn."],
		["Frontinus", "Are you really aware of the danger around these parts?"],
		["Claudia", "Are you aware of the lack of danger?"],
		["Frontinus", "No, but that's because the lack of danger does not exist."],
		["Claudia", "Then, what danger could you be referring to?"],
		["Frontinus", "I mean, of course, the mortal danger!"],
		["Claudia", "..."],

		["Frontinus", "Now that you're aware, it's time to prepare!"],
		["Frontinus", "How? Through an interactive tutorial!"],
		["Claudia", "How is this necessary?"],
		["Claudia", "If there does turn out to be danger, I'll figure out how to avoid it on my own."],
		["Frontinus", "You can, but not everybody can."],
		["Frontinus", "Do you understand?"],
		["Claudia", "Uh... Maybe?"],
		["Frontinus", "Now, then, let's begin."],
		["Frontinus", "Oh, and don't worry. I'll re-explain anything you mess up."],
		["Claudia", "That won't be necessary either..."]
	],

	// Frontinus explains how Claudia can use X to attack him
	attacking: [
		[null, "Sherlock Holmes and Dr Watson go on a camping trip."],
		[null, "They pitch their tent under the stars and go to sleep."],
		[null, "Sometime in the middle of the night, Holmes wakes Watson up."],
		["Holmes", "Watson, look up, and tell me what you see."],
		["Watson", "I see millions and millions of stars."],
		["Holmes", "And what do you deduce from that?"],
		["Watson", "Well, if there are millions of stars, and if even a few of those have planets..."],
		["Watson", "It's quite likely there are some planets like Earth out there."],
		["Watson", "And if there are a few planets like Earth out there, there might also be life."],
		["Holmes", "Watson, you idiot, it means that somebody stole our tent!"]
	],

	// Frontinus explains the timing of his attacks (number pattern)
	timing: [
		[null, "Gorbachev was being driven around by his driver one day. A new order had been issued..."],
		[null, "The Soviet police had to give anyone who sped a ticket, even the general secretary."],
		[null, "One day, Gorbachev's driver was pulled over."],
		[null, "As the officer was walking up to the driver's window..."],
		["Gorbachev", "Switch with me. They'll never give me a ticket."],
		[null, "So, they switched."],
		[null, "The officer went up to the window, and Gorbachev rolled it down."],
		[null, "The officer looked at Gorbachev, then at the driver. He was shocked."],
		[null, "After a few moments, he walked back to his fellow officer and the car sped off."],
		["Other officer", "So, did you give him a ticket?"],
		["First officer", "No, I didn't."],
		["Other officer", "We're supposed to give everyone a ticket. Who was it?"],
		["First officer", "I'm not sure who he is, but he must be important. Gorbachev is his driver!"]
	],

	// Frontinus explains being hit and healing
	healing: [
		[null, "Putin, the Pope and Jesus sit in a boat on the Sea of Galilee."],
		["Jesus", "I'm hot. I guess I should go get an umbrella."],
		[null, "Jesus jumps out of the boat, walks across the water, and comes back with an umbrella."],
		["Putin", "I'm thirsty. Wait folks, I get some."],
		[null, "Putin jumps out of the boat, walks across the water, comes back with cold drinks."],
		["Pope", "I'm hungry too!"],
		[null, "The Pope jumps out of the boat and sinks to the bottom."],
		[null, "Jesus and Putin lean across the side of the boat and watch him sink."],
		[null, "Jesus turns to Putin."],
		["Jesus", "I think we should've told him where the stepping stones are."],
		[null, "Putin turns to Jesus."],
		["Putin", "What stones?"]
	],

	// Frontinus explains dodging with Z to avoid damage
	dodging: [
		[null, "Soviet police announces that no one is allowed outside their house after 7:00 PM."],
		[null, "At 6:30 PM, a police officer notices someone outside and shoots him."],
		["Fellow police officer", "Why did you shoot him? He had 30 more minutes until 7:00!"],
		["First police officer", "I know where he lives. He would have never made it in time."]
	],

	// Frontinus explains replaying the tutorial and going to Lerwick
	conclusion: [
		[null, "At the 1980 Olympics, Brezhnev begins his speech."],
		["Brezhnev", "O!"],
		[null, "(Applause)"],
		["Brezhnev", "O!"],
		[null, "(An ovation)"],
		["Brezhnev", "O!!!"],
		[null, "(The whole audience stands up and applauds.)"],
		[null, "An aide comes running to the podium and whispers..."],
		["Aide", "Leonid Ilyich, those are the Olympic logo rings. You don't need to read all of them!"]
	]
}

export default dialogue
