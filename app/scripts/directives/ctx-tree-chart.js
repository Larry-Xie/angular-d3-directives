// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

angular.module('cwc.d3')
    .directive('ctxTreeChart', ['$window', 'd3', function($window, d3) {
        return {
            restrict: 'A',
            scope: {
                config: '=',
                label: '@',
                onClick: '&'
            },
            link: function(scope, element, attrs) {
                var margin = scope.config.margin || { left: 80, top: 0, right: 200, bottom: 0 },
                	width = scope.config.width || 500,
                	height = scope.config.height || 500,
                	radius = scope.config.radius || 5;

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('class','tree-svg');

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
					var tree = d3.layout.tree()
						.size([width, height-margin.right])
						.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2); });

					var diagonal = d3.svg.diagonal()
						.projection(function(d) { return [d.y+margin.left, d.x]; });

					svg.attr("width", width)
						.attr("height", height)
						.append("g")
						.attr("transform", "translate(40, 0)");

					if(config.data) {
						var nodes = tree.nodes(config.data);
						var links = tree.links(nodes);
						
						var link = svg.selectAll(".tree-link")
						  .data(links)
						  .enter()
						  .append("path")
						  .attr("class", "tree-link")
						  .attr("d", diagonal);
						
						var node = svg.selectAll(".tree-node")
						  .data(nodes)
						  .enter()
						  .append("g")
						  .attr("class", "tree-node")
						  .attr("transform", function(d) { return "translate(" + (d.y+margin.left) + "," + d.x + ")"; })
						
						node.append("circle")
						  .attr("r", radius);
						
						node.append("text")
						  .attr("dx", function(d) { return d.children ? -8 : 8; })
						  .attr("dy", 3)
						  .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
						  .text(function(d) { return d.name; });
					};
                };
            }
        };
    }]);