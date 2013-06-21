/*jslint indent: 2 */
/*global d3 */

function radarConfiguredLayout() {

  'use strict';

  var metrics = [],
    radius = 200,
    data = [];

  function layout() {

  }

  layout.compute = function () {

    var pointCount = 0;
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

  };

  layout.radius = function (_) {
    if (!arguments.length) {
      return radius;
    }
    radius = _;
    return layout;
  };

  layout.data = function (_) {
    if (!arguments.length) {
      return data;
    }
    data = _;
    return layout;
  };

  layout.metrics = function (_) {
    if (!arguments.length) {
      return metrics;
    }
    metrics = _;
    return layout;
  };

  return layout;
}