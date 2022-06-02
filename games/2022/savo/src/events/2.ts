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
		["Frontinus", "First things first: attacking."],
		["Frontinus", "Do you see the '05' in the top right of the screen?"],
		["Frontinus", "Those are the pretend life points that I've created."],
		["Frontinus", "To kill an enemy, you must reduce their life points to zero, of course."],
		["Claudia", "If I do that, wouldn't it make *me* the mortal danger?"],
		["Frontinus", "No, because it's self-defense."],
		["Claudia", "How can I determine whether an attack will be self-defense or not?"],
		["Frontinus", "Don't worry about that."],
		["Frontinus", "For now, understand that you attack using the X key."],
		["Frontinus", "You will see a blue ring around you, which represents your attack range."],
		["Frontinus", "Once I'm in your attack range, using X will successfully deal damage."],
		["Claudia", "Are you really telling me to kill you?"],
		["Frontinus", "Don't misunderstand: I am actually invincible."],
		["Frontinus", "These life points are only for the convenience of the tutorial."],
		["Frontinus", "Anyway, you can't spam X five times to 'kill' me instantly."],
		["Claudia", "Who's going to stop me?"],
		["Frontinus", "You will stop yourself."],
		["Frontinus", "After an attack, or any other action, for that matter, you'll have a cooldown."],
		["Frontinus", "This will be represented with a wide, blue bar on the right edge of the screen."],
		["Frontinus", "Only once the cooldown is finished can you start a new action."],
		["Frontinus", "Confused yet?"],
		["Claudia", "Who do you take me for? I'm not so easily confused."],
		["Claudia", "Not on your terms, anyhow."],
		["Frontinus", "Well, experiment with attacking on your own now."],
		["Frontinus", "I will explain the next aspect of combat once you deplete my life points."],
	],

	// Frontinus explains the timing of his attacks (number pattern)
	timing: [
		["Claudia", "Whoa, hold on. I was next to you just a second ago. How am I back here?"],
		["Frontinus", "What kind of question is that?"],
		["Frontinus", "And what kind of answer are you looking for?"],
		["Claudia", "Well..."],
		["Frontinus", "Those were rhetorical, by the way."],
		["Frontinus", "Anyway, it looks like you've gotten the hang of attacking."],
		["Frontinus", "It's clear now that you are an innately violent individual."],
		["Frontinus", "You really have no problem abusing a civil engineer like that?"],
		["Claudia", "You're the one who urged me to do so..."],

		["Frontinus", "The next concept is timing."],
		["Frontinus", "You have noticed the '05' printed on my face, haven't you?"],
		["Claudia", "I initially assumed that that was a second display of life points."],
		["Claudia", "The number never changed while I attacked you, however."],
		["Frontinus", "That's because this number is not directly connected to life points at all."],
		["Frontinus", "Instead, it's my attack counter!"],
		["Frontinus", "During combat, I will decrement this number."],
		["Frontinus", "Then, once it hits zero, I will swing my sword and attack you back."],
		["Claudia", "Ah, so *you* are the mortal danger."],
		["Claudia", "Wouldn't chaining yourself up be the more surefire way of removing risk?"],
		["Frontinus", "Again, don't jump to unfortunate conclusions."],
		["Frontinus", "My weapon is incapable of creating real hurt."],
		["Frontinus", "Instead, its purpose is practice; I can simulate damage."],
		["Claudia", "Well then, do I have life points too? Would they decrease if I was to get hit?"],
		["Frontinus", "Are you referencing the '99' in the top left? We'll get to that later."],
		["Frontinus", "For now, try to completely avoid being hit."],
		["Frontinus", "Remember: I strike when my attack counter hits zero."],

		["Claudia", "And the only way it changes is by a decrease of one, it sounds like?"],
		["Claudia", "Why would you make it so predictable?"],
		["Frontinus", "Hey, I don't control it myself."],
		["Frontinus", "The pattern of a foe's attack counter is determined by the foe's conviction."],
		["Claudia", "Foe? Wouldn't I be a 'foe' from my opponent's perspective?"],
		["Claudia", "Why don't I have an attack counter to go along with that?"],
		["Frontinus", "Well, you're special. The world revolves around you, Claudia."],
		["Claudia", "What kind of answer is that?"],

		["Frontinus", "Disregard that subject too."],
		["Frontinus", "Now, try depleting my health like last time."],
		["Frontinus", "This time, however, you will need to anticipate my attacks."],
		["Frontinus", "If you mess up, I'll rewind time back to the start of this conversation."],
		["Frontinus", "Then, you can remind yourself of the instructions."],
		["Frontinus", "This is what I was referring to when you first arrived."],
		["Claudia", "Rewind time? I thought only Tiberius was capable of time travel."],
		["Frontinus", "Tiberius Claudius Caesar Britannicus? I haven't heard that name in a while."],
		["Frontinus", "Well then, have a go."],
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
