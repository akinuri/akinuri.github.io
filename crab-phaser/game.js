const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: !false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image("crab", "assets/crab.png");
    this.load.image("lobster", "assets/lobster.png");
}

function create() {
    this.cameras.main.setBackgroundColor(hsl2hex(200, 75, 40));

    // Create a ground object using a rectangle and add it to physics
    const ground = this.add.rectangle(400, 575, 800, 50, hsl2hex(60, 40, 70), 0.75);
    this.physics.add.existing(ground, true); // Add physics to the ground (true for static body)

    // Add the crab sprite
    this.crab = this.physics.add.sprite(300, 500, "crab");
    this.crab.setCollideWorldBounds(true); // Prevent crab from going out of bounds
    // Scale the crab if needed
    this.crab.setScale(0.1); // Adjust size as needed
    // Enable collision between crab and ground
    this.physics.add.collider(this.crab, ground);
    // Define jump properties
    this.crab.setData("onGround", true); // Custom property to check if the crab is on the ground
    this.jumpVelocity = -this.crab.displayHeight * 4; // Adjust this value to change the jump height

    // Add the lobster sprite using the custom Lobster class
    this.lobster = new Lobster(this, 500, 500, "lobster");
    this.lobster.setScale(0.125);
    this.physics.add.collider(this.lobster, ground);
    
    // Create cursor keys for movement and jump
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeys("A,D");
}

function update() {
    // Reset the crab's velocity (stops the crab from moving)
    this.crab.setVelocityX(0);

    // Move left
    if (
        this.cursors.left.isDown ||
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown
    ) {
        this.crab.setVelocityX(-200); // Adjust speed as needed
    }
    // Move right
    else if (
        this.cursors.right.isDown ||
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown
    ) {
        this.crab.setVelocityX(200); // Adjust speed as needed
    }

    // Check for jump
    if (
        this.cursors.up.isDown ||
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown
    ) {
        if (this.crab.body.touching.down) {
            // Check if crab is touching the ground
            this.crab.setVelocityY(this.jumpVelocity); // Apply jump velocity
            this.crab.setData("onGround", false); // Set onGround to false while jumping
        }
    }

    // Check if the crab has landed on the ground
    if (this.crab.body.touching.down) {
        this.crab.setData("onGround", true); // Set onGround to true when touching the ground
    }
    
    // ** Explicit overlap check for crab and lobster **
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.crab.getBounds(), this.lobster.getBounds())) {
        // Reset crab position when overlapped with lobster
        this.crab.setPosition(400, 100);
        // Reset lobster's velocity to its intended speed
        this.lobster.resetVelocity();
    }
    
}
