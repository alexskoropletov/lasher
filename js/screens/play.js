/*
 game.PlayScreen = me.ScreenObject.extend({
 onResetEvent: function() {
 me.levelDirector.loadLevel("map_maze");
 var collideMap = [];
 for( Col in me.game.collisionMap.layerData ) {
 for( Row in me.game.collisionMap.layerData[Col] ) {
 if( typeof collideMap[Col] == "undefined" ) {
 collideMap[Col] = [];
 }
 collideMap[Col][Row] = me.game.collisionMap.layerData[Col][Row] ? 0 : 1;
 }
 }

 game.pathfinder.graph = new Graph(collideMap);
 game.pathfinder.graph.diagonal = 1;

 //        game.pathfinder.grid = new PF.Grid(
 //            me.game.collisionMap.cols,
 //            me.game.collisionMap.rows,
 //            collideMap
 //        );
 //        game.pathfinder.gridBackup = collideMap;

 // reset the score
 game.data.score = 0;

 // add our HUD to the game world
 this.HUD = new game.HUD.Container();
 me.game.world.addChild(this.HUD);

 game.player = me.game.world.getChildByName("mainPlayer")[0];
 //        var fogOfWar = new game.PlayerFogOfWar(
 //            game.player.pos.x - 80,
 //            game.player.pos.y - 80,
 //            {
 //                width: 160,
 //                height: 160
 //            }
 //        );
 //        me.game.world.addChild( fogOfWar, 800 );
 //        game.fogOfWar = fogOfWar;

 // play some music
 //        me.audio.playTrack("DST-GameForest");
 },

 onDestroyEvent: function() {

 // remove the HUD from the game world
 me.game.world.removeChild(this.HUD);

 // stop some music
 //        me.audio.stopTrack("DST-GameForest");
 }
 });
 */
game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        game.startRain();

        this.selectedEntity = null;

        this.gridForThisLevel = game.pathfinder.gridTypes["grid" + game.getRandomInt( 1, 1 )];
        game.pathfinder.graph = new Graph(this.gridForThisLevel._map);

        this.pointerPosition = {
            mapPos: { x: 1,y: 1 },
            mapPosOld: { x: 1, y: 1 },
            pathShowed: false
        };
        //adding base objects
        game.fightObjects = {
            //background
            backgroundLayer: {
                object: new me.ImageLayer("forest", 800, 600, "forest", 1, 1),
                zindex: 2
            },
            grid: {
                object: new me.Sprite(this.gridForThisLevel.x, this.gridForThisLevel.y, me.loader.getImage(this.gridForThisLevel.image)),
                zindex: 4
            }
//            ,getOut: {
////                object: new game.MainBaseGetout( 49, 500, { width: 64, height: 64, spritewidth: 64, spriteheight: 64, image: "getout" }, game.customStates.MAP ),
////                zindex: 70
//            }
        };

        //add player characters
        var playerPos = {
            x: this.gridForThisLevel.x,
            y: ( this.gridForThisLevel.y - 32 )
        };
        var nextCharacterIndex = 50;
        for( var playerY in this.gridForThisLevel._location ) {
            for( var playerX in this.gridForThisLevel._location[playerY] ) {
                if( this.gridForThisLevel._location[playerY][playerX] == 1 ) {
                    if( this.gridForThisLevel._location ) {
                        game.fightObjects['fighter_' + playerX + '_' + playerY] = {
                            object: new game.CharacterFightSmall( playerPos.x + playerX * 32, playerPos.y + playerY * 32, { width: 32, height: 64, image: "jose_small" } ),
                            zindex: nextCharacterIndex,
                            pos: {
                                x: playerX,
                                y: playerY
                            }
                        };
                        nextCharacterIndex++;
                    }
                }
            }
        }
        //display objects and stuff
        for( k in game.fightObjects ) {
            if( game.fightObjects[k].object ) {
                me.game.world.addChild( game.fightObjects[k].object, game.fightObjects[k].zindex );
            }
        }
        //field grid
        game.fightGrid = {};
        for( mapX = 0; mapX < this.gridForThisLevel._map.length; mapX++ ) {
            for( mapY = 0; mapY < this.gridForThisLevel._map[mapX].length; mapY++ ) {
                game.fightGrid['active_' + mapX + "_" + mapY] = {
                    object: new game.gridEntiry(
                        this.gridForThisLevel.x + mapY * 32,
                        this.gridForThisLevel.y + mapX * 32,
                        { width: 32, height: 32, image: "active_grid" }
                    ),
                    zindex: 5
                };
                game.fightGrid['activenoway_' + mapX + '_' + mapY] = {
                    object: new game.gridEntiry(
                        this.gridForThisLevel.x + mapY * 32,
                        this.gridForThisLevel.y + mapX * 32,
                        { width: 32, height: 32, image: "active_grid_noway" }
                    ),
                    zindex: 5
                };
            }
        }
        this.hideGrid();
        for( k in game.fightGrid ) {
            if( game.fightGrid[k].object ) {
                me.game.world.addChild( game.fightGrid[k].object, game.fightGrid[k].zindex );
            }
        }

        //pointer events listeners
        me.event.subscribe("pointermove", this.mouseMove.bind(this));
        me.input.registerPointerEvent('pointerdown', game.fightObjects.grid.object, this.mouseDown.bind(this));
    },
    onDestroyEvent: function() {
        game.stopRain();
    },
    //set selected grid cell(s) visible
    showGrid: function( showThisGrid ) {
        for( var gridIndex = 0; gridIndex < showThisGrid.length; gridIndex++ ) {
            if( !game.fightGrid[showThisGrid[gridIndex]] ) {
                console.log( showThisGrid[gridIndex] );
            } else {
                game.fightGrid[showThisGrid[gridIndex]].object.renderable.setOpacity(1);
            }
        }
        this.pointerPosition.pathShowed = true;
    },
    //set all grid cells invisible
    hideGrid: function() {
        for( k in game.fightGrid ) {
            if( game.fightGrid[k].object ) {
                game.fightGrid[k].object.renderable.setOpacity(0);
            }
        }
        this.pointerPosition.pathShowed = false;
    },
    //get map position in grid coordinates
    getMapPos: function( e ) {
        var pos = {
            x: parseInt( Math.floor( ( e.gameWorldX - this.gridForThisLevel.x - 1 ) / 32 ) ),
            y: parseInt( Math.floor( ( e.gameWorldY - this.gridForThisLevel.y - 1 ) / 32 ) )
        };
        if( pos.x < 0 ) {
            pos.x = 0;
        }
        if( pos.y < 0 ) {
            pos.y = 0;
        }
        return pos;
    },
    //get type of highlighted grid for current pointer position
    getGridType: function() {
        var gridType = "activenoway";
        if( this.gridForThisLevel._location[this.pointerPosition.mapPos.y] ) {
            if( this.gridForThisLevel._location[this.pointerPosition.mapPos.y][this.pointerPosition.mapPos.x] ) {
                gridType = "active";
            }
        } else {
            console.log( this.pointerPosition.mapPos );
        }
        return gridType;
    },
    mouseMove: function( e ) {
        if( game.fightObjects.grid.object.containsPoint( e.gameWorldX, e.gameWorldY ) ) {
            this.pointerPosition.mapPos = this.getMapPos( e );
            if( JSON.stringify( this.pointerPosition.mapPos ) !== JSON.stringify( this.pointerPosition.mapPosOld ) ) {
                this.pointerPosition.mapPosOld = this.pointerPosition.mapPos;
                if( this.selectedEntity ) {
                    this.showPath();
                } else {
                    this.hideGrid();
                    this.showGrid( [ this.getGridType() + '_' + this.pointerPosition.mapPos.y + "_" + this.pointerPosition.mapPos.x ] );
                }
            }
        } else {
            if( this.pointerPosition.pathShowed ) {
                this.hideGrid();
            }
        }
    },
    mouseDown: function( e ) {
        if( this.selectedEntity ) {
            this.selectedEntity.object.setHover( false );
            this.hideGrid();
        }
        if( this.getGridType() == 'active' ) {
            this.selectedEntity = game.fightObjects['fighter_' + this.pointerPosition.mapPos.x + '_' + this.pointerPosition.mapPos.y];
            this.selectedEntity.object.setHover( true );
        } else {
            this.selectedEntity = null;
        }
        console.log( this.selectedEntity );
    },
    showPath: function() {
        if( typeof game.pathfinder.graph.grid[parseInt(this.pointerPosition.mapPos.y)] != 'undefined' ) {
            var result = astar.search(
                game.pathfinder.graph,
                game.pathfinder.graph.grid[this.selectedEntity.pos.y][this.selectedEntity.pos.x],
                game.pathfinder.graph.grid[this.pointerPosition.mapPos.y][this.pointerPosition.mapPos.x],
                { closest: true }
            );
            if( result.length ) {
                this.hideGrid();
                var showThisGrid = [];
                for( k in result ) {
                    if( typeof result[k].x != 'undefined' && typeof result[k].y != 'undefined' ) {
                        showThisGrid.push( ( k > 3 ? "activenoway_" : "active_" ) + result[k].x + "_" + result[k].y);
                    }
                }
                this.showGrid( showThisGrid );
            }
        }
    }
});
