var circle = {
  radius: 40,
  x: 10,
  y: 10
};

const sizeSproing = new Sproing(circle.radius, { min: 0 });
const xySproing = new Sproing(
  [circle.x, circle.y],
  [window.innerWidth / 2 - circle.radius, window.innerHeight / 2 - circle.radius]
);

const animationLoop = () => {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const [newX, newY] = xySproing.update();
  circle.x = newX;
  circle.y = newY;

  circle.radius = sizeSproing.update();

  context.beginPath();
  context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'red';
  context.lineWidth = circle.radius * 0.1;
  context.strokeStyle = 'white';
  context.stroke();
  context.fill();

  requestAnimationFrame(animationLoop);
};

const canvas = document.getElementById('canvas');

// move the circle on click
canvas.addEventListener('click', function(e) {
  xySproing.setTarget([e.pageX, e.pageY]);
});
canvas.addEventListener('touchstart', function(e) {
  xySproing.setTarget([e.touches[0].pageX, e.touches[0].pageY]);
});

// adjust the circle's radius on scroll
window.addEventListener('wheel', event => {
  const delta = -event.deltaY / 10;
  sizeSproing.setTarget(Math.min(Math.max(sizeSproing.target + delta, 10), 200));
});

// Wire up the sliders which control the spring parameters
const xySliders = document.querySelectorAll('.xy.panel .labeledSlider');
xySliders.forEach(child => {
  const slider = child.querySelector('.slider');
  slider.oninput = function() {
    const param = slider.getAttribute('param');
    xySproing.springParams[param] = this.value;
    child.querySelector('.value').innerText = this.value;
  };
});
const sizeSliders = document.querySelectorAll('.size.panel .labeledSlider');
sizeSliders.forEach(child => {
  const slider = child.querySelector('.slider');
  slider.oninput = function() {
    const param = slider.getAttribute('param');
    sizeSproing.springParams[param] = this.value;
    child.querySelector('.value').innerText = this.value;
  };
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

// resize once to make the canvas fill the page
resizeCanvas();

// kick off the animation
animationLoop();
