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
        me.levelDirector.loadLevel("fightmap");
        game.startRain();
        game.fightObjects = {
            //characters
            joseCharacter:  {
                object: new game.CharacterFightSmall( 248, 280, { width: 32, height: 64, image: "jose_small" } ),
                zindex: 50
            },
//            pedroCharacter:  {
//                object: new game.CharacterFightSmall( 468, 344, { width: 32, height: 64, image: "pedro_small" } ),
//                zindex: 50
//            },
//            pepeCharacter: {
//                object: new game.CharacterFightSmall( 248, 408, { width: 32, height: 64, image: "pepe_small" } ),
//                zindex: 50
//            },
            getOut: {
//                object: new game.MainBaseGetout( 49, 500, { width: 64, height: 64, spritewidth: 64, spriteheight: 64, image: "getout" }, game.customStates.MAP ),
//                zindex: 70
            }
        };
        for( k in game.fightObjects ) {
            if( game.fightObjects[k].object ) {
                me.game.world.addChild( game.fightObjects[k].object, game.fightObjects[k].zindex );
            }
        }
    },
    onDestroyEvent: function() {
        game.stopRain();
    }
});
