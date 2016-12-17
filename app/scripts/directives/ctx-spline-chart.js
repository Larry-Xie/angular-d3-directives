// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

angular.module('cwc.d3')
.directive('ctxSplineChart', ['$window', 'd3', 
function($window, d3) {
    return {
        restrict: 'A',
        scope: {
            config: '=',
            onClick: '&'
        },
        link: function(scope, element) { 
            var width = element[0].clientWidth;
            var height = element[0].clientHeight;

            if (height === 0) {
                height = 300;
            }

            var margin = {left: 60, top: 30, right: 60, bottom: 30};

            var maxOfSeries = function(series) {
                var max = Math.max.apply(null, series[0].data);
                for (var i=1; i<series.length; i++) {
                    var tmp = Math.max.apply(null, series[i].data);
                    max = Math.max(max, tmp);
                }
                return max;
            };

            var svg = d3.select(element[0])
                .append('svg')
                .style('width', '100%')
                .attr({height: height});

            var group = svg.append('g')
                .attr('transform', 'translate(' + margin.left +', ' + margin.top + ')');

            // tooltip appends to body, because it uses postion:absolute based on body
            var tooltip = d3.select('body').append('div')   
                .attr('class', 'tooltip')               
                .style('opacity', 0);

            var color = d3.scale.category20();

            var svgWidth = width - margin.left - margin.right,
                svgHeight = height - margin.top - margin.bottom;
            
            var xScale = d3.scale.ordinal();

            var yScale = d3.scale.linear()
                .range([svgHeight, 0]);

            var lineGenerator = d3.svg.line()
                .x(function(d, i) {
                    return xScale(scope.config.xAxis.categories[i]);
                })
                .y(function(d) {
                    return yScale(d);
                });

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left');

            var elementXAxis = group.append('g')
                .attr('class', 'x spline-axis')
                .attr('transform', 'translate(' + 0 +', ' + svgHeight + ')');

            var elementYAxis = group.append('g')
                .attr('class', 'y spline-axis');

            var lines = group.append('g')
                .attr('class', 'spline-lines');
              
            $window.onresize = function() {
                scope.$apply();
            };

            scope.$watch(function() {
                return angular.element($window)[0].innerWidth;
            }, function() {
                scope.render(scope.config.series);
            });

            scope.$watch('config.series', function(newData) {
                scope.render(newData);
            }, true);  

            scope.render = function(series) {
                svg.select('.spline-lines')
                    .selectAll('*').remove();

                if (!series) {
                    return;
                }

                width = element[0].clientWidth;
                svgWidth = width - margin.left - margin.right;

                svg.attr('width', width);

                xScale.domain(scope.config.xAxis.categories.map(function(d) { return d; }))
                    .rangePoints([0, svgWidth]);
                yScale.domain([0, maxOfSeries(scope.config.series)]);

                var ticks = scope.config.xAxis.categories.length;
                var base = Math.ceil(100*(ticks-1)/svgWidth); //tick width 100px
                xAxis.tickValues(scope.config.xAxis.categories.filter(function(value, index) {
                    return index % base === 0;
                }));

                elementXAxis.call(xAxis);
                elementYAxis.call(yAxis);

                for (var index=0; index<scope.config.series.length; index++) {
                    var data = scope.config.series[index].data;
                    var linesGroup = lines.append('g')
                        .attr('class', 'spline-line');

                    linesGroup
                        .append('path')
                        .attr('stroke', color(index))
                        .attr('d', lineGenerator(data));

                    linesGroup.selectAll('dot')    
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr('class', 'dot')
                        .attr('fill', color(index))
                        .attr('r', 5)
                        .attr('cx', function(d, i) { return xScale(scope.config.xAxis.categories[i]); })       
                        .attr('cy', function(d) { return yScale(d); })
                        .on('mouseover', function(d, i) {

                            d3.select(this).transition()
                                .duration(200)
                                .attr('r', 7);

                            tooltip.transition()
                                .duration(200)
                                .style('opacity', 0.8);

                            tooltip.html(scope.config.xAxis.categories[i] + '<br/>'  + d)
                                .style('left', (d3.event.pageX - 50) + 'px')
                                .style('top', (d3.event.pageY - 38) + 'px');
                            })                  
                        .on('mouseout', function() {
                            d3.select(this).transition()
                                .duration(500)
                                .attr('r', 5);
                
                            tooltip.transition()
                                .duration(500)
                                .style('opacity', 0);
                        });
                }
            };
        }
    };
}]);