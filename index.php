<!DOCTYPE HTML>
<html>
<head>
  <title>Estupendo - html5 turn-based squad combat simulator. With all saints!</title>
  <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <link rel="stylesheet" type="text/css" href="style.css" />
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
</head>
<body>
<!-- Canvas placeholder -->
<div id="screen"></div>

<script type="text/javascript" src="js/jquery-2.1.1.min.js"></script>
<!-- melonJS Library -->
<!--<script type="text/javascript" src="js/build/melonJS-1.1.0.js"></script>-->
<!--<script type="text/javascript" src="melonJS/build/melonJS-1.2.0-min.js"></script>-->
<!--<script type="text/javascript" src="melonJS/build/melonJS-2.0.0-min.js"></script>-->
<script type="text/javascript" src="melonJS/build/melonJS-2.0.2-min.js"></script>
<!--<script type="text/javascript" src="melonJS/build/melonJS-2.1.0-min.js"></script>-->
<!-- Plugin(s) -->
<script type="text/javascript" src="js/plugins/debug/debugPanel.js"></script>
<!-- Pathfinder -->
<script type='text/javascript' src='js/astar/astar.js'></script>
<!-- Sound player -->
<script type='text/javascript' src='js/jsfxr/jsfxr.js'></script>
<script type='text/javascript' src='js/jsfxr/sounds.js'></script>

<!-- Game Scripts -->
<script type="text/javascript" src="js/game.js"></script>
<script type="text/javascript" src="js/resources.js"></script>

<script type="text/javascript" src="js/entities/character.js"></script>
<script type="text/javascript" src="js/entities/menu/interface.js"></script>
<script type="text/javascript" src="js/entities/menu/main_base.js"></script>
<script type="text/javascript" src="js/entities/map/map.js"></script>
<script type="text/javascript" src="js/entities/fight/character.js"></script>
<script type="text/javascript" src="js/entities/fight/grid.js"></script>

<script type="text/javascript" src="js/screens/mainmenu.js"></script>
<script type="text/javascript" src="js/screens/map.js"></script>
<script type="text/javascript" src="js/screens/play.js"></script>

<!-- Bootstrap & Mobile optimization tricks -->
<script type="text/javascript">

  window.onReady(function onReady() {

    game.onload();

    // Mobile browser hacks
    if (me.device.isMobile && !navigator.isCocoonJS) {
      // Prevent the webview from moving on a swipe
      window.document.addEventListener("touchmove", function (e) {
        e.preventDefault();
        window.scroll(0, 0);
        return false;
      }, false);

      // Scroll away mobile GUI
      (function () {
        window.scrollTo(0, 1);
        me.video.onresize(null);
      }).defer();

      me.event.subscribe(me.event.WINDOW_ONRESIZE, function (e) {
        window.scrollTo(0, 1);
      });
    }

    $('body').on('contextmenu', '#screen', function(e){
      return false;
    });
  });
</script>
</body>
</html>
