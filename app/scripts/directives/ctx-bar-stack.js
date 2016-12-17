// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

angular.module('cwc.d3')
.directive('ctxBarStack', ['$window', 'd3', 
function($window, d3) {
    return {
        restrict: 'A',
        scope: {
          config: '=',
          label: '@',
          onClick: '&'
        },
        link: function(scope, element) {
            var margin = scope.config.margin || { left: 0, right: 0 },
                barHeight = scope.config.barHeight || 80,
                barPadding = scope.config.barPadding || 5,
                barLabelPadding = scope.config.barLabelPadding || 8,
                leftLabelWidth = scope.config.leftLabelWidth || 0,
                leftLabelPadding = scope.config.leftLabelPadding || 0,
                maxLeftLabelWidth = scope.config.maxLeftLabelWidth || 240,
                minBarWidth = scope.config.minBarWidth || 30,
                totalBarWidth = scope.config.totalBarWidth || 50,
                fontHeight = scope.config.fontHeight || 10,
                border = scope.config.border || 0,
                overlap = 1, // may exist 1px gap between 2 bars
                totalPadding = (scope.config.totalPadding || 4) + overlap;

            var svg = d3.select(element[0])
                .append('svg')
                .style('width', '100%');

            $window.onresize = function() {
                scope.$apply();
            };

            scope.$watch(function() {
                return element[0].clientWidth;
            }, function() {
                scope.render(scope.config);
            });

            // scope.$watch('data', function(newData) {
            //     scope.render(newData);
            // }, true);

            var sumOfSeries = function (series) {
                var sum = [], i, j;

                if (!series || series.length === 0) {
                    return;
                }

                for (j=0; j<series[0].data.length; j++) {
                    sum.push(series[0].data[j]);
                }
                for (i=1; i<series.length; i++) {
                    for (j=0; j<series[i].data.length; j++) {
                        sum[j] += series[i].data[j];
                    }
                }

                return sum;
            };

            function wrap(element, width, padding) {
                element.each(function () {
                    var self = d3.select(this),
                        textLength = self.node().getComputedTextLength(),
                        text = self.text();
                    leftLabelWidth = (leftLabelWidth < textLength) ? textLength : leftLabelWidth;
                    while (textLength > (width - 2 * padding) && text.length > 0) {
                        text = text.slice(0, -1);
                        self.text(text + '...');
                        textLength = self.node().getComputedTextLength();
                    }
                });

                leftLabelWidth = (leftLabelWidth > maxLeftLabelWidth) ? maxLeftLabelWidth : leftLabelWidth;
            }

            var maxSumOfSeries = function (series) {
                return Math.max.apply(null, sumOfSeries(series));
            };

            scope.render = function() {
                svg.selectAll('*').remove();

                if (scope.config.showLeftLabel) {
                    svg.append('g')
                        .attr('class', 'bar-left-label')
                        .selectAll('text')
                        .data(scope.config.categories)
                        .enter()
                        .append('text')
                        .attr('y', function(d, i) {
                            return i * (barHeight + barPadding) + barHeight/2 + fontHeight/2;
                        })
                        .attr('x', margin.left)
                        .append('tspan')
                        .text(function(d) { 
                            return d; 
                        })
                        .call(wrap, maxLeftLabelWidth, 0);
                }

                var elementWidth = element[0].clientWidth,
                    width = elementWidth - margin.left - leftLabelWidth - leftLabelPadding - margin.right - totalPadding - totalBarWidth;
                if (width <= 0 || !scope.config || !scope.config.series) {
                    return;
                }
                var series = scope.config.series,
                    total = { name: 'Total' },
                    index, yOffset,                 
                    height = scope.config.series[0].data.length * (barHeight + barPadding),
                    color = scope.config.color ? function(c) { return scope.config.color[c%scope.config.color.length]; } : d3.scale.category20(),
                    xScale = d3.scale.linear()
                        .domain([0, maxSumOfSeries(series)])
                        .range([0, width]),
                    leftStartPosition = margin.left + leftLabelWidth + leftLabelPadding;

                total.data = sumOfSeries(series);

                svg.attr('height', height);

                for (index=0; index<series.length; index++) {
                    yOffset = index * (barHeight + barPadding);
                    svg.append('g')
                        .attr('class', 'bar-stack')
                        .selectAll('rect')
                        .data(series[index].data)
                        .enter()
                        .append('rect')
                        .attr('height', barHeight)
                        .attr('rx', border)
                        .attr('ry', border)
                        .attr('x', function(d, i) {
                            var pos = 0;
                            for (var x=0; x<index; x++) {
                                pos += series[x].data[i];
                            }
                            return leftStartPosition + xScale(pos);
                        })
                        .attr('y', function(d, i) {
                            return i * (barHeight + barPadding);
                        })
                        .attr('width', 0)
                        .attr('fill', color(index))
                        .transition()
                        .duration(500)
                        .attr('width', function(d) {
                            return xScale(d) + overlap; 
                        });

                    if (scope.config.showLabel) {
                        svg.append('g')
                            .attr('class', 'bar-text')
                            .selectAll('text')
                            .data(series[index].data)
                            .enter()
                            .append('text')
                            .attr('y', function(d, i) {
                                return i * (barHeight + barPadding) + barHeight/2 + fontHeight/2;
                            })
                            .attr('x', function(d, i) {
                                var textPos = leftStartPosition + xScale(series[index].data[i]) - barLabelPadding;
                                for (var x=0; x<index; x++) {
                                    textPos += xScale(series[x].data[i]);
                                }
                                return textPos;
                            })
                            .text(function(d) {
                                // ignore text when width too narrow
                                return xScale(d) > minBarWidth ? d : '';
                            });
                    }
                }

                if (scope.config.showTotal) {
                    svg.append('g')
                        .attr('class', 'bar-stack-total')
                        .selectAll('rect')
                        .data(total.data)
                        .enter()
                        .append('rect')
                        .attr('height', barHeight)
                        .attr('rx', border)
                        .attr('ry', border)
                        .attr('x', function(d) {
                            return leftStartPosition + totalPadding + xScale(d);
                        })
                        .attr('y', function(d, i) {
                            return i * (barHeight + barPadding);
                        })
                        .attr('width', function() {
                            return 0;
                        })
                        .transition()
                        .duration(500)
                        .attr('width', function() {
                            return totalBarWidth;
                        });

                    svg.append('g')
                        .attr('class', 'bar-text-total')
                        .selectAll('text')
                        .data(total.data)
                        .enter()
                        .append('text')
                        .attr('y', function(d, i) {
                            return i * (barHeight + barPadding) + barHeight/2 + fontHeight/2;
                        })
                        .text(function(d) {
                            return d;
                        })
                        .attr('x', function(d) {
                            var textLength = d3.select(this).node().getComputedTextLength();
                            return leftStartPosition + totalPadding + xScale(d) + (totalBarWidth-textLength)/2;
                        });
                }
            };
        }
    };
}]);