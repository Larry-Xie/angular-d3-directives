// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

angular.module('cwc.d3')
.directive('ctxBarColumn', ['$window', 'd3', function($window, d3) {
    return {
        restrict: 'A',
        scope: {
            config: '=',
            header: '=',
            label: '@',
            onClick: '&'
        },
        link: function(scope, element) {
            var margin = scope.config.margin || { left: 40, top: 40, right: 40, bottom: 40 },
                height = element[0].clientHeight || 300,
                border = scope.config.border || 0,
                color = scope.config.color ? function(c) { return scope.config.color[c%scope.config.color.length]; } : d3.scale.category20(),
                svgWidth = element[0].clientWidth - margin.left - margin.right,
                svgHeight = height - margin.top - margin.bottom,
                series = scope.config.series,
                yAxisPadding = scope.config.yAxis.padding || -10,
                innerPadding = 0.1,
                outerPaddingGap = 10;

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

            var maxSumOfSeries = function (series) {
                return Math.max.apply(null, sumOfSeries(series));
            };

            function getMaxTextLength(element) {
                var maxTextLength = 0;
                element.each(function () {
                    var textLength = d3.select(this).node().getComputedTextLength();
                    maxTextLength = (maxTextLength < textLength) ? textLength : maxTextLength;
                });
                return maxTextLength;
            }

            function wrap(element, width, padding) {
                element.each(function () {
                    var self = d3.select(this),
                        textLength = self.node().getComputedTextLength(),
                        text = self.text();

                    while (textLength > (width - 2 * padding) && text.length > 0) {
                        text = text.slice(0, -1);
                        self.text(text + '...');
                        textLength = self.node().getComputedTextLength();
                    }
                });
            }

            $window.onresize = function() {
                scope.$apply();
            };

            scope.$watch(function() {
                return element[0].clientWidth;
            }, function() {
                scope.render(scope.config);
            });

            var svg = d3.select(element[0])
                .append('svg')
                .style('width', '100%')
                .attr({height: height})
                .append('g')
                .attr('transform', 'translate(' + margin.left +', ' + margin.top + ')');

            scope.render = function() {
                svg.selectAll('*').remove();
                svgWidth = element[0].clientWidth - margin.left - margin.right;

                if (svgWidth <= 0) {
                    return;
                }

                var xScale = d3.scale.ordinal()
                    .domain(d3.range(0, scope.config.categories.length));

                var yScale = d3.scale.linear()
                    .range([svgHeight, 0]);

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .ticks(5)
                    .tickSize(svgWidth)
                    .orient('right');

                var gx = svg.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0, ' + svgHeight + ')');

                var gy = svg.append('g')
                    .attr('class', 'y axis');

                var maxRange = 0;
                if (series.length > 0 && typeof series[0] === 'number') {
                    maxRange = d3.max(series);
                } else if (series.length > 0 && typeof series[0] === 'object') {
                    maxRange = maxSumOfSeries(series);
                }

                yScale.domain([0, maxRange]);

                gy.call(yAxis);
                var yAxisText  = gy.selectAll('text')
                    .attr('x', 4)
                    .attr('dy', -4);

                var maxTextLength = getMaxTextLength(yAxisText);

                var xAxisTicks = scope.config.categories.length;
                var outerPadding = (maxTextLength+outerPaddingGap)/((svgWidth-2*(maxTextLength+outerPaddingGap))/xAxisTicks*(1-innerPadding));
                if (outerPadding < 0 ) {
                    return;
                }
                xScale.rangeRoundBands([0, svgWidth], innerPadding, outerPadding);
                gx.call(xAxis);

                if (series.length > 0 && typeof series[0] === 'number') {
                    svg.append('g')
                        .attr('class', 'bar-column')
                        .selectAll('rect')
                        .data(series)
                        .enter()
                        .append('rect')
                        .attr('fill', function(d, i) { return color(i); })
                        .attr('height', 0)
                        .attr('width', xScale.rangeBand())
                        .attr('rx', border)
                        .attr('ry', border)
                        .attr('x', function(d, i) {
                            return xScale(i);
                        })
                        .attr('y', function(d) {
                            return yScale(d);
                        })
                        .transition()
                        .duration(500)
                        .attr('height', function(d) {
                            return svgHeight - yScale(d);
                        });
                } else if (series.length > 0 && typeof series[0] === 'object') {
                    for (var index=0; index<series.length; index++) {
                        svg.append('g')
                            .attr('class', 'bar-column')
                            .selectAll('rect')
                            .data(series[index].data)
                            .enter()
                            .append('rect')
                            .attr('fill', color(index))
                            .attr('height', 0)
                            .attr('width', xScale.rangeBand())
                            .attr('rx', border)
                            .attr('ry', border)
                            .attr('x', function(d, i) {
                                return xScale(i);
                            })
                            .attr('y', function(d, i) {
                                var pos = 0;
                                for (var x=0; x<=index; x++) {
                                    pos += series[x].data[i];
                                }
                                return yScale(pos);
                            })
                            .transition()
                            .duration(500)
                            .attr('height', function(d) {
                                return svgHeight - yScale(d);
                            });
                    }
                }

                var xAxisText = gx.selectAll('text');

                var band = xScale.rangeBand();

                xAxisText.data(scope.config.categories)
                    .text(function(d) { return d; });

                var maxXAxisTextLength = getMaxTextLength(xAxisText);

                if (maxXAxisTextLength > band && band < 25) {
                    xAxisText.remove();
                }
                else if (maxXAxisTextLength > band) {
                    xAxisText.attr('transform', 'rotate(-30)')
                        .style('text-anchor', 'end')
                        .call(wrap, margin.bottom, 0);
                }

                if (!!scope.config.yAxis) {                
                    gy.append('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', yAxisPadding)
                    .style('text-anchor', 'end')
                    .text(scope.config.yAxis.title);
                }
            };
        }
    };
}]);