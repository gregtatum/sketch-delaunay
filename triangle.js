
function _prepCanvasAndGetCtx() {
	
	var canvas = $('canvas')[0]
	
	canvas.width = window.innerWidth * devicePixelRatio
	canvas.height = window.innerHeight * devicePixelRatio
	
	return canvas.getContext('2d')
}

function _clickToCreatePoints( points, draw ) {
	
	$('canvas').click(function(e) {
		var x = e.pageX * devicePixelRatio
		var y = e.pageY * devicePixelRatio
		
		var point = [x,y]
		
		points.push(point)
		draw()
	})
}

function _drawFn( ctx, config, points ) {
	
	var size = config.pointSize * devicePixelRatio
	var halfSize = config.pointSize / 2 * devicePixelRatio
	
	return function draw() {
		
		ctx.fillStyle = "#fff"

		points.forEach(function( pt ) {
			
			ctx.fillRect(
				pt[0] - halfSize,
				pt[1] - halfSize,
				size,
				size
			)
		})
	}
}

function init() {
	
	var ctx = _prepCanvasAndGetCtx()
	var points = []
	
	var config = {
		pointSize : 4
	}
	
	var draw = _drawFn( ctx, config, points )
	
	_clickToCreatePoints( points, draw )
}

jQuery(init)