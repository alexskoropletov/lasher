
/************************************************************************************/
/*                                                                                  */
/*        a player entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {

        settings.spriteheight = 32;
        settings.spritewidth = 32;
        settings.image = "player";

        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);

        game.data.playerTargetX = x;
        game.data.playerTargetY = y;

        // player can exit the viewport (jumping, falling into a hole, etc.)
        this.alwaysUpdate = true;

        this.walkThisPath = [];

        // walking & jumping speed
//        this.body.setVelocity(2, 2);
        this.body.setVelocity(8, 8);
        this.body.setFriction(0, 0);

        this.dying = false;

        // set the display around our position
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);
                
        // enable keyboard
//        me.input.bindKey(me.input.KEY.S,    "down");

//        this.body.setColli


        this.renderable.addAnimation( "idle",            [16, 17, 18, 19, 20, 21, 22, 23], 45 );
        this.renderable.addAnimation( "roll_right",      [0, 4, 8,  12, 8,  4], 45 );
        this.renderable.addAnimation( "roll_up",         [1, 5, 9,  13, 9,  5], 45 );
        this.renderable.addAnimation( "roll_left",       [2, 6, 10, 14, 10, 6], 45 );
        this.renderable.addAnimation( "roll_down",       [3, 7, 11, 15, 11, 7], 45 );
        this.renderable.addAnimation( "roll_right_up",   [24, 28, 32, 36, 32, 28], 45 );
        this.renderable.addAnimation( "roll_right_down", [25, 29, 33, 37, 33, 29], 45 );
        this.renderable.addAnimation( "roll_left_down",  [26, 30, 34, 38, 34, 30], 45 );
        this.renderable.addAnimation( "roll_left_up",    [27, 31, 35, 39, 35, 31], 45 );

        // define a basic walking animatin
//        this.renderable.addAnimation ("walk",  ["walk0001.png", "walk0002.png", "walk0003.png"]);
        // set as default
        this.renderable.setCurrentAnimation("idle");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 0.5);
    },
    
    /* -----
        update the player pos
    ------            */
    update : function (dt) {
        this.movingX = 0;
        this.movingY = 0;
        this.currentTileX = Math.floor( this.pos.x / me.game.currentLevel.tilewidth );
        this.currentTileY = Math.floor( this.pos.y / me.game.currentLevel.tileheight );
        this.currentTileXExtra = Math.ceil( this.pos.x / me.game.currentLevel.tilewidth );
        this.currentTileYExtra = Math.ceil( this.pos.y / me.game.currentLevel.tileheight );
        if( game.data.playerTargetChanged ) {
//            game.fireBullet( this.pos.x, this.pos.y );
            this.nextTileX = Math.floor( game.data.playerTargetX / me.game.currentLevel.tilewidth );
            this.nextTileY = Math.floor( game.data.playerTargetY / me.game.currentLevel.tileheight );
            this.walkThisPath = astar.search(
                game.pathfinder.graph,
                game.pathfinder.graph.grid[this.currentTileX][this.currentTileY],
                game.pathfinder.graph.grid[this.nextTileX][this.nextTileY],
                {
                    closest: 1
                }
            );
            if( !game.data.cursorDown ) {
                game.data.playerTargetChanged = false;
            }
        }

        if( this.walkThisPath[0] && this.walkThisPath[0].x == this.currentTileX && this.walkThisPath[0].y == this.currentTileY  && this.walkThisPath[0].x == this.currentTileXExtra && this.walkThisPath[0].y == this.currentTileYExtra ) {
            this.walkThisPath.splice(0, 1);
        }
        if( this.walkThisPath[0] ) {
            if( this.walkThisPath[0].x != this.currentTileX ) {
                if( this.walkThisPath[0].x >= this.currentTileX ) {
                    this.body.vel.x += this.body.accel.x * me.timer.tick;
                    this.movingX = 1;
                } else {
                    this.body.vel.x -= this.body.accel.x * me.timer.tick;
                    this.movingX = -1;
                }
            }
            if( this.walkThisPath[0].y != this.currentTileY ) {
                if( this.walkThisPath[0].y >= this.currentTileY ) {
                    this.body.vel.y += this.body.accel.y * me.timer.tick;
                    this.movingY = 1;
                } else {
                    this.body.vel.y -= this.body.accel.y * me.timer.tick;
                    this.movingY = -1;
                }
            }
            if( this.currentTileX != this.currentTileXExtra && !this.movingX ) {
                if( this.currentTileX >= this.currentTileXExtra ) {
                    this.movingX = 1;
                } else {
                    this.movingX = -1;
                }
            }
            if( this.currentTileY != this.currentTileYExtra && !this.movingY ) {
                if( this.currentTileY >= this.currentTileYExtra ) {
                    this.movingY = 1;
                } else {
                    this.movingY = -1;
                }
            }
        }

        if (this.movingX > 0 && !this.movingY ) {
            game.data.playerDirection = "right";
        } else if (this.movingX < 0  && !this.movingY ) {
            game.data.playerDirection = "left";
        } else if (this.movingY > 0  && !this.movingX ) {
            game.data.playerDirection = "down";
        } else if (this.movingY < 0  && !this.movingX ) {
            game.data.playerDirection = "up";
        } else if (this.movingY > 0 && this.movingX > 0) {
            game.data.playerDirection = "right_down";
        } else if (this.movingY < 0 && this.movingX > 0) {
            game.data.playerDirection = "right_up";
        } else if (this.movingY > 0 && this.movingX < 0) {
            game.data.playerDirection = "left_down";
        } else if (this.movingY < 0 && this.movingX < 0) {
            game.data.playerDirection = "left_up";
        }
        this.renderable.setCurrentAnimation("roll_" + game.data.playerDirection);
        if( !this.movingX ){
            this.body.vel.x = 0;
        }
        if( !this.movingY ){
            this.body.vel.y = 0;
        }
        // check for collision with environment
        this.body.update();
        this.clearFog(this.currentTileX, this.currentTileY);
        // check for collision with sthg

        me.collision.check(this, true, this.collideHandler.bind(this), true);
        // check if we moved (a "stand" animation would definitely be cleaner)
        if (!this.body.vel.y && !this.body.vel.x) {
            this.renderable.setCurrentAnimation("idle");
        }
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

    clearFog: function( x, y ) {
        for( k in me.game.currentLevel.mapLayers ) {
            if( me.game.currentLevel.mapLayers[k].name == 'fogofwar' ) {
                for( var dX = ( x - game.data.fogOfWarClearRadiusMax ); dX <= ( x + game.data.fogOfWarClearRadiusMax ); dX++ ) {
                    for( var dY = ( y - game.data.fogOfWarClearRadiusMax ); dY <= ( y + game.data.fogOfWarClearRadiusMax ); dY++ ) {
                        if( dX >= 0 && dX <= me.game.currentLevel.mapLayers[k].cols ) {
                            if( dY >= 0 && dY <= me.game.currentLevel.mapLayers[k].rows ) {
                                me.game.currentLevel.mapLayers[k].clearTile( dX, dY );
                            }
                        }
                    }
                }
            }
        }
    },
    
    /**
     * colision handler
     */
    collideHandler : function (response) {
//        switch (response.b.body.collisionType) {
//                case me.collision.types.ENEMY_OBJECT : {
//                    if (!response.b.isMovingEnemy) {
//                        // spike or any other fixed danger
//                        this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
//                        this.hurt();
//                    } else {
//                        // a regular moving enemy entity
//                        if ((response.overlapV.y>0) && this.body.falling) {
//                            // jump
//                            this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
//                        } else {
//                             this.pos.sub(response.overlapV);
//                             this.hurt();
//                             this.updateBounds();
//                        }
//                    }
//                    break;
//                }
//                default : break;
//            }
    },

    
    /**
     * ouch
     */
    hurt : function () {
        if (!this.renderable.flickering)
        {
            this.renderable.flicker(750);
            // flash the screen
            me.game.viewport.fadeIn("#FFFFFF", 75);
            me.audio.play("die", false);
        }
    }
});