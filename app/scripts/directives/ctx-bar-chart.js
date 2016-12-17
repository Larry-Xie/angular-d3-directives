// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

angular.module('cwc.d3')
    .directive('ctxBarChart', ['$window', 'd3', function($window, d3) {
        return {
            restrict: 'A',
            scope: {
                data: '=',
                header: '=',
                label: '@',
                onClick: '&'
            },
            link: function(scope, element, attrs) {
                var margin_top = 0,
                    margin_left = 70,
                    barHeight = parseInt(attrs.barHeight) || 40,
                    barPadding = parseInt(attrs.barPadding) || 10;

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('class','svg');

                $window.onresize = function() {
                    scope.$apply();
                };

                scope.$on('result', function(event, data) {
                    if(scope.data !== data) {
                        scope.data = data;
                        scope.render(data);
                    }
                });

                scope.$watch(function() {
                    return element[0].clientWidth;
                }, function() {
                    scope.render(scope.data);
                });

                scope.$watch('data', function() {
                    scope.render(scope.data);
                }, true);

                scope.render = function(data) {
                    svg.selectAll('*').remove();
                    if (!data) {
                        return;
                    }

                    var width = element[0].clientWidth - margin_left,
                        height = data.length * barHeight + margin_top,
                        xMax = d3.max(data, function(d) {
                            return d.count;
                        }),
                        months = data.map(function(d) {
                            return d.month;
                        }),
                        xScale = d3.scale.linear()
                            .domain([0, xMax + 1])
                            .range([20, width]),
                        yScale = d3.scale.ordinal()
                            .domain(months)
                            .rangeRoundBands([0, height - margin_top], '.1');

                    if(width <= 0) {
                        return;
                    }

                    var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient('left');

                    svg.attr('height', height);

                    svg.selectAll('.rect')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('class', 'rect')
                        .attr('transform', 'translate(' + margin_left + ',' + margin_top + ')')
                        .attr('x', 0)
                        .attr('y', function(d) {
                            return yScale(d.month);
                        })
                        .attr('width', 0)
                        .attr('height', barHeight - barPadding)
                        .transition()
                        .duration(1000)
                        .attr('width', function(d) {
                            return xScale(d.count);
                        });

                    svg.selectAll('.text')
                        .data(data)
                        .enter()
                        .append('text')
                        .attr('class', 'text')
                        .attr('transform', 'translate(' + margin_left + ',' + margin_top + ')')
                        .attr('x', 0)
                        .attr('y', function(d) {
                            return yScale(d.month);
                        })
                        .text(function(d) {
                            return d.count;
                        })
                        .attr('dx', 0)
                        .attr('dy', function() {
                            return (yScale.rangeBand() + barPadding) / 2;
                        })
                        .transition()
                        .duration(1000)
                        .attr('x', function(d) {
                            return xScale(d.count) - 5;
                        });

                    svg.append('g')
                        .attr('class', 'axis')
                        .attr('transform', 'translate(' + margin_left + ',' + margin_top + ')')
                        .call(yAxis);

                    svg.append('text')
                        .attr('class', 'title')
                        .attr('x', width / 2)
                        .attr('y', margin_top / 2)
                        .text(scope.header);
                };
            }
        };
    }]);