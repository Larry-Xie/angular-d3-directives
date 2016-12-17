// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

angular.module('cwc.d3')
    .directive('ctxLineChart', ['$location', '$window', 'd3', function($location, $window, d3) {
        return {
            restrict: 'A',
            scope: {
                config: '=',
                onClick: '&'
            },
            link: function(scope, element, attrs) {
                var height = parseInt(attrs.height) || element[0].clientHeight || 365;
                var margin_top = parseInt(attrs.margin_top) || 16;
                var margin_right = parseInt(attrs.margin_right) || 30;
                var margin_bottom = parseInt(attrs.margin_bottom) || 36;
                var margin_left = parseInt(attrs.margin_left) || 30;
                var grad_color = scope.config.grad_color || [
                    {offset: '1%', color: '#2484c6', opacity: 0.2},
                    {offset: '99%', color: '#2484c6', opacity: 0}
                ];

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr({height: height})
                    .attr('class', 'line-svg');

                $window.onresize = function() {
                    scope.$apply();
                };

                scope.$watch(function() {
                    return element[0].clientWidth;
                }, function() {
                    scope.render(scope.config.series);
                });

                scope.$watch('config.series', function() {
                    scope.render(scope.config.series);
                }, true);

                scope.render = function(series) {
                    svg.selectAll('*').remove();

                    if (!series) {
                        return;
                    }

                    var data = scope.config.series.data,
                        width = element[0].clientWidth,
                        svgWidth = width - margin_left - margin_right,
                        svgHeight = height - margin_top - margin_bottom;

                    var group = svg.append('g')
                        .attr('transform', 'translate(' + margin_left +', ' + margin_top + ')');

                    var tooltip = d3.select('body')
                        .append('div')
                        .attr('class', 'line-tooltip')
                        .style('opacity', 0);

                    var xScale = d3.scale.ordinal()
                        .domain(d3.range(0, scope.config.xAxis.categories.length))
                        .rangePoints([0, svgWidth]);

                    var yScale = d3.scale.linear()
                        .domain([0, d3.max(scope.config.series.data) + 5])
                        .range([svgHeight, 0]);

                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .tickFormat(function(d, i) { return scope.config.xAxis.categories[i]; })
                        .orient('bottom')
                        .innerTickSize(-svgHeight)
                        .outerTickSize(0)
                        .tickPadding(15);

                    group.append('g')
                        .attr('class', 'line-axis')
                        .attr('transform', 'translate(' + 0 +', ' + svgHeight + ')')
                        .call(xAxis);

                    // Define the area fill
                    var	area = d3.svg.area()
                        .x(function(d, i) { return xScale(i); })
                        .y0(svgHeight)
                        .y1(function(d) { return yScale(d); });

                    group.append('defs')
                        .append('linearGradient')
                        .attr('id', 'line-gradient')
                        .attr('gradientUnits', 'userSpaceOnUse')
                        .attr('x1', 0).attr('y1', 0)
                        .attr('x2', 0).attr('y2', svgHeight)
                        .selectAll('stop')
                        .data(grad_color)
                        .enter().append('stop')
                        .attr('offset', function(d) { return d.offset; })
                        .attr('stop-color', function(d) { return d.color; })
                        .attr('stop-opacity', function(d) { return d.opacity; });

                    // Add the area path.
                    group.append('path')
                        .datum(data)
                        .attr('d', area)
                        .style('fill', 'url("' + $location.absUrl() + '#line-gradient' + '")');

                    var lineGenerator = d3.svg.line()
                        .x(function(d, i) { return xScale(i); })
                        .y(function(d) { return yScale(d); });

                    var linesGroup = group.append('g')
                        .attr('class', 'line-line');

                    linesGroup.append('path')
                        .attr('d', lineGenerator(data));

                    linesGroup.selectAll('dot')
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr('class', 'line-dot')
                        .attr('r', 5)
                        .attr('cx', function(d, i) { return xScale(i); })
                        .attr('cy', function(d) { return yScale(d); })
                        .on('mouseover', function(d) {
                            tooltip.transition()
                                .duration(200)
                                .style('opacity', 0.8);

                            tooltip.html(d + ' units')
                                .style('left', (d3.event.pageX - 35) + 'px')
                                .style('top', (d3.event.pageY - 42) + 'px');
                        })
                        .on('mouseout', function() {
                            tooltip.transition()
                                .duration(500)
                                .style('opacity', 0);
                        });
                };
            }
        };
    }]);