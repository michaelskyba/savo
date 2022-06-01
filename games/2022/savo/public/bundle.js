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
    keyPressed: {
        left: false,
        right: false,
        up: false,
        down: false,
        shift: false
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
        this.life.hit();
        this.cooldowns.damage.start();
    },
    drawCooldowns() {
        for (const cooldown of cooldowns) {
            this.cooldowns[cooldown].draw();
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
const dialogue = {
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

const scene = new Scene(dialogue.main);
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
            scene.progress();
    },
    move() {
        if (!scene.playing)
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
        if (scene.playing) {
            // Dialogue scene
            scene.speech.draw();
            if (scene.speaker)
                scene.speaker.draw();
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
    constructor() {
        super(400, 300, 5);
        this.elapsed = 0;
        this.counter = 5;
        this.status = "countdown";
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
                this.counter = 5;
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

const frontinus = new Frontinus();
const akvedukto = {
    init() {
        player.x = 500;
        player.y = 600;
        document.onkeydown = event => {
            player.fixedKeys(event.code);
            player.handleKey("keydown", event.code);
        };
        document.onkeyup = event => player.handleKey("keyup", event.code);
    },
    move(time) {
        frontinus.move(time);
        player.move("fixed", [{
                x: frontinus.x,
                y: frontinus.y,
                width: 50,
                height: 50
            }]);
        // Have the player take damage if Frontinus' sword hits them
        if (frontinus.collision(player.x, player.y))
            player.receiveDamage();
        // Have Frontinus take damage from the player's hits
        if (player.status == "attacking")
            frontinus.receiveDamage();
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
// (Faster start for testing)
/*
import akvedukto from "../fixed/akvedukto"
import steps from "./steps"

akvedukto.init()
window.requestAnimationFrame(steps.akvedukto)
*/
