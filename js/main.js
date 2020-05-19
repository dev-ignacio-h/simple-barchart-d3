/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/
var margin = { left: 100, right: 10, top: 10, bottom: 150 }

var width = 600 - margin.left - margin.right
var height = 400 - margin.top - margin.bottom

var flag = true

var t = d3.transition().duration(750)

var g = d3.select('#chart-area')
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
            .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`)

var xAxisGroup = g.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`)
    
var yAxisGroup = g.append('g')
    .attr('class', 'y axis')

// X Scale
var x = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.2)
    .paddingOuter(0.2)

// Y Scale
var y = d3.scaleLinear()
    .range([height, 0])

// x label
g.append('text')
    .attr('class', 'x axis-label')
    .attr('x', width / 2)
    .attr('y', height + 60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('Month')

// y label
var yLabel = g.append('text')
    .attr('class', 'y axis-label')
    .attr('x', - height / 2)
    .attr('y', - 60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Revenue')

// Get Data
d3.json('data/revenues.json').then(function(data){
    data.forEach(d => {
        d.revenue = +d.revenue
        d.profit = +d.profit
    });    
    
    d3.interval(() => {
        var newData = flag ? data : data.slice(1)
        update(newData)
        flag = !flag
    }, 1000)  
    
    // Run the viz for the first time
    update(data)
})

function update (data) {
    var value = flag ? 'revenue' : 'profit'

    x.domain(data.map (d => d.month))
    y.domain([0, d3.max(data, d => d[value])])

    // X Axis
    var xAxisCall = d3.axisBottom(x)
    xAxisGroup.transition(t).call(xAxisCall)

    // Y Axis
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(d => `$${d}`)
    yAxisGroup.transition(t).call(yAxisCall)

    // JOIN new data width old elements
    var rects = g.selectAll('rect')
        .data(data, d => d.month)

    // EXIT old elements not present in new data
    rects.exit()
        .attr('fill', 'peru')
    .transition(t)
        .attr('y', y(0))
        .attr('height', 0)
        .remove()
    
    
    
        

    // ENTER new elements present in new data
    rects.enter()
        .append('rect')
            .attr('fill', 'steelblue')
            .attr('y', y(0))
            .attr('height', 0)
            .attr('x', d => x(d.month))
            .attr('width', x.bandwidth())
            // UPDATE old elements present in new data
            .merge(rects)
            .transition(t)
                .attr('x', d => x(d.month))
                .attr('width', x.bandwidth)
                .attr('y', d => y(d[value]))
                .attr('height', d => height - y(d[value]))

    var label = flag ? 'Revenue' : 'Profit'
    yLabel.text(label)
}