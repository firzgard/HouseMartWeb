// login_main.js

document.addEventListener('DOMContentLoaded', function () {
	// Setting up particle background
	$(function(){
		$('#particles').particleground({
			minSpeedX: 0.1,
			maxSpeedX: 0.7,
			minSpeedY: 0.1,
			maxSpeedY: 0.7,
			directionX: 'center', // 'center', 'left' or 'right'. 'center' = dots bounce off edges
			directionY: 'center', // 'center', 'up' or 'down'. 'center' = dots bounce off edges
			density: 10000, // How many particles will be generated: one particle every n pixels
			dotColor: '#d8d8d8',
			lineColor: '#d8d8d8',
			particleRadius: 7, // Dot size
			lineWidth: 1,
			curvedLines: true,
			proximity: 100, // How close two dots need to be before they join
			parallax: false
		});
	});
});