<!DOCTYPE HTML>
<html>
<head>
  <title>Lasher - slasher without "S" Powered By melonJS</title>
  <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
</head>
<body>
<!-- Canvas placeholder -->
<div id="screen"></div>

<script type="text/javascript" src="js/jquery-2.1.1.min.js"></script>
<!-- melonJS Library -->
<script type="text/javascript" src="js/build/melonJS-1.1.0.js"></script>
<!-- Plugin(s) -->
<script type="text/javascript" src="js/plugins/debug/debugPanel.js"></script>
<!-- Pathfinder -->
<script type='text/javascript' src='js/javascript-astar/astar.js'></script>
<!-- Sound player -->
<script type='text/javascript' src='js/jsfxr/jsfxr.js'></script>
<script type='text/javascript' src='js/jsfxr/sounds.js'></script>

<!-- Game Scripts -->
<script type="text/javascript" src="js/game.js"></script>
<script type="text/javascript" src="js/resources.js"></script>


<script type="text/javascript" src="js/entities/entities.js"></script>
<script type="text/javascript" src="js/entities/target_location_cross.js"></script>
<script type="text/javascript" src="js/entities/bullet.js"></script>
<script type="text/javascript" src="js/entities/HUD.js"></script>

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
