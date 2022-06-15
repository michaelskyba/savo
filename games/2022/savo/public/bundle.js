const canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");
// Abstractions
c.textWidth = (text) => c.measureText(text).width;
c.text = c.fillText;
c.frect = c.fillRect;

class TextBox {
    constructor(text, x, y, fontSize, fontFamily, bgColour, fgColour) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        // The canvas context takes e.g. "48px monospace" as a font
        this.font = fontSize + "px " + fontFamily;
        c.font = this.font;
        this.textWidth = c.textWidth(text);
        this.width = this.textWidth + 40;
        this.height = this.fontSize + 10;
        this.fgColour = fgColour;
        this.bgColour = bgColour;
    }
    draw() {
        c.beginPath();
        c.strokeStyle = "#111";
        c.font = this.font;
        c.lineWidth = 1;
        c.fillStyle = this.bgColour;
        c.rect(this.x, this.y, this.width, this.height);
        c.fill();
        c.stroke();
        // The y position of c.text is higher than it's supposed to be
        // Adding the fontSize creates a decent but imperfect offset
        let y = this.y + this.fontSize;
        c.fillStyle = this.fgColour;
        c.text(this.text, this.x + 20, y);
    }
}

class MenuOption extends TextBox {
    constructor(text, x, y) {
        super(text, x, y, 30, "serif", "maroon", "white");
    }
    // We can't call it "draw" or it would violate TypeScript
    // If we didn't have the boolean variable, I could name it "draw" and then
    // use super.draw() to call the superclass's draw.
    show(selected) {
        this.bgColour = selected ? "maroon" : "white";
        this.fgColour = selected ? "white" : "#111";
        this.draw();
    }
}

const music = {
    class_trial: document.getElementById("class_trial"),
    beautiful_ruin: document.getElementById("beautiful_ruin"),
    summer_salt: document.getElementById("summer_salt"),
    box_15: document.getElementById("box_15"),
    beautiful_dead: document.getElementById("beautiful_dead"),
    reset() {
        Object.keys(music).forEach(name => {
            if (name == "reset")
                return;
            let track = music[name];
            track.currentTime = 0;
            if (!track.paused)
                track.pause();
        });
    }
};
// Make all tracks loop
Object.keys(music).forEach(name => music[name].loop = true);

// Return random integer from min to max (inclusive)
const RNG$3 = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min;
};
class Particle {
    constructor(id) {
        this.active = true;
        this.id = id;
        this.speed = RNG$3(1, 5);
        this.size = RNG$3(25, 100);
        this.x = 1325;
        this.y = RNG$3(0 - this.size, 725);
    }
    draw() {
        // I can't be bothered to implement a timing system: the movement speed is
        // just decorative, so having it vary by frame rate is probably OK
        // The split line is at x = 500
        this.x -= this.speed;
        // It's a special case: the particle is on the line
        if (this.x > 500 - this.size && this.x < 500) {
            let split1 = 500 - this.x;
            c.fillStyle = "maroon";
            c.frect(this.x, this.y, split1, this.size);
            c.fillStyle = "#111";
            c.frect(this.x + split1, this.y, this.size - split1, this.size);
            // Slower movement during the split
            this.x += this.speed / 2;
            return;
        }
        // The particle isn't on the line, so we can draw a standard rectangle
        if (this.x >= 500)
            c.fillStyle = "#111";
        else
            c.fillStyle = "maroon";
        c.frect(this.x, this.y, this.size, this.size);
    }
}
let particles = [];
let lastSpawn = 0;
let lastID = -1;
const mainMenu = {
    selected: 0,
    screen: "Controls",
    options: [
        new MenuOption("Start", 150, 200),
        new MenuOption("Controls", 150, 260),
        new MenuOption("Credits", 150, 320),
        new MenuOption("Source code", 150, 380),
        new MenuOption("Home", 150, 440),
        new MenuOption("Password", 150, 500),
    ],
    init() {
        document.onkeydown = e => this.handleInput(e.code);
        music.class_trial.play();
    },
    handleInput(key) {
        // Option hovering
        if ((key == "ArrowUp" || key == "KeyK") && this.selected > 0)
            this.selected--;
        if ((key == "ArrowDown" || key == "KeyJ") && this.selected < 5)
            this.selected++;
        // Select option
        if (key == "KeyZ") {
            switch (this.selected) {
                // You pressed start, so enter the claudiaHouse object
                // steps.ts will react to the "screen" property
                case 0:
                    this.screen = "Claudia's house";
                    break;
                case 1:
                    this.screen = "Controls";
                    break;
                case 2:
                    this.screen = "Credits";
                    break;
                // "Source code" button
                case 3:
                    window.open("https://github.com/michaelskyba/michaelskyba.github.io/tree/master/games/2022/savo", "_blank").focus();
                    break;
                // "Home" button
                case 4:
                    window.location.href = "../../2022.html";
                    break;
                // "Password" button
                case 5:
                    let code = prompt("Enter your code.");
                    if (code == "11037")
                        alert("11037...? This is so difficult to figure out...");
                    break;
            }
        }
    },
    draw() {
        // Background
        c.fillStyle = "white";
        c.frect(0, 0, 500, 725);
        c.fillStyle = "maroon";
        c.frect(500, 0, 825, 725);
        // Background particles spawning
        let time = Date.now();
        if (time - lastSpawn > 400) {
            lastID++;
            particles.push(new Particle(lastID));
            lastSpawn = time;
        }
        // Background particles drawing
        for (const particle of particles) {
            particle.draw();
        }
        // Background particles deletion
        particles = particles.filter(particle => particle.x > -particle.size);
        // Main title text
        c.font = "48px serif";
        c.fillStyle = "white";
        c.text("Malfacile", 770, 100);
        c.fillStyle = "#ddd";
        c.text("Gajnita Savo", 770, 150);
        c.fillStyle = "white";
        c.font = "20px serif";
        c.text("by Michael Skyba", 770, 250);
        // Divider
        c.fillStyle = "white";
        c.frect(650, 300, 525, 3);
        // Section title
        if (this.screen != "Claudia's house") {
            c.fillStyle = "white";
            c.font = "48px serif";
            c.text(this.screen, 770, 400);
            c.font = "20px serif";
        }
        if (this.screen == "Controls") {
            c.text("- Use arrow keys for player and UI movement", 700, 450);
            c.text("- Use Z for UI selection, including dialogue progression", 700, 480);
            c.text("- Use Backspace to pause the game", 700, 510);
            c.text("- Other keys (for combat) will be introduced later, in-game", 700, 540);
        }
        else if (this.screen == "Credits") {
            c.text("- I, Michael, did the development", 700, 450);
            c.text("- The music was stolen from Masafumi Takada", 700, 480);
            c.text("- ImageMagick was used to generate (image) assets", 700, 510);
            c.text("- TypeScript was used as the general programming language", 700, 540);
            c.text("- rollup.js was used to bundle the JavaScript", 700, 570);
            c.text("- Kakoune was used as the code editor", 700, 600);
            c.text("- GitHub is used for hosting the source code and production build", 700, 630);
            c.text("- Arch Linux was used as the development operating system", 700, 660);
        }
        for (let i = 0; i < this.options.length; i++) {
            this.options[i].show(this.selected == i);
        }
    }
};
mainMenu.init = mainMenu.init.bind(mainMenu);
mainMenu.draw = mainMenu.draw.bind(mainMenu);
mainMenu.handleInput = mainMenu.handleInput.bind(mainMenu);

// 0: Not threatened
// 1: Threatened
let bg$1 = ["#fff", "#ff0000"];
let fg = ["#000", "#fff"];
class Life extends TextBox {
    constructor(hp, x, y) {
        super("00", x, y, 40, "monospace", "#fff", "#000");
        this.threatened = false;
        this.hp = hp;
    }
    heal() {
        this.threatened = false;
    }
    hit() {
        this.threatened = true;
        this.hp--;
    }
    draw() {
        let colIdx = this.threatened ? 1 : 0;
        this.bgColour = bg$1[colIdx];
        this.fgColour = fg[colIdx];
        this.text = (this.hp < 10 ? "0" : "") + this.hp.toString();
        // Draws the TextBox
        super.draw();
    }
}

class Cooldown {
    constructor(x, width, colour, pI) {
        this.counter = 0;
        this.getY = (counter) => 0;
        this.x = x;
        this.width = width;
        this.colour = colour;
        this.progressInterval = pI;
    }
    start() {
        this.lastFrame = 0;
        this.counter = 725;
    }
    progress(time) {
        this.counter--;
        if (!this.lastFrame) {
            this.lastFrame = time;
            return;
        }
        let diff = time - this.lastFrame;
        this.counter -= diff * this.progressInterval;
        this.lastFrame = time;
    }
    draw() {
        if (this.counter < 1)
            return;
        c.globalAlpha = 0.2;
        c.fillStyle = this.colour;
        c.frect(this.x, this.getY(this.counter), this.width, this.counter);
        c.globalAlpha = 1;
    }
}

// We need to convert to JSON and back so that JS clones by value instead of by
// reference
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
const defaultKeys = {
    left: false,
    right: false,
    up: false,
    down: false,
    shift: false
};
let cooldowns = ["damage", "heal", "dodge", "action"];
class HealCooldown extends Cooldown {
    constructor() {
        // We need it to decrease by 725 in 1s
        // So, that's 725/1000 = 0.725 per millisecond
        super(331.25, 331.25, "#ffff00", 0.725);
    }
    progress(time) {
        if (this.counter < 1)
            return;
        super.progress(time);
        if (this.counter < 1)
            player.life.heal();
    }
}
const player = {
    x: 200,
    y: 200,
    life: new Life(99, 5, 5),
    status: "prepared",
    cooldowns: {
        // We need it to decrease by 725 in 0.5s
        // So, that's (725/0.5)/1000 = 1.45 per millisecond
        damage: new Cooldown(0, 331.25, "#ff0000", 1.45),
        heal: new HealCooldown(),
        // Same as damage: 725p/0.5s --> 1.45
        dodge: new Cooldown(662.5, 331.25, "#00ffff", 1.45),
        // Same as healing: 725p/s --> 0.725
        action: new Cooldown(993.75, 331.25, "#0000ff", 0.725)
    },
    keyPressed: deepClone(defaultKeys),
    resetInput() {
        this.keyPressed = deepClone(defaultKeys);
    },
    attack() {
        if (this.cooldowns.action.counter > 1)
            return;
        this.cooldowns.action.start();
        // Only hit if the player is in range of the enemy
        if (this.status == "prepared")
            this.status = "attacking";
        // We have to use this status = "attacking" system so that the level can
        // compare states and administer damage. Trying to create damage in here
        // would require many imports as the number of possible enemies grows
        // and create dependency circles.
    },
    heal() {
        let cooldowns = this.cooldowns;
        // The actual heal will trigger once the cooldown ends
        if (cooldowns.heal.counter < 1 &&
            cooldowns.action.counter < 1 &&
            this.life.threatened == true) {
            cooldowns.heal.start();
            cooldowns.action.start();
        }
    },
    dodge() {
        if (this.cooldowns.action.counter < 1) {
            this.cooldowns.action.start();
            this.cooldowns.dodge.start();
        }
    },
    fixedKeys(input) {
        // Pressed Z: Dodge roll
        if (input == "KeyZ")
            this.dodge();
        // Pressed X: Attack
        if (input == "KeyX")
            this.attack();
        // Pressed C: Heal
        if (input == "KeyC")
            this.heal();
    },
    // Used as both onkeydown and onkeyup (specify with inputType)
    // Sets this.keyPressed accordingly according to keys pressed and released
    handleKey(inputType, input) {
        let keys = {
            "ArrowLeft": "left",
            "ArrowRight": "right",
            "ArrowUp": "up",
            "ArrowDown": "down",
            "ShiftLeft": "shift"
        };
        let key = keys[input];
        if (key)
            this.keyPressed[key] = inputType == "keydown";
    },
    move(mode, collisions) {
        let speed = 8;
        if (this.keyPressed.shift)
            speed = speed / 2;
        if (this.cooldowns.heal.counter > 0)
            speed = speed / 2;
        if (this.keyPressed.left)
            this.x -= speed;
        if (this.keyPressed.right)
            this.x += speed;
        if (this.keyPressed.up)
            this.y -= speed;
        if (this.keyPressed.down)
            this.y += speed;
        // Correct collisions
        for (const collision of collisions) {
            let colX = collision.x;
            let colY = collision.y;
            // We can't check for overworld once at the start because we would
            // have to modify the collisions array (or a copy), both of which
            // change it for perinthus.ts. I'm guessing that
            // Object.assign([], myArray) is even slower than this, though.
            // Correct for overworld display shifting
            if (mode == "overworld") {
                // 637.5 = canvas width / 2 - player width / 2
                // 337.5 = canvas height / 2 - player width / 2
                colX -= 637.5;
                colY -= 337.5;
            }
            if (this.x + 50 > colX &&
                this.x < colX + collision.width &&
                this.y + 50 > colY &&
                this.y < colY + collision.height) {
                // The way we correct the position depends on how the player collided
                // We have to make sure that the previous value did NOT satisfy
                // the collision so that we know how to handle it - otherwise we
                // might see "the player pressed left and up, and now they've collided"
                // and won't know which one it was
                if (this.keyPressed.left &&
                    this.x + speed >= colX + collision.width)
                    this.x = colX + collision.width;
                if (this.keyPressed.right &&
                    this.x - speed + 50 <= colX)
                    this.x = colX - 50;
                if (this.keyPressed.up &&
                    this.y + speed >= colY + collision.height)
                    this.y = colY + collision.height;
                if (this.keyPressed.down &&
                    this.y - speed + 50 <= colY)
                    this.y = colY - 50;
            }
        }
    },
    draw(mode) {
        c.fillStyle = "maroon";
        if (mode == "fixed")
            c.frect(this.x, this.y, 50, 50);
        else {
            // We want to draw it centered:
            // 637.5 = canvas width / 2 - player width / 2
            // 337.5 = canvas height / 2 - player width / 2
            c.frect(637.5, 337.5, 50, 50);
        }
    },
    // Player attack range
    drawRange(enemyX, enemyY) {
        let range = 100;
        let width = 50;
        if (enemyX + width > this.x + width / 2 - range &&
            enemyY + width > this.y + width / 2 - range &&
            enemyX < this.x + width * 1.5 + range &&
            enemyY < this.y + width * 1.5 + range &&
            this.cooldowns.action.counter < 1) {
            if (this.status == "default")
                this.status = "prepared";
            c.globalAlpha = 0.3;
            c.fillStyle = "maroon";
            let offset = width / 2 - range;
            c.frect(this.x + offset, this.y + offset, range * 2, range * 2);
            c.globalAlpha = 1;
        }
        else
            this.status = "default";
    },
    receiveDamage() {
        // Quit if invincible
        if (this.cooldowns.damage.counter > 0 ||
            this.cooldowns.dodge.counter > 0)
            return;
        // You were already threatened before being hit, so you die instantly
        if (this.life.threatened) {
            this.life.hp = 0;
            return;
        }
        this.life.hit();
        this.cooldowns.damage.start();
    },
    drawCooldowns() {
        for (const cooldown of cooldowns) {
            this.cooldowns[cooldown].draw();
        }
    },
    resetCooldowns() {
        for (const cooldown of cooldowns) {
            this.cooldowns[cooldown].counter = 0;
        }
    },
    progressCooldowns(time) {
        for (const cooldown of cooldowns) {
            this.cooldowns[cooldown].progress(time);
        }
    }
};
// Have damage and dodge cooldowns go backwards
let damage = player.cooldowns.damage;
damage.getY = (counter) => 725 - counter;
player.cooldowns.dodge.getY = damage.getY;

// Inside Claudia's house at the start of the game
const dialogue$5 = {
    main: [
        [null, "In the middle of one seemingly normal night, Claudia woke up to go to the bathroom."],
        [null, "On her way back, she was curious about what time it was."],
        [null, "So, she opened up her laptop to check the time on her lock screen."],
        [null, "..."],
        [null, "Instead of the time, she saw a frightening message:"],
        ["Bindows 10", "Working on updates..."],
        ["Bindows 10", "6% complete..."],
        ["Bindows 10", "Don't turn off your computer..."],
        [null, "..."],
        [null, "Claudia was enraged. This was the last straw!"],
        [null, "She vowed to purge her computer of this mess of an operating system the next morning."],
        [null, "Surely, something better was out there."],
        [null, "Claudia went back to sleep, restless from her anticipation."],
        [null, "..."],
        [null, "The next morning, she looked at her pitiful laptop and again was overcome with conviction."],
        [null, "Her mother had entered the room."],
        ["Claudia", "Hey Mom, I need a new operating system on the laptop you bought me."],
        ["Messalina", "Are you sure about this?"],
        ["Messalina", "The path you're speaking about so casually is filled with pain and regret."],
        [null, "Claudia hesitated, but after a couple of minutes of silence, she spoke."],
        ["Claudia", "That isn't enough to convince me to back down."],
        ["Claudia", "I'm tired of my experience with this laptop."],
        ["Messalina", "Very well. Don't blame me in the future for permitting this."],
        [null, "..."],
        ["Messalina", "What you're looking for is Nero Linux, the best Linux distribution."],
        ["Claudia", "Linux distribution? What's that?"],
        ["Messalina", "Don't worry about the details for now."],
        ["Messalina", "Anyway, there are broadly two steps before you have a perfect operating system."],
        ["Messalina", "First, you need to acquire the Nero Linux ROM, which will be used to install the OS."],
        ["Messalina", "This is hidden far away in the land of Lerwick, owned by your stepbrother."],
        ["Claudia", "Stepbrother...? But you haven't died yet, and Father hasn't married Julia Agrippina yet."],
        ["Claudia", "I don't have a stepbrother."],
        ["Messalina", "Fool! Don't hold any sort of expectations of historical accuracy!"],
        ["Claudia", "A-alright, I suppose..."],
        ["Messalina", "Once you've acquired the ROM, you have a second problem: no drivers exist for your Kepler GPU."],
        ["Claudia", "What's a driver? Cars aren't going to exist a while."],
        ["Messalina", "Again, disregard the details for the moment."],
        ["Claudia", "All it means in the broader sense is that you're going to have to program your own."],
        ["Claudia", "Programming? You mean that thing that losers do?"],
        ["Messalina", "Hey, I'm trying to help you here."],
        ["Claudia", "Anyway, I haven't been paying attention. Just tell me the first thing I need to do."],
        ["Messalina", "That kind of mindset is not ready for success."],
        ["Messalina", "I suppose I'll have you understand that out on your own..."],
        ["Messalina", "Well, the first step is to head up to Nova Anio-akvedukto."],
        ["Claudia", "Hah, you mean Aqua Anio Novus? Esperanto comes right after the drivers from earlier."],
        ["Messalina", "You've already forgotten what I said a minute ago?"],
        ["Messalina", "Forget your attachment to consistency instead!"],
        ["Messalina", "Once you arrive at Nova Anio-akvedukto, talk to Frontinus."],
        ["Messalina", "Tell him to 'show you the door'."],
        ["Claudia", "Got it: Go to Nova Anio-akvedukto, tell Frontinus to show me the door."],
        ["Claudia", "Thanks, Mom!"],
        ["Messalina", "Your gratitude is misplaced."]
    ]
};

class Scene {
    constructor(dialogue, playing) {
        this.playing = true;
        this.frame = 0;
        this.dialogue = dialogue;
        this.setBoxes(this.frame);
    }
    // Create text boxes for the current frame
    setBoxes(frame) {
        let line = this.dialogue[frame];
        if (line[0])
            this.speaker = new TextBox(line[0], 50, 550, 30, "serif", "#111", "white");
        else
            this.speaker = null;
        this.speech = new TextBox(line[1], 50, 600, 30, "serif", "white", "#111");
    }
    progress() {
        if (this.frame <= this.dialogue.length - 2) {
            this.frame++;
            this.setBoxes(this.frame);
        }
        // e.g. pressed z, frame = 5 (fifth frame), six total frames
        else
            this.playing = false;
    }
}

// This is the fixed location version of overworld/Block.ts.
class Wall {
    constructor(x, y, width, height, colour) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour;
    }
    draw() {
        c.fillStyle = this.colour;
        c.frect(this.x, this.y, this.width, this.height);
    }
}

class Img$1 {
    constructor(id, x, y) {
        this.x = x;
        this.y = y;
        this.img = document.getElementById(id);
        this.width = this.img.width;
        this.height = this.img.height;
    }
    draw() {
        c.drawImage(this.img, this.x, this.y);
    }
}

class Interactable$1 {
    constructor(id, obj) {
        this.id = id;
        this.obj = obj;
    }
    draw() {
        this.obj.draw();
    }
    // Is the player in range to interact?
    inRange() {
        let obj = this.obj;
        // Made with the assumption that player is (50, 50) in width and height
        return (player.x > obj.x - 125 &&
            player.x < obj.x + obj.width + 75 &&
            player.y > obj.y - 125 &&
            player.y < obj.y + obj.height + 75);
    }
}

// Interaction inside claudiaHouse
const dialogue$4 = {
    Messalina: [
        ["Claudia", "Hey, Mom."],
        ["Messalina", "You've already forgotten my instructions?"],
        ["Claudia", "U-uh..."],
        ["Claudia", "No, I was just wondering if you had anything new and interesting to say."],
        ["Messalina", "I'll spare you the bullying and embarrassment."],
        ["Messalina", "Go *up* to Nova Anio-akvedukto and meet Frontinus."],
        ["Messalina", "Got it this time?"],
        ["Claudia", "I already knew that, okay?"],
        ["Messalina", "Of course."]
    ],
    bed: [
        ["Claudia", "This bed was $500, including the mattress."],
        ["Claudia", "How much time would I need to work to make that much money?"],
        ["Claudia", "How much am I losing?"],
        ["Claudia", "Hmm..."],
        ["Claudia", "Well, the market's been going up by 10% around here for 100 years."],
        ["Claudia", "So, in twenty years, that $500 would be 500 * 1.1^20..."],
        ["Claudia", "... ~= $3363.75!"],
        ["Claudia", "Is this bed really worth that?"],
        ["Claudia", "Could I live without it?"],
        ["Claudia", "Well, sleeping on the wooden floor hurts quite a bit."],
        ["Claudia", "But, what about a foldable, less expensive mattress like GOKUMIN?"],
        ["Claudia", "Yeah, that's a way better idea. It could double as a seat!"],
        ["Claudia", "But wait... what about the shipping costs?"],
        ["Claudia", "I live too far away from the manufacturer..."],
        ["Claudia", "What to do?"],
        ["Claudia", "Hmm..."]
    ],
    bookshelf: [
        ["Claudia", "There are so many books that I haven't had a chance to read..."],
        ["Claudia", "But, would the time investment really be worth it?"],
        ["Claudia", "What if new research has deprecated their contents?"],
        ["Claudia", "None are particularly recent, after all."],
        ["Claudia", "Additionally, research online is simply more convenient."],
        ["Claudia", "Why, then, is 'knowledge' more (socially) paired with books than with the internet?"],
        ["Claudia", "Did the association appear before the world's knowledge made its way over?"],
        ["Claudia", "Does public impression take that long to shift?"],
        ["Claudia", "Or maybe the medium of books does have an important, inherent advantage..."],
        ["Claudia", "Why can't I see it?"],
        ["Claudia", "I can only think of further disadvantages, like the lack of portability."],
        ["Claudia", "Hmm..."]
    ],
    stove: [
        ["Claudia", "Interesting. The stove is still on, yet nobody seems to be watching it."],
        ["Claudia", "Is this a fire hazard? Should I take responsibility and turn it off?"],
        ["Claudia", "No, I'll just let somebody else worry about it."],
        ["Claudia", "My house has never burned down before, so why would it start now?"]
    ],
    Claudius: [
        ["Claudia", "Hey, Dad."],
        ["Claudius", "..."],
        ["Claudia", "No reply? Can you hear me? Or has your deafness worsened?"],
        ["Claudius", "..."],
        ["Claudia", "Oh, you're ignoring me."],
        ["Claudia", "Good luck at your next trial, I suppose."],
        ["Claudia", "Not that I have any reason to care about your personal interests..."],
        ["Claudius", "..."],
    ]
};

const bindows = new Img$1("bindows", 0, 0);
const intro = new Scene(dialogue$5.main);
let scene$4 = intro;
const interactables$3 = [
    // Room 0 (left)
    [
        new Interactable$1("stove", new Img$1("stove", 150, 75)),
        new Interactable$1("Claudius", new Wall(200, 600, 50, 50, "#1d697c"))
    ],
    // Room 1 (right)
    [
        new Interactable$1("Messalina", new Wall(200, 75, 50, 50, "#006442")),
        new Interactable$1("bookshelf", new Img$1("bookshelf", 650, 75)),
        new Interactable$1("bed", new Img$1("bed", 150, 550))
    ]
];
// Prompt for interacting with an interactable
// [0][0] is just a default which shouldn't pop up by itself
let prompt$4 = {
    int: interactables$3[0][0],
    active: false,
    box: new MenuOption("=================================================", 0, 0)
};
let wallColour$2 = "#bf823e";
const walls$1 = [
    // Room 0 (left)
    [
        new Wall(0, 0, 1325, 25, wallColour$2),
        new Wall(0, 0, 25, 1325, wallColour$2),
        new Wall(0, 700, 1325, 25, wallColour$2),
        new Wall(1300, 0, 25, 262.5, wallColour$2),
        new Wall(1300, 462.5, 25, 262.5, wallColour$2)
    ],
    // Room 1 (right)
    [
        new Wall(0, 0, 1325, 25, wallColour$2),
        new Wall(0, 700, 1325, 25, wallColour$2),
        new Wall(0, 0, 25, 262.5, wallColour$2),
        new Wall(0, 462.5, 25, 262.5, wallColour$2),
        new Wall(1300, 0, 25, 262.5, wallColour$2),
        new Wall(1300, 462.5, 25, 262.5, wallColour$2)
    ]
];
let collision$2;
function drawScene(scene) {
    scene.speech.draw();
    if (scene.speaker)
        scene.speaker.draw();
}
class ClaudiaHouse {
    constructor() {
        this.room = 1;
    }
    init() {
        document.onkeydown = event => {
            let key = event.code;
            player.handleKey("keydown", key);
            this.handleInput(key);
        };
        document.onkeyup = event => {
            player.handleKey("keyup", event.code);
        };
        this.genCollision();
    }
    genCollision() {
        collision$2 = [
            ...walls$1[this.room],
            // The Img/Block is stored in the .obj property in the Interactable class
            ...interactables$3[this.room].map(i => i.obj)
        ];
    }
    handleInput(key) {
        // The player pressed Z to progress the dialogue
        if (key == "KeyZ" && scene$4.playing) {
            let introPlaying = intro.playing;
            scene$4.progress();
            // Start the next track once movement is open after the intro
            if (introPlaying && !scene$4.playing) {
                music.reset();
                music.beautiful_ruin.play();
            }
        }
        // The player entered an interaction prompt with X
        else if (key == "KeyX" && prompt$4.active) {
            prompt$4.active = false;
            scene$4 = new Scene(dialogue$4[prompt$4.int.id]);
        }
    }
    // Give input to the player, but only if a dialogue isn't playing
    move() {
        if (!scene$4.playing)
            player.move("fixed", collision$2);
    }
    transitions() {
        // 1275 = canvas width - player width
        if (player.x < 0) {
            this.room = 0;
            player.x = 1275;
            this.genCollision();
        }
        if (player.x > 1275) {
            if (this.room == 0) {
                this.room = 1;
                player.x = 0;
                this.genCollision();
            }
            // Leaving the house - read by steps.ts
            else
                return true;
        }
        return false;
    }
    draw() {
        // Special background for scene
        if (intro.playing)
            this.drawIntro();
        else
            this.drawRoom();
    }
    drawIntro() {
        // Draw the Bindows 10 background if it's relevant
        if (scene$4.frame > 2 && scene$4.frame < 12)
            bindows.draw();
        else {
            c.fillStyle = "#ddd";
            c.frect(0, 0, 1325, 725);
        }
        drawScene(scene$4);
    }
    drawRoom() {
        c.fillStyle = "#f0e68c";
        c.frect(0, 0, 1325, 725);
        player.draw("fixed");
        for (const wall of walls$1[this.room]) {
            wall.draw();
        }
        // Drawing the objects
        for (const interactable of interactables$3[this.room]) {
            interactable.draw();
        }
        if (!scene$4.playing)
            this.checkRanges();
        if (prompt$4.active)
            prompt$4.box.show(false);
        if (scene$4.playing)
            drawScene(scene$4);
    }
    checkRanges() {
        let wasSet = false;
        for (const int of interactables$3[this.room]) {
            if (int.inRange()) {
                // We only need to update the prompt box if it doesn't exist yet
                if (!prompt$4.active)
                    prompt$4.box = new MenuOption("Press X to interact.", int.obj.x - 60, int.obj.y - 60);
                prompt$4.int = int;
                prompt$4.active = true;
                wasSet = true;
            }
        }
        // If none of them are inRange, make sure that no prompt is open
        if (!wasSet)
            prompt$4.active = false;
    }
}
// I'm making a temporary class here to avoid commas after methods, binding
// "this", etc.
const claudiaHouse = new ClaudiaHouse();

class Sword {
    constructor(length, angle, colour) {
        this.length = length;
        this.angle = angle;
        this.colour = colour;
        this.genPoints();
    }
    rotate(change) {
        this.angle += change;
        if (this.angle < 0)
            this.angle = 360 + this.angle % 360;
        if (this.angle > 360)
            this.angle = this.angle % 360;
        this.genPoints();
    }
    genPoints() {
        let rad = Math.round(this.angle) * Math.PI / 180;
        this.offsetX = this.length * Math.cos(rad);
        this.offsetY = this.length * Math.sin(rad);
    }
    collision(originX, originY, playerX, playerY) {
        // I hope this is optimal enough to avoid causing a significant input lag
        // I might have been easier to compare angles instead
        let x1 = originX;
        let y1 = originY;
        let x2 = x1 + this.offsetX;
        let y2 = y1 + this.offsetY;
        let x3 = playerX;
        let y3 = playerY;
        // Player size = 50
        let x4 = x3 + 50;
        let y4 = y3 + 50;
        // Quick rejects: player out of range of diagonal box
        if (Math.min(x1, x2) > x4 || Math.max(x1, x2) < x3 ||
            Math.min(y1, y2) > y4 || Math.max(y1, y2) < y3)
            return false;
        // Quick accept: sword endpoint inside player
        if (x2 > x3 && x2 < x4 && y2 > y3 && y2 < y4)
            return true;
        // Slope: m = (y2 - y1)/(x2 - x1)
        let dy = y2 - y1;
        let dx = x2 - x1;
        // Special case if the sword is straight down or straight up
        if (dx == 0) {
            // Player's center point Y
            let y = y3 + 25;
            // If the enemy center point --> play center point distance is less
            // than the sword length, we know that it's touching. Otherwise, it
            // can't be. We don't have to worry about the fact that the player is a
            // square instead of a circle because the x values are aligned.
            return Math.abs(y1 - y) < this.length - 25;
        }
        let m = dy / dx;
        /*
        Y-intercept

        y = mx + b
        b = y - mx
        */
        let b = y1 - m * x1;
        // y value of equation when x = player left side (x)
        let intersectLeft = m * x3 + b;
        // Check if the line intersects the left side of the player
        if (intersectLeft >= y3 && intersectLeft <= y4)
            return true;
        // y value of equation when x = player right side (x + 50)
        let intersectRight = m * x4 + b;
        // Check if the line intersects the right side of the player
        if (intersectRight >= y3 && intersectRight <= y4)
            return true;
        /*
        y = mx + b
        mx + b = y
        mx = y - b
        x = (y - b)/m
        */
        // x value of equation when y = player top side (y)
        let intersectTop = (y3 - b) / m;
        // Check if line intersects the top side of the player
        if (intersectTop >= x3 && intersectTop <= x4)
            return true;
        // x value of equation when y = player bottom side (y + 50)
        let intersectBottom = (y4 - b) / m;
        // Check if line intersects the bottom side of the player
        if (intersectBottom >= x3 && intersectBottom <= x4)
            return true;
        return false;
    }
    // Takes the x and y of the origin
    draw(x, y) {
        c.strokeStyle = this.colour;
        c.lineWidth = 5;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + this.offsetX, y + this.offsetY);
        c.stroke();
    }
}

class Enemy {
    constructor(x, y, elapsed, HP, colour) {
        this.status = "countdown";
        this.x = x;
        this.y = y;
        // Different indices can contain different timers, which is why we use
        // an array of numbers instead of just one
        this.elapsed = elapsed;
        this.colour = colour;
        this.sword = new Sword(200, 0, colour);
        // 1232 = canvas width - textbox width (~88) - padding (5)
        this.life = new Life(HP, 1232, 5);
    }
    collision(playerX, playerY) {
        // The enemy only attacks when its attack counter is at zero
        if (this.counter != 0)
            return false;
        return this.sword.collision(this.x + 25, this.y + 25, playerX, playerY);
    }
    receiveDamage() {
        this.life.hit();
        // Enemies don't need to heal
        this.life.threatened = false;
    }
    // Count the time
    timer(status, time) {
        if (status == "start") {
            if (!this.lastFrame)
                this.lastFrame = time;
            // Add to each elapsed value
            let change = time - this.lastFrame;
            this.elapsed = this.elapsed.map(x => x + change);
        }
        // The movement loop is over
        else
            this.lastFrame = time;
    }
    move(time) {
        // For now, let's say that we want one full rotation per minute
        // That's 360 per minute --> 360 per 60 s --> 6 per s
        // Time is given in ms, so we want 6 * ((ms - last frame) / 1000)
        if (this.lastFrame == null) {
            this.lastFrame = time;
            return;
        }
        let diff = time - this.lastFrame;
        let move = 6 * diff / 1000;
        this.lastFrame = time;
        this.sword.rotate(move);
    }
    startSwing() {
        this.status = "attack";
        // Math.atan2 gets the angle to the point from the origin.
        // Since our origin is frontinus's (x, y), we need to
        // subtract each from the player's corresponding value.
        // https://stackoverflow.com/a/28227643
        let x = player.x - this.x;
        let y = player.y - this.y;
        let angle = Math.atan2(y, x) * 180 / Math.PI;
        this.sword.angle = angle;
        this.sword.rotate(-90);
    }
    draw() {
        c.fillStyle = this.colour;
        // 25 = enemy size / 2 (so the sword starts in the center)
        if (this.status == "attack")
            this.sword.draw(this.x + 25, this.y + 25);
        c.frect(this.x, this.y, 50, 50);
        // Drawing the attack counter
        let fontSize = 40;
        c.font = fontSize + "px monospace";
        c.fillStyle = "white";
        let text = (this.counter < 10 ? "0" : "") + this.counter;
        c.text(text, this.x, this.y + fontSize);
    }
}

class Frontinus extends Enemy {
    constructor(counterInit) {
        // 637.5 = horizontal center
        super(637.5, 200, [0], 5, "midnightblue");
        this.counterInit = counterInit;
        this.counter = counterInit;
    }
    move(time) {
        this.timer("start", time);
        // Counting down to the next attack
        if (this.status == "countdown") {
            let threshold = 500;
            while (this.elapsed[0] > threshold) {
                this.counter--;
                this.elapsed[0] -= threshold;
                if (this.counter == 0) {
                    this.elapsed[0] = 0;
                    this.startSwing();
                }
            }
        }
        // Executing the attack
        else {
            // We want a 180 degree rotation in 200ms, which means 180/200 = 0.9
            // degrees per millisecond
            this.sword.rotate((time - this.lastFrame) * 0.9);
            // It's done after 200 ms
            if (this.elapsed[0] > 200) {
                this.status = "countdown";
                this.elapsed[0] = 0;
                this.counter = this.counterInit;
            }
        }
        this.timer("end", time);
    }
}

// The Akvedukto tutorial and introduction
const dialogue$3 = {
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
        ["Frontinus", "How? Through a somewhat-interactive tutorial!"],
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
        ["Frontinus", "You will see a maroon ring around you, which represents your attack range."],
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
        ["Frontinus", "I will explain the next aspect of combat once you deplete my life points."]
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
        ["Frontinus", "Well then, have a go."]
    ],
    // Frontinus explains being hit and healing
    healing: [
        ["Frontinus", "Great, your brain is capable of grasping the concept of counting."],
        ["Claudia", "You say that as if your ability to 'grasp concepts' is superior to mine."],
        ["Frontinus", "Is it not?"],
        ["Claudia", "It's not."],
        ["Claudia", "Next time you consider making such a nefarious implication, think again."],
        ["Frontinus", "The next concept you need to grasp is healing."],
        ["Frontinus", "Successful as your timing is, it won't ever be perfect."],
        ["Frontinus", "You're not me, after all."],
        ["Claudia", "..."],
        ["Frontinus", "Thus, it's important to be able to survive being hit."],
        ["Claudia", "Are you going to explain whether or not I have life points now?"],
        ["Frontinus", "You do have life points, Claudia."],
        ["Frontinus", "However, they work slightly differently from that of your enemies."],
        ["Frontinus", "When I hit you, your life points will decrease, but that's not all."],
        ["Frontinus", "Additionally, your life will become 'threatened'."],
        ["Claudia", "Isn't it threatened the second combat starts?"],
        ["Frontinus", "'Threatened' is a specific, identifiable state."],
        ["Frontinus", "You'll know you're threatened because your life points display will turn red."],
        ["Claudia", "Why should I care if it's red or not?"],
        ["Frontinus", "I was about to get to that."],
        ["Frontinus", "The thing is, your life points are effectively reduced to one while threatened."],
        ["Frontinus", "So, if you are hit while threatened, you will die, regardless of how many remain."],
        ["Claudia", "How is that different from having two life points total?"],
        ["Frontinus", "This is where healing comes into play."],
        ["Frontinus", "You're incapable of raising your life points, but you can do something else."],
        ["Claudia", "Unthreaten myself?"],
        ["Frontinus", "That's right. Pressing C will heal you, removing the 'threatened' state."],
        ["Claudia", "Hmm..."],
        ["Claudia", "Wait, so does that mean it's optimal to spam C during your attack?"],
        ["Claudia", "That's unfun, annoying, nonsensical, etc."],
        ["Frontinus", "No, that's not a particularly good idea, because you haven't heard the catch."],
        ["Claudia", "What are you talking about?"],
        ["Frontinus", "The catch is that healing is not instant."],
        ["Frontinus", "After pressing C to heal, you will start a healing (and action) cooldown."],
        ["Frontinus", "The healing cooldown shows up yellow in the second quarter of the screen."],
        ["Frontinus", "Only once it's finished does the heal activate."],
        ["Claudia", "How fast is the healing cooldown compared to the action cooldown?"],
        ["Frontinus", "Figure it out yourself."],
        ["Frontinus", "Also, your movement speed will be halved while the cooldown is running."],
        ["Claudia", "What if I *want* to move slowly?"],
        ["Frontinus", "In that case, you should hold Shift while moving, but it has nothing to do with healing."],
        ["Frontinus", "Alright, it's time for you to try healing on your own."],
        ["Frontinus", "I will cut off your means of escape using some walls, forcing you to take damage."],
        ["Frontinus", "To survive long enough to defeat me, you'll have to heal after every attack."],
        ["Frontinus", "Understand?"],
        ["Claudia", "I understand, yes..."],
        ["Claudia", "...but you wouldn't understand if our roles were switched."],
        ["Claudia", "Your concept comprehension capacity is largely non-existent, after all."],
        ["Frontinus", "..."],
        ["Frontinus", "Another note is that this strategy of sponging damage through healing is generally wrong."],
        ["Frontinus", "In this case, it works, since I've generously provided you with 99 life points."],
        ["Frontinus", "Usually, however, you'll have far less. You'll quickly die if you waste them."],
        ["Claudia", "That's not true. I could waste all except one and then kill my enemy with one left."],
        ["Frontinus", "Whatever you say. Let's begin."]
    ],
    // Frontinus explains dodging with Z to avoid damage
    dodging: [
        ["Claudia", "That was far too easy."],
        ["Frontinus", "Oh? It looked as if you were struggling to progress..."],
        ["Claudia", "Seems like you're incapable of making valid inferences, as usual."],
        ["Claudia", "Anyway, am I done?"],
        ["Frontinus", "Not quite. There is one last element: dodging."],
        ["Claudia", "Didn't I already dodge your attacks during the attack counter practice?"],
        ["Frontinus", "You dodged them, but you didn't *dodge* them."],
        ["Frontinus", "'Dodging' is a specific action triggered by the Z key."],
        ["Frontinus", "When pressing Z, a dodge cooldown will start."],
        ["Frontinus", "This one is green and positioned in the third quarter of the screen."],
        ["Frontinus", "While the dodge cooldown is running, you will be immune to all damage."],
        ["Frontinus", "Pretty simple, right?"],
        ["Claudia", "What stops me from staying invincible indefinitely by spamming Z?"],
        ["Frontinus", "Where's the fun in that? You will once again stop yourself."],
        ["Frontinus", "Since dodging is an action, it will have an accompanied action cooldown."],
        ["Frontinus", "However, the action cooldown lasts longer than the dodge cooldown."],
        ["Frontinus", "Are you confused, or do you see what I'm saying?"],
        ["Claudia", "I get it..."],
        ["Claudia", "The dodge cooldown is shorter, so when it ends, the action cooldown will be running."],
        ["Claudia", "And since the action cooldown is running, I'll be unable to start a new dodge."],
        ["Claudia", "During the interval between the dodge cooldown ending and my next dodge starting..."],
        ["Claudia", "...I will be completely open to damage."],
        ["Frontinus", "Is that right? I kind of... got lost..."],
        ["Claudia", "Ha! Your ability to maintain stable attention subceeds mine."],
        ["Claudia", "Do you understand how tiny you really are?"],
        ["Claudia", "I don't care if you call yourself invincible. I am one hundred times more powerful."],
        ["Frontinus", "Really? Or are you just incapable of effectively communicating ideas?"],
        ["Claudia", "N-no! We both know that you're just deflecting."],
        ["Frontinus", "Well then, demonstrate your supposed ability."],
        ["Frontinus", "Kill me without taking damage."],
        ["Claudia", "No problem for me."],
        ["Claudia", "Oh, but I have one question regarding the previous trial."],
        ["Claudia", "What was that red cooldown in the first quarter of the screen?"],
        ["Frontinus", "You talk big yet fail to grasp such an obvious idea..."],
        ["Frontinus", "How can you be so blatantly unaware of your own faults?"],
        ["Claudia", "..."],
        ["Frontinus", "No response, huh?"],
        ["Frontinus", "Well, the red cooldown is the damage cooldown, of course."],
        ["Frontinus", "My sword passed through you for many frames."],
        ["Frontinus", "Why then, did you only take damage once per swing?"],
        ["Claudia", "Oh, it's becau-"],
        ["Frontinus", "-because damage is turned off for the rest of the swing?"],
        ["Frontinus", "As part of the code for the sword, which would remember whether you were hit or not?"],
        ["Claudia", "That's actually not what I was goi-"],
        ["Frontinus", "Wrong answer! In reality, it's because of the damage cooldown!"],
        ["Claudia", "..."],
        ["Frontinus", "As soon as you take damage, the damage cooldown starts."],
        ["Frontinus", "Then, for the duration of the cooldown, you're immune!"],
        ["Frontinus", "This gives you a moment to get back on your feet."],
        ["Claudia", "I was about to sa-"],
        ["Frontinus", "Welp, enough questions! Practice using Z to dodge!"]
    ],
    // Frontinus explains replaying the tutorial and going to Lerwick
    conclusion: [
        ["Frontinus", "Well then... You have completed the tutorial."],
        ["Claudia", "As I expected, I didn't learn anything of value."],
        ["Frontinus", "Or did you just learn nothing? Have you ever learned anything in your life?"],
        ["Claudia", "..."],
        ["Claudia", "What I meant was that I still could have figured it out on my own."],
        ["Frontinus", "Ha ha ha... Soon enough, you will wish you paid more attention."],
        ["Frontinus", "When that time comes, speak to me, and we can re-enact this charade once more."],
        ["Claudia", "I'm not interested."],
        ["Frontinus", "In the meantime, I'll show you the door that you came for."],
        ["Frontinus", "When you pass through, you sacrifice your sense of safety."],
        ["Frontinus", "On the other side is Lerwick, a place containing concerns."],
        ["Frontinus", "Unlike me, dwellers *are* capable of hurting."],
        ["Claudia", "I've lost 15% of my brain cells from speaking to you."],
        ["Claudia", "It's safe to say that you're plenty cable of damaging others."],
        ["Frontinus", "I'm not joking."],
        ["Frontinus", "If you go out there, you will experience pain and death."],
        ["Claudia", "Yeah, yeah, okay buddy."],
        ["Claudia", "Hopefully a Nero Linux ROM is around here somewhere..."],
    ]
};

let frontinus = new Frontinus(5);
let scene$3 = new Scene(dialogue$3.introduction);
let bg = new Img$1("akvedukto_fixed", 0, 0);
function resetCombat() {
    frontinus = new Frontinus(5);
    player.resetCooldowns();
    player.life = new Life(99, 5, 5);
    // horizontal center based on canvas and player width
    player.x = 637.5;
    player.y = 625;
}
// Set the dialogue based on the phase
function setDialogue() {
    let next;
    switch (akvedukto.phase) {
        case 3:
            next = dialogue$3.timing;
            break;
        case 5:
            next = dialogue$3.healing;
            break;
        case 7:
            next = dialogue$3.dodging;
            break;
        case 9:
            next = dialogue$3.conclusion;
            break;
    }
    scene$3 = new Scene(next);
}
let wallColour$1 = "#a69583";
const walls = [
    // Initial position with door blocked
    [
        new Wall(0, 0, 1325, 25, wallColour$1),
        new Wall(0, 0, 25, 1325, wallColour$1),
        // Bottom with intersection
        new Wall(0, 700, 512.5, 25, wallColour$1),
        new Wall(812.5, 700, 612.5, 25, wallColour$1),
        // Initially solid right wall
        new Wall(1300, 0, 25, 725, wallColour$1)
    ],
    // Door unblocked after tutorial
    [
        new Wall(0, 0, 1325, 25, wallColour$1),
        new Wall(0, 0, 25, 1325, wallColour$1),
        // Bottom with intersection
        new Wall(0, 700, 512.5, 25, wallColour$1),
        new Wall(812.5, 700, 612.5, 25, wallColour$1),
        // Intersection in right wall
        new Wall(1300, 0, 25, 212.5, wallColour$1),
        new Wall(1300, 512.5, 25, 212.5, wallColour$1)
    ]
];
// This is the barrier from the tutorial, trapping Claudia into Frontinus's
// sword's range
let barrierColour = "midnightblue";
const barrier = [
    new Wall(487.5, 50, 350, 50, barrierColour),
    new Wall(487.5, 50, 50, 350, barrierColour),
    new Wall(787.5, 50, 50, 350, barrierColour),
    new Wall(487.5, 350, 350, 50, barrierColour)
];
// Which set of walls should we draw/collide?
function wallsIndex() {
    return akvedukto.phase == 10 ? 1 : 0;
}
const akvedukto = {
    // Which phase of akvedukto / the tutorial are you on?
    phase: 0,
    init() {
        document.onkeydown = event => {
            if (scene$3.playing && event.code == "KeyZ") {
                scene$3.progress();
                // The last frame was finished, so the scene is over
                if (!scene$3.playing) {
                    this.phase++;
                    // The attacking dialogue is the only one that follows
                    // another dialogue (introduction)
                    if (this.phase == 1)
                        scene$3 = new Scene(dialogue$3.attacking);
                    if (this.phase == 6) {
                        // Have Frontinus use a 10 * 500ms timer to give extra
                        // time for healing
                        frontinus = new Frontinus(10);
                        frontinus.life.hp = 15;
                    }
                    // Block Claudia in to force healing / dodging
                    // The better option would be to have Frontinus chase you in
                    // a way that makes it impossible to fully escape, but that
                    // would take a huge amount of extra effort
                    if (this.phase == 6 || this.phase == 8)
                        player.y = 300;
                    player.resetInput();
                }
            }
            else if (!scene$3.playing) {
                // Only allow dodging in phase 8 (dodging practice)
                if (event.code == "KeyZ") {
                    if (this.phase == 8)
                        player.fixedKeys(event.code);
                    else
                        return;
                }
                // Other keys are fine as long as the tutorial isn't running
                else if (this.phase != 10)
                    player.fixedKeys(event.code);
                player.handleKey("keydown", event.code);
            }
        };
        document.onkeyup = event => {
            if (!scene$3.playing)
                player.handleKey("keyup", event.code);
        };
        music.reset();
        music.summer_salt.play();
    },
    transitions() {
        // 675 = canvas height - player size
        if (player.y > 675)
            return "Perinthus";
        // 1275 = canvas width - player size
        if (player.x > 1275)
            return "Lerwick";
        return null;
    },
    move(time) {
        // Skip movement during dialogue phases
        if (scene$3.playing)
            return;
        // Frontinus doesn't attack you in phase 2, when you're supposed to be
        // learning the attacking controls
        // Frontinus doesn't attack you in phase 10, when you're done the tutorial
        if (this.phase != 2 && this.phase != 10)
            frontinus.move(time);
        let frontinusBlock = {
            x: frontinus.x,
            y: frontinus.y,
            width: 50,
            height: 50
        };
        // Trapped collision: Frontinus and inner walls
        if (this.phase == 6 || this.phase == 8)
            player.move("fixed", [...barrier, frontinusBlock]);
        // Regular collision: Frontinus and outer walls
        else
            player.move("fixed", [...walls[wallsIndex()], frontinusBlock]);
        // Have the player take damage if Frontinus' sword hits them
        if (frontinus.collision(player.x, player.y)) {
            player.receiveDamage();
            // You were hit on a phase besides 6
            let phaseDefault = player.life.threatened && this.phase != 6;
            // You were hit while threatened on phase 6 (bringing hp down to 0)
            let phaseHealing = player.life.hp == 0 && this.phase == 6;
            // The player messed up in following the instructions, so explain it
            // again for them
            if (phaseDefault || phaseHealing) {
                this.phase--;
                setDialogue();
                resetCombat();
            }
        }
        // Have Frontinus take damage from the player's hits
        if (player.status == "attacking") {
            frontinus.receiveDamage();
            // Frontinus was temporarily defeated, so we can proceed to the next
            // stage of the tutorial
            if (frontinus.life.hp < 1) {
                this.phase++;
                setDialogue();
                resetCombat();
            }
        }
        player.progressCooldowns(time);
    },
    draw() {
        // Background
        c.fillStyle = "floralwhite";
        c.frect(0, 0, 1325, 725);
        c.globalAlpha = 0.2;
        bg.draw();
        c.globalAlpha = 1;
        // Only draw the attack range if you're in combat
        if (this.phase != 10)
            player.drawRange(frontinus.x, frontinus.y);
        player.draw("fixed");
        frontinus.draw();
        for (const wall of walls[wallsIndex()]) {
            wall.draw();
        }
        // Draw Claudia barrier if healing or dodging should be required
        if (this.phase == 6 || this.phase == 8) {
            for (const wall of barrier) {
                wall.draw();
            }
        }
        player.drawCooldowns();
        // Only draw life points if you're in combat (in the tutorial)
        if (this.phase != 10) {
            frontinus.life.draw();
            player.life.draw();
        }
        if (scene$3.playing) {
            scene$3.speech.draw();
            if (scene$3.speaker)
                scene$3.speaker.draw();
        }
    }
};

const RNG$2 = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min;
};
class Powerup {
    constructor() {
        this.x = 662.5;
        this.y = 1100;
        this.activated = false;
        this.newPos();
    }
    newPos() {
        this.x = [220, 662.5, 1100][RNG$2(0, 2)];
        this.y = [120, 362.5, 600][RNG$2(0, 2)];
    }
    draw() {
        // Don't draw if already activated
        if (this.activated)
            return;
        c.fillStyle = "#2b193d";
        c.frect(this.x - 25, this.y - 25, 50, 50);
    }
    doesCollide() {
        let x = this.x - 25;
        let y = this.y - 25;
        let colX = player.x;
        let colY = player.y;
        return (x + 50 > colX &&
            x < colX + 50 &&
            y + 50 > colY &&
            y < colY + 50);
    }
}

const powerup = new Powerup();
/*
elapsed {
    0: timer for movement (x,y manipulatioN)
    1: timer for countdown (attack counter manipulation)
}
*/
const RNG$1 = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min;
};
class Nero extends Enemy {
    constructor() {
        super(637.5, 445, [0, 0], 50, "maroon");
        this.moveStatus = "approaching";
        // Different attack / counter patterns
        this.pattern = 0;
        this.counter = 10;
    }
    retreat() {
        // Move backward every 10 ms
        let threshold = 10;
        while (this.elapsed[0] > threshold) {
            this.elapsed[0] -= threshold;
            let dx = player.x - this.x;
            let dy = player.y - this.y;
            if (Math.abs(dx) > 200 || Math.abs(dy) > 200) {
                this.moveStatus = "waiting";
                this.elapsed[0] = 0;
                return;
            }
            this.x -= 750 / dx;
            this.y -= 750 / dy;
        }
    }
    approach() {
        // Move forward every 10 ms
        let threshold = 10;
        while (this.elapsed[0] > threshold) {
            this.elapsed[0] -= threshold;
            let dx = player.x - this.x;
            let dy = player.y - this.y;
            if (Math.abs(dx) < 75 && Math.abs(dy) < 75) {
                this.moveStatus = "retreating";
                this.elapsed[0] = 0;
                return;
            }
            this.x += dx / 20;
            this.y += dy / 20;
        }
    }
    constraints() {
        if (this.x > 1250)
            this.x = 1250;
        if (this.x < 25)
            this.x = 25;
        if (this.y > 650)
            this.y = 650;
        if (this.y < 25)
            this.y = 25;
        // Teleporting
        if ((this.x == 25 && this.y == 25) ||
            (this.x == 25 && this.y == 650) ||
            (this.x == 1250 && this.y == 650) ||
            (this.x == 1250 && this.y == 25)) {
            this.x = 637.5;
            this.y = 337.5;
        }
    }
    move(time) {
        this.timer("start", time);
        if (this.status == "attack") {
            // We want a 180 degree rotation in 200ms, which means 180/200 = 0.9
            // degrees per millisecond
            this.sword.rotate((time - this.lastFrame) * 0.9);
            // It's done after 200 ms
            if (this.elapsed[1] > 200) {
                this.status = "countdown";
                this.elapsed[1] = 0;
                this.counter = 99;
                this.pattern = Math.round(RNG$1(0, 200) / 100);
                switch (this.pattern) {
                    case 2:
                        this.counter = 99;
                        break;
                    default:
                        this.counter = 10;
                        break;
                }
            }
        }
        else
            this.attackCounter();
        switch (this.moveStatus) {
            case "approaching":
                this.approach();
                break;
            case "retreating":
                this.retreat();
                break;
            case "waiting":
                let threshold = 1000;
                if (this.elapsed[0] > threshold) {
                    this.moveStatus = "approaching";
                    this.elapsed[0] = 0;
                }
                break;
        }
        this.constraints();
        this.timer("end", time);
        // Check for Powerup collision
        if (!powerup.activated && powerup.doesCollide())
            powerup.activated = true;
    }
    // Progress attack coutner
    attackCounter() {
        switch (this.pattern) {
            case 0:
                if (this.elapsed[1] > 200) {
                    this.counter -= 2;
                    this.elapsed[1] = 0;
                    if (this.counter == 0)
                        this.startSwing();
                }
                break;
            case 1:
                if (this.counter >= 10 && this.elapsed[1] > 100) {
                    this.elapsed[1] = 0;
                    this.counter += 9;
                    if (this.counter > 90)
                        this.counter = 3;
                }
                else if (this.counter < 10 && this.elapsed[1] > 250) {
                    this.elapsed[1] = 0;
                    this.counter--;
                    if (this.counter < 1)
                        this.startSwing();
                }
                break;
            case 2:
                if (this.elapsed[1] > 150) {
                    this.elapsed[1] = 0;
                    this.counter -= 9;
                    if (this.counter < 1) {
                        this.counter = 0;
                        this.startSwing();
                    }
                }
                break;
        }
    }
    drawPowerup() {
        powerup.draw();
    }
    receiveDamage() {
        super.receiveDamage();
        // Double damage with a powerup
        if (powerup.activated) {
            super.receiveDamage();
            powerup.activated = false;
            powerup.newPos();
        }
    }
}

// Dialogue inside Nero's house
const dialogue$2 = {
    Mercury: [
        ["Mercury", "Halt!"],
        ["Mercury", "Who dares disturb the slumber of the emperor!"],
        ["Claudia", "I've made 0 dB of sound while you're here yelling across the room."],
        ["Claudia", "Are you familiar with the concept of 'inside vs outside voice'?"],
        ["Mercury", "Are you certain that that's how the decibel system works?"],
        ["Mercury", "How many times have you spoken to Alexander Bell? I'm his best friend."],
        ["Claudia", "He doesn't exist yet. Regardless, Bell Labs made the system."],
        ["Claudia", "Being friends with Alexander doesn't automatically make you an expert."],
        ["Mercury", "Enough deception! You still haven't stated the excuse for your disturbance!"],
        ["Claudia", "I'm here to see Nero. This is his house, right?"],
        ["Mercury", "What gives you the right to visit? Are you aware of the admission policy?"],
        ["Claudia", "Well, I'm Nero's step-sister. Therefore, I can skip your policy."],
        ["Mercury", "Wait, you're Octavia?"],
        ["Claudia", "Y-yes?"],
        ["Mercury", "O-ohh... Then, uh, move on ahead..."],
        ["Mercury", "Btw, after you get banished, start 'preparing'."],
        ["Claudia", "What? From where, and by whom?"],
        ["Mercury", "Actually... never mind, sorry. Good luck."],
        ["Claudia", "...?"]
    ],
    Hector: [
        ["Claudia", "Hey, what's the deal with this mounted armour that you're next to?"],
        ["Claudia", "What's the point of it being here? Is it a display of wealth?"],
        ["Hector", "Uhh, I don't work here. I was just having a nap."],
        ["Claudia", "Oh, sorry for bothering you."],
        ["Hector", "It's fine. I'm used to misfortune."],
        ["Hector", "Anyway, you're right that there's no particular practical purpose."],
        ["Hector", "Usually, it makes more sense for the armour to be stored elsewhere."],
        ["Claudia", "In the armoury?"],
        ["Hector", "Yes, or simply along with the rest of the knight's possessions, in concealed storage."],
        ["Hector", "In the context of this house, I'd assume that its purpose is decorative."],
        ["Claudia", "I see. How come Nero chose to mount it in this room specifically?"],
        ["Claudia", "To me, it makes more sense to maximize the decoration in the very first room."],
        ["Hector", "I think you've had enough answers from me."],
        ["Hector", "Try really taking a stab at the question on your own, okay?"],
        ["Hector", "My only hint would be that Nero might not have been the authority on its location."],
        ["Claudia", "Hmm... okay..."]
    ],
    Serapio: [
        // Wikipedia as a valid source
        ["Serapio", "Hey! You may not pass this room unless you solve my riddle."],
        ["Claudia", "Why?"],
        ["Serapio", "W-why are you asking that? Just solve the riddle or go home, okay?"],
        ["Claudia", "I mean, I can try solving it if you want, but you're not going to convince me that it's mandatory."],
        ["Claudia", "Well, what's the riddle?"],
        ["Serapio", "Prepare for your mind to be puzzled..."],
        ["Serapio", "You will confuse yourself so intensely that tears will fall from your eyes!"],
        ["Claudia", "Just say it already."],
        ["Serapio", "Okay, okay. The riddle... is this:"],
        ["Serapio", "What's a good website for learning about arbitrary topics?"],
        ["Claudia", "..."],
        ["Claudia", "How is that a riddle?"],
        ["Serapio", "Oh? Are you so easily stumped that you need to jump to the 'it's not a riddle' strategy?"],
        ["Claudia", "I mean, I can tell you my opinion on the topic, but that wouldn't 'solve' any riddle."],
        ["Serapio", "...Can you solve it or not?"],
        ["Claudia", "..."],
        ["Claudia", "Wikipedia is a good website for learning."],
        ["Claudia", "It compiles information from many other sources into the same article, making it efficient."],
        ["Claudia", "Subtopics are hyperlinked as they come up, making it easy to discover prerequisites."],
        ["Claudia", "Since it's run by the community, content is dictated by interest rather than financial incentives."],
        ["Serapio", "W-Wikipedia!? No!"],
        ["Claudia", "?"],
        ["Serapio", "B-but, Wikipedia isn't a trusted source! My English teacher said it was bad!"],
        ["Claudia", "Do you blindly take the word of supposed authority as fact?"],
        ["Claudia", "What justification did this teacher have for slandering Wikipedia?"],
        ["Serapio", "Well, a-anybody can edit, right? So there's no c-credibility!"],
        ["Serapio", "I could write blatantly false information myself, and nobody w-would know, r-right?"],
        ["Claudia", "First of all, calm down."],
        ["Claudia", "Second, vandalizing Wikipedia isn't as simple as you describe."],
        ["Claudia", "On Wikipedia, each piece of information is paired with its respective source."],
        ["Claudia", "So, if you wanted to add your own information, you'd need a source to go with it."],
        ["Claudia", "If the source is non-existent or uncredible, your edit would be reverted."],
        ["Serapio", "Wait, really? Who is there to moderate that?"],
        ["Claudia", "As I already said, it's run by the community."],
        ["Claudia", "People like you and me can edit and 'watch' pages for further edits."],
        ["Claudia", "Then, when I see a malicious edit, I can quickly revert it."],
        ["Claudia", "For example, take a look at the edit history of the Enbridge article."],
        ["Serapio", "No... there must be some mistake. There's no way... *Wikipedia*... actually works..."],
        ["Claudia", "It's seeming more and more to me that you're overwhelmingly biased on the topic."],
        ["Claudia", "Why not solve the riddle of your own academic dishonesty before attacking others?"],
        ["Serapio", "..."],
    ],
    Nero: [
        ["Nero", "Wassup?"],
        ["Claudia", "..."],
        ["Claudia", "The ceiling is up."],
        ["Nero", "Oh? You find it funny to bully children?"],
        ["Claudia", "When d-"],
        ["Nero", "Wrong! Lemme give you some truth:"],
        ["Nero", "Your notion of direction is the literal definition of narrow-minded!"],
        ["Nero", "How dare you declare that the ceiling is 'up'?"],
        ["Nero", "You implying that our perspective is significant?"],
        ["Nero", "From the perspective of Musawer's alligators, only the sky is up."],
        ["Claudia", "Have you ever heard of implication before?"],
        ["Claudia", "Your original question, 'What's up?', sta-"],
        ["Nero", "OBJECTION"],
        ["Nero", "My question was 'Wassup?'."],
        ["Claudia", "Okay."],
        ["Claudia", "Our perspective was implied by the fact that you were asking me with no stated context."],
        ["Claudia", "If I enter the room and ask 'Do you have an apple?', do you see what's being implied?"],
        ["Nero", "...That you want an apple?"],
        ["Claudia", "Yes, but you missed the point."],
        ["Claudia", "I'm implying that you, Nero, are responsible for answering."],
        ["Claudia", "You wouldn't then say..."],
        ["Claudia", "'Oh, how narrow-minded of me to assume that the question is intended for me.'"],
        ["Nero", "H-huh?"],
        ["Claudia", "Whatever, I don't care about that anymore."],
        ["Claudia", "Where's your ROM?"],
        ["Nero", "Oh ho! Come for the famous Nero Linux ROM?"],
        ["Claudia", "Please tell me that's rhetorical..."],
        ["Nero", "Well, don't get your hopes up."],
        ["Nero", "What you may not be aware of is that the Nero Linux ROM does not exist as you believe it does."],
        ["Claudia", "Uh, yes it does. My mom said th-"],
        ["Nero", "Wrong! Only I, Nero, exist. To construct the CD-ROM, you would need to burn me alive."],
        ["Claudia", "So your melted organs would turn into data? Why?"],
        ["Nero", "Those are the rules, fool. Therefore, your journey ends here. Be on your way."],
        ["Claudia", "Are you under the impression that I'm under a moral dilemma right now?"],
        ["Nero", "Well, yeah."],
        ["Nero", "Killing me would be morally wrong but favourable for your computer."],
        ["Nero", "Leaving me would be morally right but unfavourable for your computer."],
        ["Nero", "Am I right?"],
        ["Claudia", "Nope. You're the narrow-minded one to assume my moral system."],
        ["Claudia", "Your life holds no inherent value to me."],
        ["Nero", "Huh? Am I talking to Tiberius?"],
        ["Claudia", "Wait, he's a moral relativist?"],
        ["Claudia", "Oh, that reminds me... how does this room exist?"],
        ["Claudia", "Shouldn't it be geometrically impossible?"],
        ["Nero", "Hah. I have no sympathy for fools like you...."],
        ["Nero", "Allowing yourself to be governed by the laws of geometry? PATHETIC"],
        ["Nero", "I've transcended such formalities. I can teleport."],
        ["Nero", "So, the more important discussion is *whether* you can kill me."],
        ["Claudia", "That won't be a problem."],
        ["Claudia", "Nero Claudius Caesar Augustus Germanicus! Prepare for the end of your short life."],
        ["Nero", "Ha ha ha... fool..."],
        ["Nero", "I'm so overflowingly confident in myself that I'll give you a tip."],
        ["Nero", "Around the room, you will encounter purple (#2B193D) squares."],
        ["Nero", "If you pick one up, your next attack will do more damage."],
        ["Nero", "This encourages you to move around the room while fighting instead of staying in the same spot."],
        ["Nero", "It's peak game design, okay?."],
        ["Claudia", "Thanks for making it even easier to kill you, idiot."]
    ]
};

let nero = new Nero();
let wallColour = "maroon";
let objects = [
    // First room
    [
        new Wall(0, 0, 1325, 25, wallColour),
        new Wall(0, 0, 25, 1325, wallColour),
        // Bottom intersection
        new Wall(0, 700, 512.5, 25, wallColour),
        new Wall(812.5, 700, 612.5, 25, wallColour),
        // Right intersection
        new Wall(1300, 0, 25, 212.5, wallColour),
        new Wall(1300, 512.5, 25, 212.5, wallColour)
    ],
    // Second room - entered through the right of first room
    [
        new Wall(0, 700, 1325, 25, wallColour),
        // Left intersection
        new Wall(0, 0, 25, 212.5, wallColour),
        new Wall(0, 512.5, 25, 212.5, wallColour),
        // Top intersection
        new Wall(0, 0, 512.5, 25, wallColour),
        new Wall(812.5, 0, 612.5, 25, wallColour),
        new Wall(1300, 0, 25, 725, wallColour)
    ],
    // Third room - entered through the top of second room
    [
        new Wall(0, 0, 1325, 25, wallColour),
        // Left intersection
        new Wall(0, 0, 25, 212.5, wallColour),
        new Wall(0, 512.5, 25, 212.5, wallColour),
        // Bottom intersection
        new Wall(0, 700, 512.5, 25, wallColour),
        new Wall(812.5, 700, 612.5, 25, wallColour),
        new Wall(1300, 0, 25, 725, wallColour),
        new Img$1("armour", 1075, 60)
    ],
    // Fourth room - entered through the left of third room
    [
        new Wall(0, 0, 25, 1325, wallColour),
        new Wall(0, 0, 1325, 25, wallColour),
        // Right intersection
        new Wall(1300, 0, 25, 212.5, wallColour),
        new Wall(1300, 512.5, 25, 212.5, wallColour),
        // Bottom intersection
        new Wall(0, 700, 512.5, 25, wallColour),
        new Wall(812.5, 700, 612.5, 25, wallColour),
    ],
    // Fifth (Nero's) room - entered through the bottom of the fourth room
    [
        new Wall(0, 0, 25, 725, wallColour),
        new Wall(0, 700, 1325, 25, wallColour),
        new Wall(1300, 0, 25, 725, wallColour),
        // Top intersection
        new Wall(0, 0, 512.5, 25, wallColour),
        new Wall(812.5, 0, 612.5, 25, wallColour),
    ],
    // (Nero's) room - locked
    [
        new Wall(0, 0, 1325, 25, wallColour),
        new Wall(0, 0, 25, 1325, wallColour),
        new Wall(1300, 0, 25, 725, wallColour),
        new Wall(0, 700, 1325, 25, wallColour)
    ]
];
const interactables$2 = [
    [new Interactable$1("Mercury", new Wall(637.5, 337.5, 50, 50, "#776d5a"))],
    [],
    [new Interactable$1("Hector", new Wall(935, 80, 50, 50, "#16db93"))],
    [new Interactable$1("Serapio", new Wall(1100, 600, 50, 50, "#20063b"))],
    [],
    []
];
let prompt$3 = {
    int: interactables$2[0][0],
    active: false,
    box: new MenuOption("=================================================", 0, 0)
};
let scene$2 = new Scene(dialogue$2.Nero);
scene$2.playing = false;
// Generate the collisions array - what physical objects can Claudia collide
// with in the current room?
function genCollisions() {
    let room = neroHouse.room;
    let collisions = [
        ...objects[room],
        ...interactables$2[room].map(int => int.obj)
    ];
    if (room == 5)
        return [
            {
                x: nero.x,
                y: nero.y,
                width: 50,
                height: 50
            },
            ...collisions
        ];
    else
        return collisions;
}
const neroHouse = {
    room: 0,
    gameState: "playing",
    init() {
        document.onkeydown = event => {
            let key = event.code;
            // The player pressed Z to progress the dialogue
            if (key == "KeyZ" && scene$2.playing) {
                scene$2.progress();
                // Progress to fake battle room (5) after fight intro dialogue
                if (!scene$2.playing && neroHouse.room == 4)
                    neroHouse.neroRoomInit();
            }
            // The player entered an interaction prompt with X
            else if (key == "KeyX" && prompt$3.active) {
                prompt$3.active = false;
                scene$2 = new Scene(dialogue$2[prompt$3.int.id]);
            }
            player.handleKey("keydown", key);
        };
        document.onkeyup = event => player.handleKey("keyup", event.code);
        music.reset();
        music.box_15.play();
        // Important resets after a game over
        collisions = genCollisions();
        nero = new Nero();
    },
    neroRoomInit() {
        document.onkeydown = event => {
            player.handleKey("keydown", event.code);
            player.fixedKeys(event.code);
        };
        player.life.hp = 10;
        player.life.threatened = false;
        neroHouse.room = 5;
        collisions = genCollisions();
    },
    locationTransitions() {
        // Claudia left Nero's house back to Lerwick
        // 675 = canvas height - player height
        return player.y > 675 && this.room == 0;
    },
    roomTransitions() {
        let oldRoom = this.room;
        if (this.room == 0 && player.x > 1275) {
            this.room = 1;
            player.x = 0;
        }
        else if (this.room == 1 && player.x < 0) {
            this.room = 0;
            player.x = 1275;
        }
        else if (this.room == 1 && player.y < 0) {
            this.room = 2;
            player.y = 675;
        }
        else if (this.room == 2 && player.x < 0) {
            this.room = 3;
            player.x = 1275;
        }
        else if (this.room == 2 && player.y > 675) {
            this.room = 1;
            player.y = 0;
        }
        else if (this.room == 3 && player.y > 675) {
            this.room = 4;
            player.y = 50;
            scene$2 = new Scene(dialogue$2.Nero);
        }
        else if (this.room == 3 && player.x > 1275) {
            this.room = 2;
            player.x = 0;
        }
        else if (this.room == 4 && player.y < 0) {
            this.room = 3;
            player.y = 675;
        }
        // There was a room switch, so let's update the collisions
        if (oldRoom != this.room)
            collisions = genCollisions();
    },
    move(time) {
        if (this.room == 5)
            this.moveBattle(time);
        else {
            // Only check for scenes outside of battle
            if (!scene$2.playing)
                player.move("fixed", collisions);
            this.roomTransitions();
        }
    },
    moveBattle(time) {
        player.progressCooldowns(time);
        nero.move(time);
        // The first collision is Nero, but the collisions array doesn't keep
        // track of his movement
        /*
        TypeScript isn't smart enough to figure out that if this block is
        running, collisions[0] has to have a .x and .y. But, I don't know how to
        tell it that. Since I'm running out of time, it's easier to just ingore
        these.
        */
        // @ts-ignore
        collisions[0].x = nero.x;
        // @ts-ignore
        collisions[0].y = nero.y;
        if (player.status == "attacking") {
            nero.receiveDamage();
            // You won the game
            if (nero.life.hp < 1) {
                neroHouse.gameState = "win";
                // One-time drawing
                c.fillStyle = "#fff";
                c.frect(0, 0, 1325, 725);
                c.fillStyle = "#000";
                c.font = "48px serif";
                c.text("You win!", 100, 100);
                c.font = "20px serif";
                c.text("You have successfully killed Nero.", 100, 300);
                c.text("But, will you be able to sucessfully burn his body and generate the Linux CD-ROM?", 100, 330);
                c.text("Will you be able to program your GPU driver?", 100, 360);
                c.text("Where was Tiberius? What is moral relativism?", 100, 390);
                c.text("How come the pause key (Backspace) wasn't working?", 100, 420);
                c.text("How come Frontinus said you could replay the tutorial but you actually couldn't without restarting?", 100, 450);
                c.text("Find the answer to these questions in the full version of the game!", 100, 480);
                c.text("Available now! To access, send your parents' credit card numbers to nop04824@xcoxc.com!", 100, 550);
                c.text("Don't forget the expiration date and the three numbers on the back!", 100, 580);
                c.text("I definitely won't make any bank transactions! The game is free!", 100, 610);
            }
        }
        player.move("fixed", collisions);
        // Have the player take damage if Frontinus' sword hits them
        if (nero.collision(player.x, player.y)) {
            player.receiveDamage();
            // Tell steps.ts to render the lose screen
            if (player.life.hp < 1)
                neroHouse.gameState = "lose";
        }
    },
    draw() {
        // Background: floor
        c.fillStyle = "#fcc9b9";
        c.frect(0, 0, 1325, 725);
        player.draw("fixed");
        for (const wall of objects[this.room]) {
            wall.draw();
        }
        // Only worry about interactables outside of the Nero fight
        if (this.room < 5) {
            for (const int of interactables$2[this.room]) {
                int.draw();
            }
            if (!scene$2.playing) {
                let wasSet = false;
                for (const int of interactables$2[this.room]) {
                    if (int.inRange()) {
                        // We only need to update the prompt box if it doesn't exist yet
                        if (!prompt$3.active)
                            prompt$3.box = new MenuOption("Press X to interact.", int.obj.x - 60, int.obj.y - 60);
                        prompt$3.int = int;
                        prompt$3.active = true;
                        wasSet = true;
                    }
                }
                // If none of them are inRange, make sure that no prompt is open
                if (!wasSet)
                    prompt$3.active = false;
            }
            // Show the prompt box if in range
            if (prompt$3.active)
                prompt$3.box.show(false);
            // Show the scene text if it's playing
            if (scene$2.playing) {
                scene$2.speech.draw();
                if (scene$2.speaker)
                    scene$2.speaker.draw();
            }
            // Don't worry about the battle besides the Nero placement, so it
            // doesn't look like Claudia is talking to nothing
            if (this.room == 4)
                nero.draw();
        }
        if (this.room == 5)
            this.drawBattle();
    },
    drawBattle() {
        nero.draw();
        nero.drawPowerup();
        player.drawRange(nero.x, nero.y);
        player.drawCooldowns();
        nero.life.draw();
        player.life.draw();
    }
};
let collisions = genCollisions();

// A "Block" is just a coloured rectangle. Since it's in overworld/, it's meant
// to be placed in the overworld, which is why it keeps scroll(X,Y) in mind.
// There's also the respective fixed/Block.ts for fixed locations.
class Block {
    constructor(x, y, width, height, colour) {
        // So, (0, 0) would be the center of the player
        this.x = x + 662.5;
        this.y = y + 362.5;
        this.width = width;
        this.height = height;
        this.colour = colour;
    }
    draw(scrollX, scrollY) {
        c.fillStyle = this.colour;
        c.frect(this.x - scrollX, this.y - scrollY, this.width, this.height);
    }
}

class Img {
    constructor(id, x, y) {
        this.x = x + 662.5;
        this.y = y + 362.5;
        this.img = document.getElementById(id);
        this.width = this.img.width;
        this.height = this.img.height;
    }
    draw(scrollX, scrollY) {
        c.drawImage(this.img, this.x - scrollX, this.y - scrollY);
    }
}

const RNG = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min;
};
class Grass {
    constructor(x, y) {
        this.elapsed = 0;
        this.threshold = RNG(500, 1000);
        this.lastFrame = Date.now();
        this.x = x;
        this.y = y;
        this.frame = RNG(0, 5);
        this.updateImg();
    }
    move(time) {
        let now = Date.now();
        this.elapsed += now - this.lastFrame;
        // Progress the animation when it passes the threshold we chose
        while (this.elapsed > this.threshold) {
            this.elapsed -= this.threshold;
            this.frame++;
            if (this.frame > 5)
                this.frame = 0;
            this.updateImg();
        }
        this.lastFrame = now;
    }
    draw() {
        this.img.draw(player.x, player.y);
    }
    updateImg() {
        this.img = new Img("grass_" + this.frame, this.x, this.y);
    }
}

class Interactable {
    constructor(id, obj) {
        this.id = id;
        this.obj = obj;
    }
    draw() {
        this.obj.draw(player.x, player.y);
    }
    // Is the player in range to interact?
    inRange() {
        let obj = this.obj;
        let x = obj.x - 662.5 + 25;
        let y = obj.y - 362.5 + 25;
        // Made with the assumption that player is (50, 50) in width and height
        return (player.x > x - 125 &&
            player.x < x + obj.width + 75 &&
            player.y > y - 125 &&
            player.y < y + obj.height + 75);
    }
}

// Interactions in Perinthus
const dialogue$1 = {
    Ovicula: [
        ["Claudia", "Hey, want to know what my position on the theory of mind is?"],
        ["Ovicula", "I don't care. Go away!"]
    ],
    Dorus: [
        ["Claudia", "Hey Dorus, how's it going?"],
        ["Dorus", "Greetings, Claudia. I figured something pretty important out recently."],
        ["Claudia", "Important in what context and for whom?"],
        ["Dorus", "You find that question more interesting than what it is I actually figured out...?"],
        ["Dorus", "I'll keep that brief and say that it's 'important' for *me*, in every sense."],
        ["Claudia", "Okay, well, what is it?"],
        ["Dorus", "First, name a superhuman ability. Please stay intellectually honest this time."],
        ["Claudia", "Sure, sure. Uh, how about the ability to make arbitrary physical objects levitate?"],
        ["Dorus", "Great example! What I've figured out how to do... is just that."],
        ["Claudia", "Huh? What if I had named a totally different ability instead?"],
        ["Claudia", "Surely my words in this moment aren't determining prior events, are they?"],
        ["Dorus", "You're overthinking it. I've figured out *every* ability."],
        ["Dorus", "Therefore, anything you would have stated would apply."],
        ["Claudia", "I've been going along for amusement, but this is starting to sound ridiculous."],
        ["Dorus", "Of course it is."],
        ["Dorus", "However, it all starts with one important concept: one that we can probably agree on."],
        ["Claudia", "Which is...?"],
        ["Dorus", "It's the idea that in practice, our impressions of events are more real than the events themselves."],
        ["Claudia", "Is this something religious? I thought you were against that."],
        ["Claudia", "Just last week you were explaining your anti-Pascal's wager..."],
        ["Dorus", "Don't take this the wrong way. Let me give you an example to clear it up."],
        ["Dorus", "Think about the concept of 'getting rich'."],
        ["Dorus", "It's something almost anybody 'wishes', isn't it?"],
        ["Claudia", "Sure...?"],
        ["Dorus", "Well, why do they actually want to get rich?"],
        ["Dorus", "It's because they believe that being rich will make them happier and more satisfied."],
        ["Dorus", "Right?"],
        ["Claudia", "I can agree that the state of wealth isn't inherently desirable, if that's what you mean."],
        ["Dorus", "Exactly! It's only a means to the actual end of happiness."],
        ["Dorus", "In that sense, being happy without being rich is just as real as actually being rich."],
        ["Claudia", "From the person's perspective, yeah."],
        ["Dorus", "Now, apply that same logic to the concept of superpowers."],
        ["Dorus", "If I really could make objects levitate, why would I ever use it?"],
        ["Claudia", "You'd do it to gain some kind of satisfaction, as the person who strives to be rich does."],
        ["Dorus", "Bingo! Whether it's to impress a person, make an honorable act, simply amuse myself..."],
        ["Dorus", "The levitation's only ultimate purpose, from my perspective, is to bring me happiness."],
        ["Claudia", "And therefore, if you're 'happy', it means you can levitate? Hold on... I object."],
        ["Claudia", "Let's go back to the wealth example."],
        ["Claudia", "Wanting to be rich doesn't mean that your 'happy' state is identical to your 'rich' state."],
        ["Claudia", "I might be a generally happy person, but I could still want to pursue wealth."],
        ["Claudia", "In that case, the wealth isn't necessary for happiness, but it's still a goal."],
        ["Claudia", "One that is *not* met."],
        ["Claudia", "Do you see what I'm saying?"],
        ["Dorus", "Oh ho! I was actually trying to simplify the idea for you."],
        ["Dorus", "You've exceeded my expectations, however. So, let us drop the useless, regressive abstraction."],
        ["Dorus", "Here's the jump:"],
        ["Dorus", "The state's existence is equal to your desire for it, not to your happiness overall."],
        ["Claudia", "So..."],
        ["Dorus", "If I want to be rich, I'm not rich. If I don't care, then I might as well already be rich."],
        ["Claudia", "Then, applied back..."],
        ["Claudia", "If you're 100% content with your lack of superpowers, it's the same as actually having them...?"],
        ["Dorus", "Exactly! It goes for any context!"],
        ["Claudia", "Okay, well there's still the matter of the elephant in the room."],
        ["Claudia", "Is it really true that you're perfectly satisfied with not having superpowers?"],
        ["Claudia", "That would mean that you don't care about your own life, wouldn't it?"],
        ["Dorus", "No, I *do* want superpowers."],
        ["Claudia", "So then it all breaks down! You want to levitate but can't, so you can't!"],
        ["Dorus", "Hold on! What I said was that I figured out *how*..."],
        ["Dorus", "Each aspect of want is psychological, is it not?"],
        ["Dorus", "And I've figured out *how* to control my psychology."],
        ["Dorus", "So, I know how to stop caring about levitating, which means that I've figured out how to levitate."],
        ["Claudia", "And you can apply the same method anywhere?"],
        ["Dorus", "Yes. Take the aversion to death, for example."],
        ["Dorus", "Currently, I fear death, but I'm capable of modifying my psychology in a way that changes that."],
        ["Dorus", "At that point, I'm content no matter if I live or die."],
        ["Claudia", "Okay then, get to the point."],
        ["Claudia", "How is it that you can perfectly control your own psychology?"],
        ["Dorus", "I can't do it perfectly, and I haven't experimented much yet."],
        ["Dorus", "It's mostly theoretical."],
        ["Claudia", "Well, what's the theory, then?"],
        ["Dorus", "That... I won't tell you."],
        ["Claudia", "...."],
        ["Claudia", "Were you just messing with me this whole time?"],
        ["Dorus", "No, I haven't had any intention to deceive."],
        ["Dorus", "I thought you'd be interested in the general idea behind it, which I've already explained."],
        ["Claudia", "But it's all useless if I can't implement it!"],
        ["Dorus", "Here, I'll give you a hint."],
        ["Dorus", "The strategy I've discovered, you already know its name."],
        ["Dorus", "You just don't know that it's its name."],
        ["Dorus", "And of this name, the first two letters are 'Me'."],
        ["Claudia", "Does 'first' imply that it consists of more than two letters?"],
        ["Claudia", "If it's just 'Me', that would be stupid, right?"],
        ["Dorus", "Yes, there are more than two letters."],
        ["Dorus", "Well, go figure it out."],
        [null, "Claudia sighs deeply."],
        ["Claudia", "Goodbye, Dorus."],
        ["Dorus", "Farewell, Claudia. Remember: I wasn't joking."],
    ],
    Palinurus: [
        ["Claudia", "Hey Palinurus. What are you doing?"],
        ["Claudia", "Wait, are you watching... TikTok?"],
        ["Claudia", "Hah, what an awful waste of time."],
        ["Palinurus", "Shut up. You have no right to judge me."],
        ["Claudia", "Think about your life for a second."],
        ["Claudia", "Do you really need to keep using your phone like that?"],
        ["Palinurus", "Shut up! I enjoy it, so I'm going to do it!"],
        [null, "Claudia shakes her head."],
        ["Claudia", "You don't. That's the thing."],
        ["Claudia", "Just delete it already. You will feel better."],
        ["палинурус", "перестань уже беспокоить меня!"],
        ["Claudia", "Switching languages doesn't change reality."],
        ["Claudia", "Whatever. I have better things to do."]
    ]
};

const buildings$1 = [
    // Claudia's house
    new Block(-425, -150, 400, 300, "#bf823e"),
    // Akvedukto
    new Img("akvedukto_overworld", 50, -1150)
];
const interactables$1 = [
    new Interactable("Ovicula", new Block(550, -550, 50, 50, "#f3c13a")),
    new Interactable("Dorus", new Block(175, 1100, 50, 50, "#763568")),
    new Interactable("Palinurus", new Block(-300, 700, 50, 50, "#ebf6f7"))
];
let prompt$2 = {
    int: interactables$1[0],
    active: false,
    box: new MenuOption("=================================================", 0, 0)
};
let scene$1 = new Scene(dialogue$1.Ovicula);
scene$1.playing = false;
const roads$1 = [
    // To claudiaHouse
    new Block(-50, -50, 155, 100, "gray"),
    // Main vertical
    new Block(100, -1000, 200, 2000, "gray")
];
const doors$1 = [
    new Block(-50, -50, 25, 100, "brown"),
    new Block(150, -925, 100, 25, "black")
];
const collision$1 = [
    ...buildings$1,
    ...interactables$1.map(i => i.obj)
];
const grass$1 = [
    new Grass(-11, -500),
    new Grass(525, -72),
    new Grass(500, 500),
    new Grass(-100, 1000)
];
const perinthus = {
    init() {
        document.onkeydown = event => {
            let key = event.code;
            // The player pressed Z to progress the dialogue
            if (key == "KeyZ" && scene$1.playing)
                scene$1.progress();
            // The player entered an interaction prompt with X
            else if (key == "KeyX" && prompt$2.active) {
                prompt$2.active = false;
                scene$1 = new Scene(dialogue$1[prompt$2.int.id]);
            }
            player.handleKey("keydown", key);
        };
        document.onkeyup = event => player.handleKey("keyup", event.code);
        /*
        We shouldn't use music.reset() because there would be an audible cut,
        even if we play() right after. It's better to manually pause Summer Salt
        without touching Beautiful Ruin. Furthermore, we do not have to reset
        Summer Salt's playback position because that would already happen in
        akvedukto's music.reset() call.
        */
        music.summer_salt.pause();
        music.beautiful_ruin.play();
    },
    move(time) {
        if (!scene$1.playing)
            player.move("overworld", collision$1);
        // Progress each grass animation
        for (const g of grass$1) {
            g.move(time);
        }
        // Looping
        if (player.y > 1610)
            player.y = -1640;
        if (player.y < -1640)
            player.y = 1610;
        if (player.x < -1150)
            player.x = 1350;
        if (player.x > 1350)
            player.x = -1150;
    },
    transitions() {
        let x = player.x;
        let y = player.y;
        if (x == 0 && y > -75 && y < 75)
            return "claudiaHouse";
        else if (y == -875 && x > 125 && x < 275)
            return "akvedukto";
        else
            return null;
    },
    draw() {
        c.fillStyle = "#8fbc8f";
        c.frect(0, 0, 1325, 725);
        for (const road of roads$1) {
            road.draw(player.x, player.y);
        }
        for (const building of buildings$1) {
            building.draw(player.x, player.y);
        }
        for (const int of interactables$1) {
            int.draw();
        }
        for (const door of doors$1) {
            door.draw(player.x, player.y);
        }
        for (const g of grass$1) {
            g.draw();
        }
        player.draw("overworld");
        // Check if the player went into any prompt ranges
        if (!scene$1.playing) {
            let wasSet = false;
            for (const int of interactables$1) {
                if (int.inRange()) {
                    // We only need to update the prompt box if it doesn't exist yet
                    if (!prompt$2.active)
                        prompt$2.box = new MenuOption("Press X to interact.", 120, 550);
                    prompt$2.int = int;
                    prompt$2.active = true;
                    wasSet = true;
                }
            }
            // If none of them are inRange, make sure that no prompt is open
            if (!wasSet)
                prompt$2.active = false;
        }
        // Show the prompt box if in range
        if (prompt$2.active)
            prompt$2.box.show(false);
        // Show the scene text if it's playing
        if (scene$1.playing) {
            scene$1.speech.draw();
            if (scene$1.speaker)
                scene$1.speaker.draw();
        }
    }
};
// It's better to bind it outside of the requestAnimationFrame call so that a
// new binding doesn't have to be created every frame
perinthus.draw = perinthus.draw.bind(perinthus);

// Interactions in Lerwick
const dialogue = {
    Calypso: [
        ["Calypso", "Ugh..."],
        ["Calypso", "I'm so lost."],
        ["Claudia", "Physically? I believe you're in Lerwick."],
        ["Calypso", "No, not like that."],
        ["Calypso", "I'm overwhelmed with goals and things to do..."],
        ["Calypso", "How can I ever hope to achieve it all?"],
        ["Claudia", "I'm not your th-"],
        ["Claudia", "Actually... sure, tell me about it."],
        ["Claudia", "What, specifically, are you having trouble with?"],
        ["Calypso", "Well, there are a number of general activities that I want to accomplish."],
        ["Calypso", "I want to play shogi, practice violin, write more of my book, exercise, learn some programming..."],
        ["Calypso", "But I can never seem to make room in my 24 hours."],
        ["Calypso", "How do I go about changing that?"],
        ["Calypso", "Please don't tell me to dream lower..."],
        ["Claudia", "Let me think for a second."],
        [null, "..."],
        ["Claudia", "First of all, what gave you the idea that you *have* to fit it into one day?"],
        ["Calypso", "Huh? Are you not familiar with the concept of microhabits?"],
        ["Calypso", "The idea is to shorten each activity down into a small chunk, which can be performed every day."],
        ["Calypso", "It's not a particularly well-defined term, though. This is my interpretation."],
        ["Claudia", "Well? Are they working? Surely not, if you're in this predicament."],
        [null, "Calypso sighs."],
        ["Calypso", "No, they're not. Half the time, my plans fall apart..."],
        ["Calypso", "The other times, I'm never able to accomplish anything meaningful in any of them."],
        ["Calypso", "Even in the long-term, I'm not making anywhere /close/ to sufficient progress!"],
        ["Calypso", "I don't want to die with my plans unfinished! Why can't I go faster!?"],
        ["Claudia", "From what it sounds like, microhabits are inherently unproductive."],
        ["Calypso", "Wh-what?"],
        ["Claudia", "Are you familiar with the concept of batching?"],
        ["Claudia", "The event of context switching is quite taxing on the human mind."],
        ["Claudia", "So, the most efficient way to complete tasks is through uninterrupted focus."],
        ["Claudia", "Of course, this gets more complicated when you introduce attention span, and so on."],
        ["Claudia", "But that's the general idea."],
        ["Calypso", "Batching, huh? Yeah, I've heard of that. I use that kind of strategy for doing chores."],
        ["Claudia", "Well, then why not apply it to everything?"],
        ["Calypso", "Everything? What..."],
        ["Claudia", "Take your goal of learning programming, for example."],
        ["Claudia", "Why not choose a 'programming' day, where you spend all free time in that day on programming?"],
        ["Claudia", "You'll accomplish far more than if you had spent the same amount of time distributed in tiny periods."],
        ["Calypso", "That's true! Why did I only think of batching in the context of things I 'had' to do?"],
        ["Claudia", "However, you need to be careful in adapting the strategy to the habit."],
        ["Claudia", "Take exercise, for instance."],
        ["Claudia", "One day of batched exercise would be less effective, rather than more effective, wouldn't it?"],
        ["Calypso", "That's also true... what now, then?"],
        ["Claudia", "Well, divide your habits based on their optimal time allocation."],
        ["Claudia", "I'm not particularly familiar with any of the fields you're interested in."],
        ["Claudia", "But, I would guess that writing, programming, and shogi are best done in concentrated time slots."],
        ["Claudia", "On the other hand, violin and exercise need to be distributed."],
        ["Claudia", "I could be wrong, though. You're the expert, so you have to make the decisions."],
        ["Calypso", "Then, how do I decide which to spend time on?"],
        ["Claudia", "Why not continue with the daily habits as daily habits, while pushing the rest to batched days?"],
        ["Claudia", "Today, after finishing your exercise and violin practice, program away the rest of the day."],
        ["Claudia", "Tomorrow, pick something else."],
        ["Calypso", "But how do I decide what to do on which day?"],
        ["Claudia", "Hey, you need to be able to largely figure out your systems on your own."],
        ["Claudia", "I'd use a digital calendar and a frequency-importance schedule."],
        ["Claudia", "But *you* have to do what works best for you."],
        ["Claudia", "Then, reflect on your performance to see what to change and what to stick with."],
        ["Calypso", "You're right. If I can't figure this out, how will I get anywhere?"],
        ["Calypso", "Thank you, stranger."],
        ["Calypso", "I feel a little bit better, and I'll continue to think about applying batching."],
        ["Claudia", "I'm glad I was able to help."]
    ],
    Corculum: [
        ["Corculum", "What's up? You got any money?"],
        ["Claudia", "I have mountains of money."],
        ["Corculum", "Cough it up if you value your life."],
        ["Claudia", "Hey now, you don't need to get violent just yet."],
        ["Claudia", "First, you need to answer an important question."],
        ["Corculum", "Huh? What are you talking about?"],
        ["Claudia", "Think about the supposed number '0.999...'."],
        ["Claudia", "The 9s repeat *infinitely*!"],
        ["Corculum", "What does this have to do with money?"],
        ["Claudia", "Well, this 0.999... number - would it be equal to 1.0?"],
        ["Corculum", "Of course not. It's slightly smaller. What's your point?"],
        ["Claudia", "HAHAH"],
        ["Claudia", "Sorry, got carried away for a second."],
        ["Claudia", "Well, here's the thing. It *is* actually equal to 1.0."],
        ["Corculum", "Are you so rich that you can afford to skip math class? What's with this nonsense?"],
        ["Claudia", "Think about it. I'll give you three example explanations."],
        ["Corculum", "I don't need an explanation! It's obviously wrong!"],
        ["Claudia", "First, consider how we can tell that two numbers are different."],
        ["Claudia", "If we subtract one from the other, and the result is 0, then they're the same."],
        ["Claudia", "5 and 5, for example, are the same number. So, their difference is 0. 5 - 5 = 0."],
        ["Claudia", "5 and 6, for example, are different numbers. So, their difference isn't 0. 6 - 5 = 1."],
        ["Corculum", "That's obvious! I'm past Grade 1, you know."],
        ["Claudia", "Okay, then prove it. Here's the important part."],
        ["Claudia", "What number do you get when you subtract 0.999... from 1?"],
        ["Corculum", "Uh..."],
        ["Claudia", "Spoiler alert: it's 0."],
        ["Corculum", "N-gh! NO! It's not!"],
        ["Claudia", "What is it, then?"],
        ["Corculum", "It's, uh, 0.000... followed by a 1, at the end?"],
        ["Claudia", "And how many 0s are there in that chain?"],
        ["Corculum", "A ton! Millions!"],
        ["Claudia", "Ha ha! No, that's not quite correct."],
        ["Claudia", "'Millions' is nothing in the face of infinity, which is how many 9s there are in 0.999..."],
        ["Claudia", "So, in your 'solution', there should be infinite 0s."],
        ["Corculum", "Okay, well there you have it, then. If you already know, why ask me?"],
        ["Claudia", "No, that's wrong! There *can't* be infinite 0s, because there's a 1 at the end."],
        ["Corculum", "What's wrong with that?"],
        ["Claudia", "What digit would the 1 be at? It can't possibly be there if there are infinite 0s first."],
        ["Corculum", "Your argument is unconvincing. It's obvious to me that 1 - 0.999... = 0.000...1."],
        ["Claudia", "If you can't comprehend that, then let's try something else."],
        ["Claudia", "Think of a variable x, and call it 0.999..."],
        ["Claudia", "Now, we have x = 0.999..."],
        ["Claudia", "Then, multiply both sides by 10."],
        ["Claudia", "We'd have 10x = 9.999..."],
        ["Claudia", "Next, subtract the original equation. Since the values are equal, this equation will continue to be equal."],
        ["Claudia", "We'd get (10x - x) = (9.999... - 0.999...)"],
        ["Claudia", "We're left with 9x = 9."],
        ["Claudia", "Divide both sides by 9, and we get x = 1."],
        ["Corculum", "Oh, wai-"],
        ["Claudia", "But, we initially defined x as 0.999... So, if it's both 1 and 0.999..., it means that the two are equal!"],
        ["Corculum", "No, that doesn't make sense..."],
        ["Corculum", "You must have made some kind of mistake in there."],
        ["Corculum", "I'm not a math professor or anything..."],
        ["Claudia", "(Clearly not.)"],
        ["Corculum", "But you know even less if you think that 0.999... = 1. You must have done some kind of trick."],
        ["Corculum", "Maybe you divided by 0 or something. You can't do that."],
        ["Claudia", "Do you have amnesia as well? I divided by 9, not 0."],
        ["Corculum", "Ugh! Stop trying to confuse me! It's not true!"],
        ["Claudia", "Fine, here's one more."],
        ["Corculum", "Enough already..."],
        ["Claudia", "Don't worry, it's a simple one. You like simple, don't you? It must be familiar."],
        ["Corculum", "Stop..."],
        ["Claudia", "Consider the fraction 1/3."],
        ["Claudia", "When you multiply by 3, you get 1/3 * 3 = 1, simply through the definition of a reciprocal."],
        ["Claudia", "But, what's the decimal form of 1/3? It's 0.333..."],
        ["Claudia", "And, what happens when you multiply 0.333... by 3? You get 0.999..., which hence has to equal 1."],
        ["Corculum", "No, that can't be right. 0.333... * 3 must be 1.0, not 0.999."],
        ["Claudia", "Are you even listening to yourself?"],
        ["Corculum", "Or, or, maybe 0.333... isn't actually equal to 1/3. It's slightly too small..."],
        ["Claudia", "That's false too. What else would it be equal to?"],
        ["Claudia", "Something like 0.333... + ϵ? That doesn't make any sense if you understand how infinitesimals work."],
        ["Corculum", "Just... stop... I don't care anymore. Just leave."],
        ["Claudia", "Do you still want my money?"],
        ["Corculum", "No! I never want to see your face again!"],
        ["Claudia", "Have a good rest of your day."]
    ],
    Althea: [
        ["Althea", "Is there any real worth in learning a new language?"],
        ["Claudia", "Before the real clarification question comes, we need to clear up some context."],
        ["Claudia", "Well, what do you define as 'worth'?"],
        ["Claudia", "If it's completely subjective, how can you expect me to answer for you?"],
        ["Althea", "I'm talking about practical applications."],
        ["Claudia", "That idea is still kind of blurry..."],
        ["Claudia", "Can doing something for the sake of enjoyment and amusement..."],
        ["Claudia", "...really be deemed 'practical' or 'impractical'?"],
        ["Claudia", "Still, I think I generally understand what you're talking about."],
        ["Althea", "Hopefully."],
        ["Althea", "It seems..."],
        ["Althea", "...You haven't heard the word 'practical' used in enough contexts to intuitively grasp the meaning."],
        ["Claudia", "Regardless, there are other clarification questions."],
        ["Claudia", "Is this hypothetical language-learner already fluent in English?"],
        ["Claudia", "What about their country's language?"],
        ["Althea", "Are you implying that English is more or less 'worth' learning than an arbitrary other language?"],
        ["Claudia", "Of course I am."],
        ["Claudia", "English is easily the most practical language to learn in terms of business opportunities."],
        ["Claudia", "This is such an obvious point... there's no way you disagree, right?"],
        ["Althea", "No, I was just wondering."],
        ["Althea", "Anyway, let's say that it's a person who speaks English and lives here in Lerwick."],
        ["Althea", "(...where English is the predominant language.)"],
        ["Althea", "No other language around here would provide significant 'business opportunities', as you put it."],
        ["Althea", "So, is it worth learning for them?"],
        ["Claudia", "That's slightly different from your original question."],
        ["Claudia", "I guess it'd be hypocritical to say otherwise, though, considering that I'm already learning Rust."],
        ["Althea", "Rust is n-"],
        ["Claudia", "You're mistaken. Anyway, the point is that I still do it 'for fun'."],
        ["Claudia", "Do you consider that as 'worth'?"],
        ["Althea", "Hey, I brought up the topic theoretically."],
        ["Althea", "If you're crazy enough to actually partake in the activity..."],
        ["Althea", "...there's another side I'm more interested in."],
        ["Claudia", "You want me to elaborate on why I want to understand Rust?"],
        ["Althea", "No, I wanted to know what you're doing to learn Rust, and whether or not it's effective."],
        ["Claudia", "Well, I do what any language-learner does."],
        ["Claudia", "I memorize grammar and vocabulary from my Rust textbook."],
        ["Claudia", "Then, I practice making up sentences."],
        ["Althea", "And how often do you read native Rust material?"],
        ["Claudia", "Huh? Why would I do something like that? I'm not very good yet, so I wouldn't understand most of it."],
        [null, "Althea puts on a concerned, disappointed look."],
        ["Althea", "And how is that going for you?"],
        ["Claudia", "It's going great. I now know 300 words and recently passed the RLPT N5."],
        ["Althea", "Take a step back."],
        ["Althea", "Do you realize that your efforts, currently, are largely futile?"],
        ["Claudia", "What do you mean? I just cited my decent RLPT performance..."],
        ["Althea", "No, you're seeing it all wrong."],
        ["Althea", "Your final goal is to be fluent in Rust."],
        ["Althea", "So, it makes sense to measure success in fluency in Rust, right?"],
        ["Claudia", "That's what I did..."],
        ["Althea", "No, no you didn't. First, what do we mean by 'fluency'?"],
        ["Claudia", "There are different aspects, each of which I'm striving for..."],
        ["Althea", "That's right."],
        ["Althea", "Fundamentally, the four broader categories are reading, writing, speaking, and listening."],
        ["Althea", "The better you can do these, the more fluent you are, and the more successful your method has been."],
        ["Althea", "Now, what did RLPT measure?"],
        ["Claudia", "It measured reading, listening, and a bit of writing?"],
        ["Althea", "No, that's not true. In reality, it measured none of them."],
        ["Claudia", "...?"],
        ["Althea", "Think back to the format of the test. The key point is that none of the material was *natural*."],
        ["Claudia", "What do you mean by 'natural', and why is it significant?"],
        ["Althea", "I mean that all the language used as part of the test is fake."],
        ["Althea", "It's made for a learner taking the test, not for a native speaker of Rust."],
        ["Claudia", "So? I still passed."],
        ["Althea", "What you passed wasn't a test on real Rust, but a test on test Rust."],
        ["Althea", "Are you getting this or do you need me to explain it again?"],
        ["Claudia", "Oh, I think I see what you mean."],
        ["Claudia", "But, you're implying that 'test Rust' is somehow completely different from 'real Rust'."],
        ["Claudia", "I'm assuming that native Rust speakers still wrote the test, so how can that be?"],
        ["Althea", "The distinction is greater than you would think. Real speech can't simply be crafted on paper."],
        ["Claudia", "But can you prove that?"],
        ["Althea", "Take a real, native book that is written in Rust. How much can you understand?"],
        ["Claudia", "Where can I g-"],
        [null, "Althea hands Claudia a sturdy pocketbook with a crab on the cover."],
        [null, "Claudia riffles through the book, seeming puzzled."],
        ["Claudia", "It doesn't look familiar at all."],
        ["Claudia", "Oh, wait, there's a word I know."],
        ["Claudia", "That one means that the following paragraph is unsafe."],
        [null, "Claudia hands Althea back the book."],
        ["Althea", "fn factorial(i: u64) -> u64 {"],
        ["Althea", "    (2..=i).product()"],
        ["Althea", "}"],
        ["Claudia", "Uhh, what was that?"],
        ["Althea", "That was *real* Rust, which you've never even heard before!"],
        ["Claudia", "Wait, you know the language?"],
        ["Althea", "Of course! I grew up with it!"],
        ["Althea", "That's why it pains me to see you hoping to learn but going nowhere."],
        ["Claudia", "Uh, how about this?"],
        ["Claudia", "use std::ops::Add"],
        ["Claudia", "That's my favourite line."],
        ["Althea", "See? Even in such a short sentence, you've already made a terrible mistake."],
        ["Claudia", "Are you sure you know what you're talking about?"],
        ["Claudia", "How come other Rust speakers have complimented me in the past?"],
        ["Althea", "That's because they want to encourage you! You're not actually good at all!"],
        ["Claudia", "W-what? No, they swore that I was good."],
        ["Althea", "That's just the polite nature of the Rust culture! Get over yourself, Claudia!"],
        ["Claudia", "Okay, okay. I've heard enough of your complaining."],
        ["Claudia", "What, then, do *you* think is the better way to learn?"],
        ["Althea", "Well, think about your own experience."],
        ["Althea", "You've failed to learn Rust with this 'skill building' method, but you *have* had success in the past."],
        ["Claudia", "When? What are you talking about?"],
        ["Althea", "What other language you have already learned? One where you *did* reach fluency?"],
        ["Claudia", "Hmmm..."],
        ["Claudia", "I genuinely don't know. How would you if I don't?"],
        ["Althea", "Because I can hear it! You've learned English!"],
        ["Claudia", "English? But that's..."],
        ["Claudia", "I learned it when I was still a baby. I don't even know how, and nobody can learn like that again..."],
        ["Althea", "As a baby, you learned through massive input!"],
        ["Althea", "All day, you would be hearing the English of your surroundings."],
        ["Althea", "While this is happening, your brain would be finding patterns."],
        ["Althea", "That way, you built an intuitive model of the language."],
        ["Claudia", "But I've lost that language pattern ability. I'm not a baby anymore."],
        ["Althea", "What makes you think you've lost it?"],
        ["Claudia", "You said it yourself! I'm failing to learn Rust."],
        ["Althea", "You missed the idea completely."],
        ["Althea", "As a baby, you learned through input. But you're not learning Rust through input."],
        ["Althea", "So, how do you know that you're incapable of learning through input?"],
        ["Claudia", "Oh... then..."],
        ["Althea", "Exactly: you have no answer, because you have no reason to think you're incapable."],
        ["Claudia", "So, what, then? I just have to hear a bit of Rust?"],
        ["Althea", "Not 'a bit'. You need thousands of hours of Rust."],
        ["Claudia", "Thousands of hours? W-What?"],
        ["Claudia", "Also, wait. I've been picking up English for many years..."],
        ["Claudia", "You want me to spend that long on Rust?"],
        ["Althea", "First off, I did not misspeak when I said that you would need thousands of hours."],
        ["Althea", "That's simply the nature of fluency. If you don't like it, then don't waste your time."],
        ["Althea", "Where do you think my question about worth at the start came from?"],
        ["Althea", "Besides, you said yourself that you enjoy it. So, I don't see what the problem is."],
        ["Althea", "Next, you don't need to spend as long learning it as native speakers do."],
        ["Claudia", "But they learned through input, and you want me to learn through input..."],
        ["Althea", "Learning through input alone works, but it's not very efficient."],
        ["Althea", "So, you need to supplement it with conscious study, as you've been doing."],
        ["Claudia", "Wait, what? But you just spent the last ten hours dunking on what I've been doing."],
        ["Althea", "The problem wasn't that you were doing conscious study."],
        ["Althea", "The problem is that it was the *only* study you were doing."],
        ["Althea", "Most of your time has to be dedicated to input."],
        ["Claudia", "I still have many questions..."],
        ["Claudia", "Can I hear about people who have learned through input successfully?"],
        ["Claudia", "What kinds of conscious study are most efficient?"],
        ["Claudia", "What kind of input is more efficient?"],
        ["Claudia", "What do I actually start doing today if I want to learn Rust?"],
        ["Claudia", "How can I review the method without talking to you again?"],
        ["Althea", "Well, it seems like you're interested in learning more, so I will redirect you."],
        ["Althea", "If you are actually interested in learning a language, check out the website https://refold.la."],
        ["Claudia", "Refold? Is this some kind of sponsor?"],
        ["Althea", "No. I'm not at all affiliated."],
        ["Althea", "The reason I'm promoting Refold is because I believe it can help you."],
        ["Althea", "If you tell somebody that drinking water for optimal hydration is a good idea..."],
        ["Althea", "...Does it mean that you are suddenly sponsored by water?"],
        ["Claudia", "Well, 'water' itself is not an actual brand or organization, but I get your point."],
        ["Claudia", "Thank you for informing me."],
        ["Claudia", "After I install Nero Linux, I'll check it out."],
        ["Althea", "Of course. Thank you for your interest in Rust."]
    ],
    Daria: [
        ["Daria", "Good evening, traveler."],
        ["Daria", "Are you here to expel my financial issues?"],
        ["Claudia", "In the context of coming to Lerwick in general, no."],
        ["Claudia", "But in this moment, I'm interested in what's going on."],
        ["Daria", "I'm overjoyed to hear your tolerance of support!"],
        ["Daria", "My earnings have found their way to a measly $0.50 per day."],
        ["Claudia", "Judging from the inflation rates, I know the purchasing power of $0.50."],
        ["Daria", "How convenient! You must be in the know, as it is, that I seem enviable!"],
        ["Claudia", "In terms of income, sure...?"],
        ["Claudia", "Where's the problem?"],
        ["Daria", "The source of my discontent, I'm afraid, is the future."],
        ["Daria", "This grueling job I endure... it's burning me alive."],
        ["Claudia", "I'm going to go ahead and assume that's figurative."],
        ["Daria", "Quite soon, I will be incapable of continuing my ascent up the mountain."],
        ["Daria", "When that time comes knocking, I will fall."],
        ["Daria", "And this fall... will last too long, but not long enough."],
        ["Daria", "Additionally, the base of the mountain is solid rock."],
        ["Daria", "My brittle bones will shatter quickly."],
        ["Daria", "The only thing left will be a puddle of missed opportunities."],
        ["Daria", "In that moment, I will have no choice but to accept the death of everything I hold dear."],
        ["Claudia", "Hmm..."],
        ["Claudia", "Well, you have two options. The first is to significantly extend your ascent."],
        ["Claudia", "Then, you would hopefully suffocate before you hit the rock."],
        ["Daria", "How can you expect me to agree to that?"],
        ["Claudia", "The other, more favourable option, is to start climbing down."],
        ["Claudia", "Once you're sufficiently low in altitude, jump into the grass, not the rock."],
        ["Daria", "But where would the cushion of grass appear from? I am no Dorus..."],
        ["Claudia", "The grass comes from special magic called 'investing'."],
        ["Daria", "Investing? I beg you, enlighten me."],
        ["Claudia", "Right now, where are your savings sitting?"],
        ["Daria", "They reside in my Asiagenus bank account."],
        ["Daria", "The interest rate is 0.0001%: much more pleasing than the Glaber bank's 0.000099%."],
        ["Claudia", "Essentially, your money is not gaining value. But is it losing value?"],
        ["Daria", "I'm afraid so. This year's inflation rate has revealed itself as a 7%!"],
        ["Claudia", "Wait, actually? That's higher than I thought."],
        ["Claudia", "Anyway, it should usually be around 2.5%. Your 0.0% bank interest cannot help."],
        ["Daria", "But it remains much higher than Glaber's!"],
        ["Claudia", "That doesn't matter. Stop comparing garbage to garbage."],
        ["Daria", "You dare insult Asiagenus!?"],
        ["Claudia", "Instead, you need a much higher return."],
        ["Claudia", "This way, you can not only match inflation but surpass it, making a profit."],
        ["Claudia", "Then, you can keep earning without 'enduring' your 'grueling job'."],
        ["Daria", "Of course, the fantasy appears pleasant."],
        ["Daria", "But, a higher return than 0.0001%? Don't tell jokes, now!"],
        ["Claudia", "I mean it genuinely. You can invest in the stock market!"],
        [null, "Daria gasps forcefully."],
        ["Daria", "T-the, the s-stock market? No!"],
        ["Claudia", "Why do you seem so averse?"],
        ["Daria", "Even poor Daria understands that the selection of individual stocks is a mere delusion!"],
        ["Daria", "You cannot time any market, even that of Lerwick!"],
        ["Claudia", "I agree with your impressions of investing. However, you've failed to acknowledge something."],
        ["Claudia", "There exists a specific investment known as an 'index fund'."],
        ["Daria", "Index fund? What kind of nonsense are you spouting?"],
        ["Claudia", "None, for the words I speak reflect the truth of reality."],
        ["Claudia", "An index fund is an algorithmic selection of stocks."],
        ["Claudia", "Generally, the idea is to maximize diversification across the market."],
        ["Claudia", "Then, if certain companies go up or down in the short-term, it's fine."],
        ["Claudia", "...so long as your market increases in the long-term."],
        ["Daria", "Which index fund, then, could you be referring to?"],
        ["Claudia", "It's true that there are many different implementations."],
        ["Claudia", "My personal recommendation is the S&P 500 index."],
        ["Claudia", "There are different trackers of it, like the VOO."],
        ["Daria", "But how is the S&P 500 formed?"],
        ["Claudia", "The top 500 companies in the United States are gathered for the index."],
        ["Claudia", "The bigger the company, the higher the stake."],
        ["Daria", "Which god decides whether a company is 'big', or is bigger than another?"],
        ["Claudia", "I'm not sure what the exact process is. I'd assume it's based on market cap?"],
        ["Claudia", "(That answers the second question. The first question is irrelevant.)"],
        ["Daria", "This news is largely cherishable, but I am yet to be sold..."],
        ["Daria", "Why the top 500 and not 400, 600, 100, or 99999?"],
        ["Daria", "Why does it focus on the US market? What's so special there?"],
        ["Daria", "If this will net me a great return, why has it not already been explained?"],
        ["Daria", "If anybody can earn, what results in the communal following of this idea?"],
        ["Daria", "Where does the money creep out from under? Is somebody falling so that I can climb?"],
        ["Daria", "My dog told me that the economy was a zero-sum game, which is the case, is it not?"],
        ["Claudia", "Uhh... well, historically..."],
        ["Daria", "W-wait, could it be? You're flustered by such simple questions?"],
        ["Claudia", "I mean, I've already told you the gener-"],
        ["Daria", "If your cluelessness reaches such heights, why did you bother in the first place?"],
        ["Daria", "How can you teach what you do not understand yourself?"],
        ["Claudia", "Come on, surely this has be-"],
        ["Daria", "I hereby declare your input 'ignorable'."],
        ["Daria", "Next time you talk to somebody, consider the idea that their time should be respected."],
        ["Daria", "Now, leave."],
        ["Claudia", "..."],
    ],
    Musawer: [
        ["Musawer", "Hey, is it hard for you to memorize the cosine law?"],
        ["Claudia", "Yes, actually. I keep confusing the variables."],
        ["Musawer", "Well, do I have the mnemonic for you!"],
        ["Musawer", "Consider this *amazing* story:"],
        ["Musawer", "Crocodile squared..."],
        ["Musawer", "Is equal to alligator squared plus bread squared..."],
        ["Musawer", "minus two alligator breads..."],
        ["Musawer", "at the cost of Cows."],
        ["Claudia", "..."],
        ["Claudia", "Whoa..."],
        ["Claudia", "That resonates with me on a spiritual level."],
        ["Claudia", "It's ingrained in every pocket of my mind, permanently."],
        ["Claudia", "Thank you, Musawer."],
        ["Claudia", "I just have one question..."],
        ["Claudia", "By what process did you reach this divine revelation?"],
        ["Musawer", "Oh, you know, I was just doing my daily routine of fighting alligators with my bare hands."],
        ["Musawer", "When I first started, I was very afraid of the alligators."],
        ["Musawer", "But now... the alligators are afraid of me."],
        ["Musawer", "This climate, however, houses both alligators and crocodiles."],
        ["Musawer", "So, I made bread from the alligators and fed it to the crocodiles."],
        ["Claudia", "And how did they respond?"],
        ["Musawer", "The crocodiles, they sang a song of joy as they drowned."],
        ["Musawer", "When I listened closely, I heard the trigonometric functions in the form of audio signals."],
        ["Musawer", "This endowed me with the godly mnemonic."],
        ["Claudia", "Interesting..."],
        ["Claudia", "I'll have to try this alligator bread sometime."],
        ["Claudia", "Maybe Frontinus has some..."]
    ],
    Hera: [
        ["Claudia", "Wait, how does this work?"],
        ["Claudia", "I entered Nova Anio-akvedukto from the bottom..."],
        ["Claudia", "But now, my home town of Perinthus is nowhere to be seen..."],
        ["Hera", "It's just a game, friend. Don't think about it too much."],
        ["Claudia", "Is that the official answer? How lazy, irresponsible, uncreative, etc."],
        ["Hera", "Are you dissatisfied? Would you rather a complex gating system be used?"],
        ["Claudia", "Of course. Consistency is the essence of greatness."],
        ["Hera", "Interesting perspective, you have there. One day, it will bring you much greater disappointment."],
        ["Hera", "The geometry of Lerwick will be nothing compared to that."],
        ["Claudia", "Sure..."]
    ]
};

const buildings = [
    // Akvedukto
    new Img("akvedukto_overworld", -330, -125),
    // Nero's house
    new Block(700, -1300, 400, 300, "maroon"),
    // Tiberius's house
    new Block(1850, -650, 300, 400, "#c3272b")
];
const roads = [
    // 1. Connecting to Akvedukto and 2
    new Block(-50, -50, 1000, 100, "gray"),
    // 2. Connecting to Nero, 1, and 3
    new Block(850, -1000, 100, 1000, "gray"),
    // 3. Conencting to 2 and Tiberius
    new Block(850, -500, 1000, 100, "gray")
];
const doors = [
    // Akvedukto
    new Block(-55, -50, 25, 100, "black"),
    // Nero's house
    new Block(850, -1025, 100, 25, "brown"),
    // Tiberius's house
    new Block(1850, -500, 25, 100, "brown")
];
const interactables = [
    new Interactable("Hera", new Block(-185, 285, 50, 50, "#171412")),
    new Interactable("Musawer", new Block(550, -1200, 50, 50, "#c91f37")),
    new Interactable("Daria", new Block(1100, -275, 50, 50, "#817b69")),
    new Interactable("Althea", new Block(1725, -600, 50, 50, "#374231")),
    new Interactable("Corculum", new Block(910, -1400, 50, 50, "#d9b611"))
];
let prompt$1 = {
    int: interactables[0],
    active: false,
    box: new MenuOption("=================================================", 0, 0)
};
let scene = new Scene(dialogue.Musawer);
scene.playing = false;
const collision = [
    ...interactables.map(int => int.obj),
    ...buildings
];
const grass = [
    new Grass(430, 215),
    new Grass(710, -640),
    new Grass(1420, -745),
    new Grass(1710, -300)
];
const lerwick = {
    init() {
        document.onkeydown = event => {
            let key = event.code;
            // The player pressed Z to progress the dialogue
            if (key == "KeyZ" && scene.playing)
                scene.progress();
            // The player entered an interaction prompt with X
            else if (key == "KeyX" && prompt$1.active) {
                prompt$1.active = false;
                scene = new Scene(dialogue[prompt$1.int.id]);
            }
            player.handleKey("keydown", key);
        };
        document.onkeyup = event => player.handleKey("keyup", event.code);
        music.reset();
        music.beautiful_dead.play();
    },
    transitions() {
        let x = player.x;
        let y = player.y;
        if (y == -975 && x > 825 && x < 975)
            return "neroHouse";
        if (x == -5 && y > -75 && y < 75)
            return "akvedukto";
        /*
        if (x == 1825 && y > -525 && y < -370)
            return "tiberiusHouse"
        */
        else
            return null;
    },
    move(time) {
        if (!scene.playing)
            player.move("overworld", collision);
        for (const g of grass) {
            g.move(time);
        }
        // Looping
        if (player.y > 730)
            player.y = -1880;
        if (player.y < -1880)
            player.y = 730;
        if (player.x < -1020)
            player.x = 2950;
        if (player.x > 2950)
            player.x = -1020;
    },
    draw() {
        c.fillStyle = "#ff8936";
        c.frect(0, 0, 1325, 725);
        for (const road of roads) {
            road.draw(player.x, player.y);
        }
        for (const building of buildings) {
            building.draw(player.x, player.y);
        }
        for (const door of doors) {
            door.draw(player.x, player.y);
        }
        for (const int of interactables) {
            int.draw();
        }
        for (const g of grass) {
            g.draw();
        }
        player.draw("overworld");
        if (!scene.playing) {
            let wasSet = false;
            for (const int of interactables) {
                if (int.inRange()) {
                    // We only need to update the prompt box if it doesn't exist yet
                    if (!prompt$1.active)
                        prompt$1.box = new MenuOption("Press X to interact.", 120, 550);
                    prompt$1.int = int;
                    prompt$1.active = true;
                    wasSet = true;
                }
            }
            // If none of them are inRange, make sure that no prompt is open
            if (!wasSet)
                prompt$1.active = false;
        }
        // Show the prompt box if in range
        if (prompt$1.active)
            prompt$1.box.show(false);
        // Show the scene text if it's playing
        if (scene.playing) {
            scene.speech.draw();
            if (scene.speaker)
                scene.speaker.draw();
        }
    }
};

const steps = {
    mainMenu() {
        mainMenu.draw();
        if (mainMenu.screen == "Claudia's house") {
            claudiaHouse.init();
            window.requestAnimationFrame(this.claudiaHouse);
        }
        else
            window.requestAnimationFrame(this.mainMenu);
    },
    claudiaHouse() {
        claudiaHouse.move();
        claudiaHouse.draw();
        // If the transitions function determines that we can transition to
        // perinthus, we should do so here. We can't run perinthus.init() inside
        // claudiaHouse.ts or else we'd end up with a dependency cycle.
        // Keeping the logic separated like this is kind of messy but it's the
        // best way, from what I can see. I'd otherwise have to keep much more
        // of the code in the same .ts file, which is even messier.
        if (claudiaHouse.transitions()) {
            perinthus.init();
            player.x = 5;
            player.y = 0;
            window.requestAnimationFrame(this.perinthus);
        }
        else
            window.requestAnimationFrame(this.claudiaHouse);
    },
    perinthus(time) {
        perinthus.move(time);
        perinthus.draw();
        switch (perinthus.transitions()) {
            case null:
                // No transition, so we render perinthus again
                window.requestAnimationFrame(this.perinthus);
                break;
            case "claudiaHouse":
                claudiaHouse.init();
                player.x = 1270;
                player.y = 337.5;
                window.requestAnimationFrame(this.claudiaHouse);
                break;
            case "akvedukto":
                akvedukto.init();
                player.x = 637.5;
                player.y = 670;
                window.requestAnimationFrame(this.akvedukto);
                break;
        }
    },
    akvedukto(time) {
        akvedukto.move(time);
        akvedukto.draw();
        switch (akvedukto.transitions()) {
            case null:
                window.requestAnimationFrame(this.akvedukto);
                break;
            case "Perinthus":
                perinthus.init();
                player.x = 200;
                player.y = -870;
                window.requestAnimationFrame(this.perinthus);
                break;
            case "Lerwick":
                lerwick.init();
                player.x = 0;
                player.y = 0;
                window.requestAnimationFrame(this.lerwick);
                break;
        }
    },
    lerwick(time) {
        lerwick.move(time);
        lerwick.draw();
        switch (lerwick.transitions()) {
            case null:
                window.requestAnimationFrame(this.lerwick);
                break;
            case "akvedukto":
                akvedukto.init();
                player.x = 1270;
                player.y = 337.5;
                window.requestAnimationFrame(this.akvedukto);
                break;
            case "neroHouse":
                neroHouse.init();
                player.x = 637.5;
                player.y = 670;
                window.requestAnimationFrame(this.neroHouse);
                break;
        }
    },
    gameOver() {
        if (neroHouse.gameState == "playing")
            return;
        c.fillStyle = "#000";
        c.frect(0, 0, 1325, 725);
        c.font = "48px serif";
        c.fillStyle = "red";
        c.text("YOU DIED", 100, 100);
        c.font = "20px serif";
        c.fillStyle = "white";
        c.text("Nero has killed you! Are you this bad at video games?", 100, 200);
        c.text("Just log off if you're not even going to try.", 100, 230);
        c.text("Installing Linux is only for real gamers.", 100, 260);
        c.text("Press Space to reset back before the fight to try again...", 100, 350);
    },
    neroHouse(time) {
        neroHouse.move(time);
        if (neroHouse.gameState == "win")
            return;
        if (neroHouse.gameState == "lose") {
            window.requestAnimationFrame(this.gameOver);
            // Space to try again
            document.onkeydown = function (event) {
                if (event.code == "Space") {
                    neroHouse.gameState = "playing";
                    neroHouse.room = 3;
                    neroHouse.init();
                    player.x = 637.5;
                    player.y = 670;
                    window.requestAnimationFrame(steps.neroHouse);
                }
            };
            // Reset cooldowns - this is important so that the healing cooldown
            // isn't active. Otherwise, after pressing Space to return to the game,
            // you'll be stuck with slower movement speed
            player.resetCooldowns();
            return;
        }
        neroHouse.draw();
        // Transition back to Lerwick
        if (neroHouse.locationTransitions()) {
            lerwick.init();
            player.x = 900;
            player.y = -970;
            window.requestAnimationFrame(this.lerwick);
        }
        else
            window.requestAnimationFrame(this.neroHouse);
    }
};
// Bind each "this" to "steps"
for (const step of Object.keys(steps)) {
    steps[step] = steps[step].bind(steps);
}

/*
Name: Michael Skyba, Malfacile Gajnita Savo
*/
document.getElementById("load").onclick = () => {
    mainMenu.init();
    window.requestAnimationFrame(steps.mainMenu);
    // Hide load button
    document.getElementById("load").style.display = "none";
};
