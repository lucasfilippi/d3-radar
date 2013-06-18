/*jslint indent: 2 */
/*global d3 */

function radar(metricConfiguration) {

  'use strict';

  var metrics = metricConfiguration,
    margin = 40,
    radius = 200,
    pointRadius = 3,
    labelOffset = radius + 10;

  function chart(selection) {

    var side = (radius + margin) * 2,
      pointCount = 0;

    selection.each(function (data) {

      // Compute configuration
      metrics = metrics.map(function (metric, i) {

        metric.scale = d3.scale.linear()
          .range([ 0, radius ])
          .domain(metric.domain);

        metric.angle = 2 * Math.PI * i / metrics.length - Math.PI / 2;

        return metric;
      });

      // Augment data
      data = data.map(function (d) {

        d.points = metrics.map(function (metric) {

          var origX = metric.scale(d.rate[metric.metric]);

          return {
            'x': origX * Math.cos(metric.angle),
            'y': origX * Math.sin(metric.angle),
            'label': d.rate[metric.metric] + '/' + metric.domain[1],
            'id': pointCount++
          };

        });

        return d;

      });

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll('svg').data([metrics]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter()
        .append('svg')
        .append('g')
        .attr('transform', 'translate(' + (side / 2) + ', ' + (side / 2) + ')');//center chart

     // Update the outer dimensions.
      svg.attr('width', side)
        .attr('height', side);

      // Generate cosmetic background
      chart.drawBackground(gEnter);

      // Generate axis
      gEnter.selectAll('.axis')
        .data(function (d) { return d; })
        .enter()
        .append('g')
        .attr('class', 'axis')
        .each(function (d) {

          d3.select(this).append('g')
            .attr('class', d.metric + ' axisScale')
            .attr('transform', 'rotate(' + (d.angle * 180 / Math.PI) + ')')
            .call(d3.svg.axis().scale(d.scale));

          d3.select(this).append('text')
            .text(d.label)
            .attr('class', 'axisLabel')
            .attr('x', function (d) {

              var pos = labelOffset * Math.cos(d.angle);

              if (Math.PI / 2 == Math.abs(d.angle)) {
                pos -= this.getComputedTextLength() / 2;
              } else if (Math.abs(d.angle) > Math.PI / 2) {
                pos -= this.getComputedTextLength() ;
              }

              return pos;
            })
            .attr('y', labelOffset * Math.sin(d.angle));

        });

      // Add actual data
      gEnter.selectAll('.radar')
        .data(data)
        .enter()
        .append('g')
        .attr('class', function (d, i) { return 'radarArea radar radar' + i; })
        .each(function () {

          d3.select(this)
            .append('path')
            .attr('class', 'radarPath')
            .attr('d', function (d) {

              return d3.svg.line()
                .x(function (d) { return d.x; })
                .y(function (d) { return d.y; })
                .interpolate('linear-closed')
                .call(this, d.points);
            });

          d3.select(this)
            .selectAll('.radarPoint')
            .data(function (d) {
              return d.points;
            })
            .enter()
            .append('circle')
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; })
            .attr('r', pointRadius)
            .attr('class', 'radarPoint')
            .attr('id', function (d) { return 'radarPoint' + d.id; });
        });

    });
  }

  chart.radius = function (_) {
    if (!arguments.length) {
      return radius;
    }
    radius = _;
    return chart;
  };

  chart.margin = function (_) {
    if (!arguments.length) {
      return margin;
    }
    margin = _;
    return chart;
  };

  chart.pointRadius = function (_) {
    if (!arguments.length) {
      return pointRadius;
    }
    pointRadius = _;
    return chart;
  };

  chart.drawBackground = function (selection) {

    var step = radius / 4;

    selection.selectAll('.background')
      .data(d3.range(step, step * 5, step).reverse())
      .enter()
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('class', 'background')
      .attr('r', function (d) { return d; });
  };

  return chart;
}
