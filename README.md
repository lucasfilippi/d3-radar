d3-radar
========

Yet another radar chart in D3.js

This chart try to follow the convention proposed by Mike Bostock from creating reusable component described in here http://bost.ocks.org/mike/chart/

Installation

Just include d3.js (tested with v3) and d3-radar.js

Usage

First, initialize the chart with the metrics you want to use :

[
    {
      "label": "Longévité",
      "metric": "longevite",
      "domain" : [0, 10]
    }
]

Label: the label to display in the chart
Metric: the key to use in data object
Domain: min and max value passed to axis

Then you can personnalize the chart with the available setters :

radius: radius of the inner radar
margin: margin around the radar, use it for label display

The chart fit in a square, the square size is so (margin + radius) * 2;

pointRadius: radius of area edge circle
drawBackground: function to draw a background and have a nice display. Default to 4 circles.


Styles:


...

You can now bind data :

d3.json("radar.json", function(error, data) {
  d3.select("#container")
      .datum(data)
      .call(chart);
});

Data must respect this format :

[
  {
    "label" : "Michelin ENERGY SAVER + 205/55R16 91 V",
    "rate" : {
      "longevite" : 9,
      "sec" : 10,
      "humide" : 9,
      "bruit" : 7
    }
  },
  ...
]