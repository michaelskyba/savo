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
        c.strokeStyle = "black";
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
        super(text, x, y, 30, "serif", "purple", "white");
    }
    // We can't call it "draw" or it would violate TypeScript
    // If we didn't have the boolean variable, I could name it "draw" and then
    // use super.draw() to call the superclass's draw.
    show(selected) {
        this.bgColour = selected ? "purple" : "white";
        this.fgColour = selected ? "white" : "black";
        this.draw();
    }
}

// 0: Not threatened
// 1: Threatened
let bg = ["#fff", "#ff0000"];
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
        this.bgColour = bg[colIdx];
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
        c.fillStyle = "blue";
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
            c.fillStyle = "blue";
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

class Wall {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw() {
        c.fillStyle = "red";
        c.frect(this.x, this.y, this.width, this.height);
    }
}

// Inside Claudia's house at the start of the game
const dialogue$1 = {
    main: [
        [null, "Natasha Rostova attends her first formal ball and dances with Pierre Bezukhov:"],
        ["Natasha", "Pierre, isn't that grease on your collar?"],
        ["Pierre", "Oh my! How could I miss such a terrible flaw in my costume? I'm totally destroyed!"],
        [null, "(He retreats in shame.)"],
        [null, "Then, she dances with Kniaz Bolkonsky:"],
        ["Natasha", "Andrew, isn't there a spot of sauce on your tunic?"],
        [null, "(He faints.)"],
        [null, "Finally, she's dancing with Rzhevsky:"],
        ["Natasha", "Poruchik, your boots are all covered in mud!"],
        ["Rzhevsky", "It's not mud, it's shit. Don't worry, mademoiselle, it'll fall off once it dries up."]
    ],
    repeat: []
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
            this.speaker = new TextBox(line[0], 50, 550, 30, "serif", "black", "white");
        else
            this.speaker = null;
        this.speech = new TextBox(line[1], 50, 600, 30, "serif", "white", "black");
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

const scene$1 = new Scene(dialogue$1.main);
const walls = [
    [
        new Wall(0, 0, 1325, 25),
        new Wall(0, 0, 25, 1325),
        new Wall(0, 700, 1325, 25),
        new Wall(1300, 0, 25, 262.5),
        new Wall(1300, 462.5, 25, 262.5)
    ],
    [
        new Wall(0, 0, 1325, 25),
        new Wall(0, 700, 1325, 25),
        new Wall(0, 0, 25, 262.5),
        new Wall(0, 462.5, 25, 262.5),
        new Wall(1300, 0, 25, 262.5),
        new Wall(1300, 462.5, 25, 262.5)
    ]
];
const claudiaHouse = {
    room: 1,
    init() {
        document.onkeydown = event => {
            let key = event.code;
            player.handleKey("keydown", key);
            this.handleInput(key);
        };
        document.onkeyup = event => {
            player.handleKey("keyup", event.code);
        };
    },
    handleInput(key) {
        if (key == "KeyZ")
            scene$1.progress();
    },
    move() {
        if (!scene$1.playing)
            player.move("fixed", walls[this.room]);
    },
    transitions() {
        // 1275 = canvas width - player width
        if (player.x < 0) {
            this.room = 0;
            player.x = 1275;
        }
        if (player.x > 1275) {
            if (this.room == 0) {
                this.room = 1;
                player.x = 0;
            }
            // Leaving the house - read by steps.ts
            else
                return true;
        }
        return false;
    },
    draw() {
        c.fillStyle = "white";
        c.frect(0, 0, 1325, 725);
        c.fillStyle = "purple";
        c.frect(400, 0, 925, 725);
        player.draw("fixed");
        for (const wall of walls[this.room]) {
            wall.draw();
        }
        if (scene$1.playing) {
            // Dialogue scene
            scene$1.speech.draw();
            if (scene$1.speaker)
                scene$1.speaker.draw();
        }
    }
};
claudiaHouse.draw = claudiaHouse.draw.bind(claudiaHouse);

// "Block" is kind of a stupid name for this but I'm not sure what would be
// better. We can't use "Object".
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

const buildings = [
    new Block(-425, -150, 400, 300, "yellow"),
    new Block(50, -1150, 300, 250, "lightblue")
];
const roads = [
    new Block(-50, -50, 155, 100, "gray"),
    new Block(100, -1000, 200, 2000, "gray")
];
const doors = [
    new Block(-50, -50, 25, 100, "brown"),
    new Block(150, -925, 100, 25, "brown")
];
const perinthus = {
    init() {
        player.x = 5;
        player.y = 0;
        document.onkeydown = event => player.handleKey("keydown", event.code);
        document.onkeyup = event => player.handleKey("keyup", event.code);
    },
    move: () => player.move("overworld", buildings),
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
        c.fillStyle = "purple";
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
        player.draw("overworld");
    }
};
// It's better to bind it outside of the requestAnimationFrame call so that a
// new binding doesn't have to be created every frame
perinthus.draw = perinthus.draw.bind(perinthus);

class Sword {
    constructor(length, angle) {
        this.colour = "coral";
        this.length = length;
        this.angle = angle;
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
        // Slope
        let m = (y2 - y1) / (x2 - x1);
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
    constructor(x, y, HP) {
        this.x = x;
        this.y = y;
        this.sword = new Sword(200, 0);
        // 1232 = canvas width - textbox width (~88) - padding (5)
        this.life = new Life(HP, 1232, 5);
    }
    collision(playerX, playerY) {
        return this.sword.collision(this.x + 25, this.y + 25, playerX, playerY);
    }
    receiveDamage() {
        this.life.hit();
        // Enemies don't need to heal
        this.life.threatened = false;
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
    draw() {
        c.fillStyle = "coral";
        // 25 = enemy size / 2 (so the sword starts in the center)
        this.sword.draw(this.x + 25, this.y + 25);
        c.frect(this.x, this.y, 50, 50);
    }
}

class Frontinus extends Enemy {
    constructor(counterInit) {
        super(400, 300, 5);
        this.elapsed = 0;
        this.status = "countdown";
        this.counterInit = counterInit;
        this.counter = counterInit;
    }
    collision(playerX, playerY) {
        if (this.counter != 0)
            return false;
        return super.collision(playerX, playerY);
    }
    move(time) {
        if (!this.lastFrame) {
            this.lastFrame = time;
        }
        this.elapsed += time - this.lastFrame;
        // Counting down to the next attack
        if (this.status == "countdown") {
            let threshold = 500;
            while (this.elapsed > threshold) {
                this.counter--;
                this.elapsed -= threshold;
                if (this.counter == 0) {
                    this.status = "attack";
                    this.elapsed = 0;
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
            }
        }
        // Executing the attack
        else {
            // We want a 180 degree rotation in 200ms, which means 180/200 = 0.9
            // degrees per millisecond
            this.sword.rotate((time - this.lastFrame) * 0.9);
            // It's done after 200 ms
            if (this.elapsed > 200) {
                this.status = "countdown";
                this.counter = this.counterInit;
                this.elapsed = 0;
            }
        }
        this.lastFrame = time;
    }
    draw() {
        // 25 = enemy size / 2 (so the sword starts in the center)
        if (this.status == "attack")
            this.sword.draw(this.x + 25, this.y + 25);
        c.fillStyle = "coral";
        c.frect(this.x, this.y, 50, 50);
        let fontSize = 40;
        c.font = fontSize + "px monospace";
        c.fillStyle = "white";
        let text = (this.counter < 10 ? "0" : "") + this.counter;
        c.text(text, this.x, this.y + fontSize);
    }
}

// The Akvedukto tutorial and introduction
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
        ["Frontinus", "The healing cooldowns shows up yellow in the second quarter of the screen."],
        ["Frontinus", "Only once it's finished does the heal activate."],
        ["Claudia", "How fast is the healing cooldown compared to the action cooldown?"],
        ["Frontinus", "Figure it out yourself."],
        ["Frontinus", "Also, your movement speed will be halfed while the cooldown is running."],
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
let scene = new Scene(dialogue.introduction);
function resetCombat() {
    frontinus = new Frontinus(5);
    player.resetCooldowns();
    player.life = new Life(99, 5, 5);
    player.x = 500;
    player.y = 600;
}
// Set the dialogue based on the phase
function setDialogue() {
    let next;
    switch (akvedukto.phase) {
        case 3:
            next = dialogue.timing;
            break;
        case 5:
            next = dialogue.healing;
            break;
        case 7:
            next = dialogue.dodging;
            break;
        case 9:
            next = dialogue.conclusion;
            break;
    }
    scene = new Scene(next);
}
const akvedukto = {
    // Which phase of akvedukto / the tutorial are you on?
    phase: 0,
    init() {
        player.x = 500;
        player.y = 600;
        document.onkeydown = event => {
            if (scene.playing && event.code == "KeyZ") {
                scene.progress();
                // The last frame was finished, so the scene is over
                if (!scene.playing) {
                    this.phase++;
                    // The attacking dialogue is the only one that follows
                    // another dialogue (introduction)
                    if (this.phase == 1)
                        scene = new Scene(dialogue.attacking);
                    // Have Frontinus use a 10 * 500ms timer to give extra time for healing
                    if (this.phase == 6) {
                        frontinus = new Frontinus(10);
                        frontinus.life.hp = 15;
                    }
                    player.resetInput();
                }
            }
            else if (!scene.playing) {
                // Only allow dodging in phase 8 (dodging practice)
                if (event.code == "KeyZ") {
                    if (this.phase == 8)
                        player.fixedKeys(event.code);
                    else
                        return;
                }
                else
                    player.fixedKeys(event.code);
                player.handleKey("keydown", event.code);
            }
        };
        document.onkeyup = event => {
            if (!scene.playing)
                player.handleKey("keyup", event.code);
        };
    },
    move(time) {
        // Skip movement during dialogue phases
        if (scene.playing)
            return;
        // Frontinus doesn't attack you in phase 2, when you're supposed to be
        // learning the attacking controls
        if (this.phase != 2)
            frontinus.move(time);
        player.move("fixed", [{
                x: frontinus.x,
                y: frontinus.y,
                width: 50,
                height: 50
            }]);
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
        c.fillStyle = "floralwhite";
        c.frect(0, 0, 1325, 725);
        player.drawRange(frontinus.x, frontinus.y);
        player.draw("fixed");
        frontinus.draw();
        player.drawCooldowns();
        frontinus.life.draw();
        player.life.draw();
        if (scene.playing) {
            scene.speech.draw();
            if (scene.speaker)
                scene.speaker.draw();
        }
    }
};

const steps = {
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
            window.requestAnimationFrame(this.perinthus);
        }
        else
            window.requestAnimationFrame(this.claudiaHouse);
    },
    perinthus() {
        perinthus.move();
        perinthus.draw();
        switch (perinthus.transitions()) {
            case null:
                // No transition, so we render perinthus again
                window.requestAnimationFrame(this.perinthus);
                break;
            case "claudiaHouse":
                player.x = 1275;
                player.y = 337.5;
                window.requestAnimationFrame(this.claudiaHouse);
                break;
            case "akvedukto":
                akvedukto.init();
                window.requestAnimationFrame(this.akvedukto);
                break;
        }
    },
    akvedukto(time) {
        akvedukto.move(time);
        akvedukto.draw();
        window.requestAnimationFrame(this.akvedukto);
    }
};
// Bind each "this" to "steps"
for (const step of Object.keys(steps)) {
    steps[step] = steps[step].bind(steps);
}

const mainMenu = {
    selected: 0,
    screen: "Main menu",
    options: [
        new MenuOption("Start", 150, 200),
        new MenuOption("Credits", 150, 260)
    ],
    handleInput(key) {
        if (key == "ArrowUp" || key == "KeyK")
            this.selected = 0;
        if (key == "ArrowDown" || key == "KeyJ")
            this.selected = 1;
        // Select option
        if (key == "KeyZ") {
            // You pressed start, so enter the claudiaHouse object
            if (this.selected == 0) {
                claudiaHouse.init();
                // Putting this in claudiaHouse.ts would require an additional import
                this.screen = "Claudia's house";
            }
        }
    },
    draw() {
        c.fillStyle = "white";
        c.frect(0, 0, 1325, 325);
        c.fillStyle = "blue";
        c.frect(0, 325, 1325, 400);
        c.font = "48px monospace";
        c.fillStyle = "black";
        c.text("Malfacile Gajnita Savo", 50, 50);
        c.fillStyle = "white";
        c.font = "48px serif";
        c.text("Controls", 400, 400);
        c.font = "20px monospace";
        c.text("Arrow keys: Movement", 400, 450);
        c.text("Z: UI Selection", 400, 480);
        c.text("Other keys will be introduced later", 400, 510);
        for (let i = 0; i < this.options.length; i++) {
            this.options[i].show(this.selected == i);
        }
        if (this.screen == "Main menu")
            window.requestAnimationFrame(this.draw);
        // Once the user selects "Start", we need to switch screens
        else
            window.requestAnimationFrame(steps.claudiaHouse);
    }
};
mainMenu.draw = mainMenu.draw.bind(mainMenu);
mainMenu.handleInput = mainMenu.handleInput.bind(mainMenu);

document.onkeydown = e => mainMenu.handleInput(e.code);
window.requestAnimationFrame(mainMenu.draw);
/*
// (Faster start for testing)

import akvedukto from "../fixed/akvedukto"
import steps from "./steps"

akvedukto.init()
window.requestAnimationFrame(steps.akvedukto)
*/
