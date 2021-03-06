
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  var mouse_down = false; //this tracks when you click on mouse and let it go
  var past;
  var current;
  var server = io();

  server.on('connect', function(socket){
    console.log('connected');
  });

  server.on('line-broadcast', function(msg) {
    draw(msg.past, msg.current);
  });

  function draw (past, current){
    ctx.strokeStyle = "darkolivegreen";
    ctx.lineWidth = 5;
    ctx.moveTo(past[0], past[1]);
    ctx.quadraticCurveTo(
      past[0], past[1],
      current[0], current[1]
    );

    ctx.stroke();
    ctx.closePath();
  }
  ctx.beginPath();
  canvas.addEventListener('mousedown', function (event){
    mouse_down = true;
    console.log('DOWN', event.offsetX, event.offsetY);
  });
  canvas.addEventListener('mouseup', function(event){
    mouse_down = false;
    past = null;
    console.log('UP', event.offsetX, event.offsetY);
  });
  canvas.addEventListener('mousemove', function(event){
    if(mouse_down) {
      current = [event.offsetX, event.offsetY];
      if(past){
        server.emit('draw-line', {past: past, current: current});
        // draw(past, current);
      }
      past = [event.offsetX, event.offsetY];
    }
  });
