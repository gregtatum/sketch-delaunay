var CreateTriangles = require('delaunay-triangulate')

function _prepCanvasAndGetCtx() {
	
	var canvas = $('canvas')[0]
	
	canvas.width = window.innerWidth * devicePixelRatio
	canvas.height = window.innerHeight * devicePixelRatio
	
	return canvas.getContext('2d')
}

function _clickToCreatePoints( current, draw ) {
	
	
	$('canvas').click(function(e) {
		var x = e.pageX * devicePixelRatio
		var y = e.pageY * devicePixelRatio
		
		var point = [x,y]
		
		current.points.push(point)
		current.triangles = CreateTriangles( current.points )
		
		console.log(current.triangles)
		draw()
	})
}

function _drawTriangles( ctx, config, triangles, points ) {

	ctx.lineWidth = config.lineWidth * devicePixelRatio
	ctx.strokeStyle = config.lineColor

	ctx.beginPath()
	
	triangles.forEach(function( triangle ) {
		
		console.log( 'drawing triangle', triangle )
		
		var pt1 = points[triangle[0]]
		var pt2 = points[triangle[1]]
		var pt3 = points[triangle[2]]
		
		ctx.moveTo( pt1[0], pt1[1] )
		ctx.lineTo( pt2[0], pt2[1] )

		ctx.moveTo( pt2[0], pt2[1] )
		ctx.lineTo( pt3[0], pt3[1] )

		ctx.moveTo( pt3[0], pt3[1] )
		ctx.lineTo( pt1[0], pt1[1] )
	})
	
	ctx.stroke()
	ctx.closePath()
	
	
}

function _drawPoints( ctx, config, points ) {
	
	var size = config.pointSize * devicePixelRatio
	var halfSize = config.pointSize / 2 * devicePixelRatio
	
	ctx.fillStyle = config.pointColor

	points.forEach(function( pt ) {
		
		ctx.fillRect(
			pt[0] - halfSize,
			pt[1] - halfSize,
			size,
			size
		)
	})
}

function _drawFn( ctx, config, current ) {
	
	return function draw() {
		
		ctx.clearRect(
			0, 0,
			window.innerWidth * devicePixelRatio,
			window.innerHeight * devicePixelRatio
		)
		
		_drawTriangles( ctx, config, current.triangles, current.points )
		_drawPoints( ctx, config, current.points )
	}
}

function init() {
	
	var ctx = _prepCanvasAndGetCtx()
	var current = {
		points : [],
		triangles : []
	}
	var config = {
		pointSize : 4,
		pointColor : "#fff",
		lineWidth : 2,
		lineColor : "#03e"
	}
	
	var draw = _drawFn( ctx, config, current )
	
	_clickToCreatePoints( current, draw )
}

jQuery(init)