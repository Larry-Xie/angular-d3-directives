// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

angular.module('cwc.d3')
    .directive('ctxPackChart', ['$window', 'd3', function($window, d3) {
        return {
            restrict: 'A',
            scope: {
                config: '=',
                label: '@',
                onClick: '&'
            },
            link: function(scope, element, attrs) {
                var margin = scope.config.margin || { left: 0, right: 0 },
                	width = scope.config.width || 500,
                	height = scope.config.height || 500,
                	radius = scope.config.radius || 20;

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('class','pack-svg');

                $window.onresize = function() {
                    scope.$apply();
                };

                scope.$watch(function() {
                    return element[0].clientWidth;
                }, function() {
                    scope.render(scope.config);
                });

                /*scope.$watch('config', function() {
                    scope.render(scope.config);
                }, true);*/

                scope.render = function(config) {
					var pack = d3.layout.pack()
					    		.size([width, height])
					    		.radius(radius);
					
					svg.attr("width", width)
					    .attr("height", height)
					    .append("g")
					    .attr("transform", "translate(0,0)");
					
					
					if(config.data) {
						var nodes = pack.nodes(config.data);
						var links = pack.links(nodes);
						
						svg.selectAll(".pack-circle")
							.data(nodes)
							.enter()
							.append("circle")
							.attr("class", "pack-circle")
							.attr("fill","rgb(31, 119, 180)")
							.attr("fill-opacity","0.4")
							.attr("cx",function(d){
								return d.x;
							})
							.attr("cy",function(d){
								return d.y;
							})
							.attr("r",function(d){
								return d.r;
							})
							.on("mouseover",function(d,i){
								d3.select(this)
									.attr("fill","yellow");
							})
							.on("mouseout",function(d,i){
								d3.select(this)
									.attr("fill","rgb(31, 119, 180)");
							});
						
						svg.selectAll("text")
							.data(nodes)
							.enter()
							.append("text")
							.attr("font-size","10px")
							.attr("fill","white")
							.attr("fill-opacity",function(d){
							  if(d.depth == 2)
								  return "0.9";
							  else
								  return "0";
							})
							.attr("x",function(d){ return d.x; })
							.attr("y",function(d){ return d.y; })
							.attr("dx",-12)
							.attr("dy",1)
							.text(function(d){ return d.name; });
						
					};
                };
            }
        };
    }]);