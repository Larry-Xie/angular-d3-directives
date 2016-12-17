// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

angular.module('cwc.d3')
.directive('ctxPieChart', ['$window', 'd3', 
function($window, d3) {
    return {
        restrict: 'A',
        scope: {
            data: '=',
            label: '@',
            onClick: '&'
        },
        link: function(scope, element) { 
            scope.data = scope.data.filter(function(item) {
                return item.y !== 0;
            });

            if (!scope.data || scope.data.length < 1) {
                return;
            }

            var height = element[0].clientHeight;

            if (height === 0) {
                height = 300;
            }

            var svg = d3.select(element[0])
                      .append('svg')
                      .style('width', '100%')
                      .attr({height: height})
                      .append('g');

            svg.append('g')
            .attr('class', 'pie-slices');

            svg.append('g')
            .attr('class', 'pie-labels');

            svg.append('g')
            .attr('class', 'pie-lines');  

            var pie = d3.layout.pie()
              .sort(null)
              .value(function(d) { 
                return d.y; 
            });

            var color = d3.scale.category20();

            var arc = d3.svg.arc()
                      .innerRadius(0),
              arcOver = d3.svg.arc(),
              outerArc = d3.svg.arc();

            function midAngle(d){
                return d.startAngle + (d.endAngle - d.startAngle)/2;
            }

            $window.onresize = function() {
                scope.$apply();
            };

            scope.$watch(function() {
                return angular.element($window)[0].innerWidth;
                }, function() {
                scope.render(scope.data);
            });

            scope.$watch('data', function(newData) {
                scope.render(newData);
            }, true);

            scope.render = function(data) {
                svg.select('.pie-slices').selectAll('*').remove();
                svg.select('.pie-labels').selectAll('*').remove();
                svg.select('.pie-lines').selectAll('*').remove();

                if (!data) { 
                    return;
                }

                var elementWidth = element[0].clientWidth,
                    radius = Math.min(elementWidth, height)/2,
                    outerRadius = Math.round(radius * 0.8),
                    overRadius = Math.round(radius * 0.85),
                    outerArcRadius = Math.round(radius * 0.9);

                svg.attr('transform', 'translate(' + Math.round(elementWidth/2) + ',' + Math.round(Math.min(elementWidth, height)/2) + ')');

                arc.outerRadius(outerRadius);
                arcOver.outerRadius(overRadius);
                outerArc.innerRadius(outerRadius)
                        .outerRadius(outerArcRadius);

                // Pie Slices
                var slice = svg.select('.pie-slices')
                                .selectAll('path.slice')
                                .data(pie(data));

                var overSlice = svg.select('.pie-slices')
                        .append('path')
                        .attr('opacity', 0.6);

                slice.enter()
                    .append('path')
                    .style('fill', function(d, i) { 
                        return color(i); 
                    })
                    .attr('d', arc);

                slice.on('mouseover', function(d, i) {
                    overSlice.attr('d', arcOver(d))
                        .attr('fill', color(i));
                })
                .on('mouseout', function() {
                    overSlice.attr('d', null);
                });

                slice.exit()
                    .remove();    

                // Pie Lables
                var text = svg.select('.pie-labels').selectAll('text')
                    .data(pie(data));

                text.enter()
                    .append('text')
                    .attr('transform', function(d) {
                        var pos = outerArc.centroid(d);
                        pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
                        return 'translate(' + pos + ')'; 
                    })
                    .attr('dy', '5')
                    .text(function(d) {
                        return d.data.name + ': ' + d.data.y;
                    })
                    .style('text-anchor', function(d){
                        return midAngle(d) < Math.PI ? 'start':'end';
                    });

                text.exit()
                    .remove();

                // Pie Poly Lines
                var polyline = svg.select('.pie-lines').selectAll('polyline')
                    .data(pie(data));

                polyline.enter()
                    .append('polyline')
                    .attr('stroke', function(d, i) {
                        return color(i);
                    })
                    .attr('points', function(d) {
                        var pos = outerArc.centroid(d);
                        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                        return [arc.centroid(d), outerArc.centroid(d), pos];
                    });

                polyline.exit()
                    .remove();                        
            };
            
        }
    };
}]);
    