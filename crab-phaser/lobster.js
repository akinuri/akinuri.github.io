class Lobster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.initialSpeed = 100; // Store the initial speed
        this.setVelocityX(this.initialSpeed); // Initial velocity to start moving the lobster
        this.lastVelocityX = this.body.velocity.x;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        // Check if the lobster hits the world bounds
        if (this.body.blocked.left || this.body.blocked.right) {
            // Reverse the stored velocity instead of the current one, 
            // which might have been set to 0
            this.setVelocityX(-this.lastVelocityX);
        }
        // Update lastVelocityX after potential change
        this.lastVelocityX = this.body.velocity.x;
    }

    resetVelocity() {
        // Reset velocity to initial speed (and correct direction if necessary)
        this.setVelocityX(this.initialSpeed * Math.sign(this.body.velocity.x || 1));
    }
}
