game.MainMenuScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        var characters = game.characters;
        game.mainBaseObjects = {
            //background
            background: {
                object: new me.ImageLayer("background", 800, 600, "main_base_sky_01", 1, 1),
                zindex: 1
            },
            sun: {
                object: new me.Sprite(66, 73, me.loader.getImage("main_base_sun")),
                zindex: 10
            },
            cloudOne: {
                object: new game.MainBaseCloud( 740, 100, { speed: 2, opacity: 1.0, width: 420, height: 92,  spritewidth: 420, spriteheight: 92, image: "main_base_cloud_day_01" } ),
                zindex: 25
            },
            cloudTwo: {
                object: new game.MainBaseCloud( 150, 170, { speed: 1, opacity: 0.5, width: 739, height: 92,  spritewidth: 739, spriteheight: 92, image: "main_base_cloud_day_02" } ),
                zindex: 15
            },
            //hills
            thirdHill:  {
                object: new me.Sprite(517, 325, me.loader.getImage("main_base_third_hill")),
                zindex: 20
            },
            secondHill:  {
                object: new me.Sprite(275, 325, me.loader.getImage("main_base_second_hill")),
                zindex: 30
            },
            bigHill:  {
                object: new me.Sprite(0, 311, me.loader.getImage("main_base_big_hill")),
                zindex: 40
            },
            //characters
            joseCharacter:  {
                object: new game.CharacterSmall( 600, 500, { width: 32, height: 64, image: "jose_small" }, characters.jose ),
                zindex: 50
            },
            pedroCharacter:  {
                object: new game.CharacterSmall( 520, 500, { width: 32, height: 64, image: "pedro_small" }, characters.pedro ),
                zindex: 50
            },
            pepeCharacter: {
                object: new game.CharacterSmall( 560, 500, { width: 32, height: 64, image: "pepe_small" }, characters.pepe ),
                zindex: 50
            },
            padreCharacter: {
                object: new game.CharacterSmall( 200, 415, { width: 32, height: 64, image: "padre_small" }, characters.padre ),
                zindex: 50
            },
            //other
            cherch: {
                object: new game.MainBaseCherch( 80, 225, { width: 221, height: 201, spritewidth: 221, spriteheight: 201, image: "main_base_cherch" } ),
                zindex: 50
            },
            fence: {
                object: new game.MainBaseElement( 0, 333, { width: 328, height: 168, spritewidth: 328, spriteheight: 168, image: "main_base_fence" } ),
                zindex: 55
            },
            relica_base: {
                object: new game.MainBaseElement( 108, 431, { width: 96, height: 48, spritewidth: 96, spriteheight: 48, image: "main_base_relic_base" } ),
                zindex: 50
            },
            relic: {
                object: new game.MainBaseCherch( 129, 416, { width: 32, height: 48, spritewidth: 32, spriteheight: 48, image: "main_base_relic" } ),
                zindex: 55
            },
            chicken: {
                object: new game.MainBaseChicken( 49, 425, { width: 32, height: 32, spritewidth: 32, spriteheight: 32, image: "main_base_chicken" }, characters.chicken ),
                zindex: 60
            },
            getOut: {
                object: new game.MainBaseGetout( 0, 500, { width: 159, height: 63, spritewidth: 159, spriteheight: 63, image: "tomap" }, game.customStates.MAP ),
                zindex: 70
            }
        };
        for( k in game.mainBaseObjects ) {
            me.game.world.addChild( game.mainBaseObjects[k].object, game.mainBaseObjects[k].zindex );
        }
    },
    onDestroyEvent: function() {
        for( k in game.mainBaseObjects ) {
            me.game.world.removeChild( game.mainBaseObjects[k].object, true );
        }
        game.mainBaseObjects = {};
    }
});