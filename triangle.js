var CreateTriangles = require('delaunay-triangulate')
var Circumcenter = require("circumcenter")
var TAU = Math.PI * 2

function _prepCanvasAndGetCtx() {
	
	var canvas = $('canvas')[0]
	
	function resize() {
		canvas.width = window.innerWidth * devicePixelRatio
		canvas.height = window.innerHeight * devicePixelRatio
	}
	
	$(window).on('resize', resize)
	resize()
	
	return canvas.getContext('2d')
}

function _clickToCreatePoints( current, draw ) {
	
	
	$('canvas').click(function(e) {
		var x = e.pageX * devicePixelRatio
		var y = e.pageY * devicePixelRatio
		
		var point = [x,y]
		
		current.points.push(point)
		current.triangleIndices = CreateTriangles( current.points )
		current.triangles = current.triangleIndices.map(function( indices ) {
			
			var pt1 = current.points[indices[0]]
			var pt2 = current.points[indices[1]]
			var pt3 = current.points[indices[2]]
			
			return [pt1, pt2, pt3]
		})
		current.circumcenters = current.triangles.map( Circumcenter )
		
		draw()
	})
}

function _drawTriangles( ctx, config, triangles, points ) {

	ctx.lineWidth = config.lineWidth * devicePixelRatio
	ctx.strokeStyle = config.lineColor

	ctx.beginPath()
	
	triangles.forEach(function( triangle ) {
		
		ctx.moveTo( triangle[0][0], triangle[0][1] )
		ctx.lineTo( triangle[1][0], triangle[1][1] )

		ctx.moveTo( triangle[1][0], triangle[1][1] )
		ctx.lineTo( triangle[2][0], triangle[2][1] )

		ctx.moveTo( triangle[2][0], triangle[2][1] )
		ctx.lineTo( triangle[0][0], triangle[0][1] )
	})
	
	ctx.stroke()
	ctx.closePath()
}

function _drawPoints( ctx, config, points ) {
	
	var size = config.pointSize * devicePixelRatio
	var halfSize = config.pointSize / 2 * devicePixelRatio
	
	ctx.fillStyle = config.pointColor

	points.forEach(function( pt ) {
		
		ctx.beginPath()
		ctx.arc( pt[0],	pt[1], config.pointSize, 0, TAU )
		ctx.fill()
	})
}

function _drawCircumcenters( ctx, config, circumcenters, triangles) {
	
	ctx.strokeStyle = config.circumcenterColor
	ctx.lineWidth = config.circumcenterLineWidth
	
	circumcenters.forEach(function(pt, i) {
		
		var referencePoint = triangles[i][0]
		var radius = Math.sqrt(
			Math.pow(pt[0] - referencePoint[0], 2) +
			Math.pow(pt[1] - referencePoint[1], 2)
		)
		
		ctx.beginPath()
		ctx.arc( pt[0], pt[1], radius, 0, TAU )
		ctx.stroke()
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
		_drawCircumcenters( ctx, config, current.circumcenters, current.triangles )
	}
}

function init() {
	
	var ctx = _prepCanvasAndGetCtx()
	
	var config = {
		pointSize : 4,
		pointColor : "#fff",
		lineWidth : 2,
		lineColor : "#208FF3",
		circumcenterColor : "rgba(30,255,30,0.15)",
		circumcenterLineWidth : 2,
	}
	
	var current = {
		points : [],
		triangles : []
	}
	
	var draw = _drawFn( ctx, config, current )
	
	$(window).on('resize', draw)
	
	_clickToCreatePoints( current, draw )
}

jQuery(init)