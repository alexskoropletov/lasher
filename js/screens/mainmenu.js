game.MainMenuScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        var image = me.loader.getImage('redrain');
        var emitter = new me.ParticleEmitter(0, 0, {
            image: image,
            width: 800,
            height: 116,
            totalParticles: 400,
            angle: -0.7853981633974483,
            angleVariation: 3.141592653589793,
            maxLife: 8000,
            speed: 0.047140452079103175,
            speedVariation: 5.300943312279428,
            minStartScale: 0.3,
            maxStartScale: 1,
            gravity: 0.61,
            wind: -0.1,
            frequency: 10
        });
        emitter.name = 'redrain';
        emitter.z = 110;
        me.game.world.addChild(emitter);
        me.game.world.addChild(emitter.container);
        emitter.streamParticles();

        var characters = {
            jose: {
                image: '"',
                text: "Me llamo Jose"
            },
            pedro: {
                image: '"',
                text: "Me llamo Pedro"
            },
            pepe: {
                image: '"',
                text: "Me llamo Pepe"
            },
            chicken: {
                image: "",
                text: "\n\n      Pok-pok. Pok"
            }
        };
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
            }
        };

        for( k in game.mainBaseObjects ) {
            me.game.world.addChild( game.mainBaseObjects[k].object, game.mainBaseObjects[k].zindex );
        }

        //mousemove event
        me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
            me.event.publish("pointermove", [ event ]);
        });
    },
    onDestroyEvent: function() {
        for( k in game.mainBaseObjects ) {
            me.game.world.removeChild( game.mainBaseObjects[k].object );
        }
        game.mainBaseObjects = {};
    }
});