// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

angular.module('cwc.d3')
    .directive('ctxForceChart', ['$window', 'd3', function($window, d3) {
        return {
            restrict: 'A',
            scope: {
                config: '=',
                label: '@',
                onClick: '&'
            },
            link: function(scope, element, attrs) {
                var margin = scope.config.margin || { left: 0, top: 0, right: 0, bottom: 0 },
                	width = scope.config.width || 500,
                	height = scope.config.height || 500,
                	radius = scope.config.radius || 20,
                	distance = scope.config.distance || 150,
                	charge = scope.config.charge || -400;

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('class','force-svg');

                $window.onresize = function() {
                    scope.$apply();
                };

                scope.$watch(function() {
                    return element[0].clientWidth;
                }, function() {
                    scope.render(scope.config);
                });

                scope.render = function(config) {
					svg.attr("width",width)
						.attr("height",height);
					
					var force = d3.layout.force()
							.nodes(config.nodes)
							.links(config.edges)
							.size([width,height])
							.linkDistance(distance)
							.charge(charge);	// Define the acting force between each other.

					force.start();	// Begin to work.
							
					var force_edges = svg.selectAll(".force-edge")
										.data(config.edges)
										.enter()
										.append("line")
										.attr("class", "force-edge");
					
					var color = d3.scale.category20();
							
					var force_nodes = svg.selectAll(".force-node")
										.data(config.nodes)
										.enter()
										.append("circle")
										.attr("class", "force-node")
										.attr("r",radius)
										.style("fill",function(d,i){
											return color(i);
										})
										.call(force.drag);	// Make the nodes can be dragged.

					var force_texts = svg.selectAll(".force-text")
										.data(config.nodes)
										.enter()
										.append("text")
										.attr("dx", 20)
										.attr("dy", 8)
										.text(function(d){
											return d.name;
										})
										.attr("class", "force-text");
								
					// Update periodically
					force.on("tick", function(){	
						// Update edges
						force_edges.attr("x1",function(d){ return d.source.x; })
						 		.attr("y1",function(d){ return d.source.y; })
						 		.attr("x2",function(d){ return d.target.x; })
						 		.attr("y2",function(d){ return d.target.y; });
						 
						// Update nodes
						force_nodes.attr("cx",function(d){ return d.x; })
						 		.attr("cy",function(d){ return d.y; });

						// Update texts
						force_texts.attr("x", function(d){ return d.x; })
						 	.attr("y", function(d){ return d.y; });
					});
                };
            }
        };
    }]);