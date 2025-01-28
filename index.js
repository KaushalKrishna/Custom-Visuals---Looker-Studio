const dscc = require('@google/dscc');
const d3 = require('d3');

// Render Gantt Chart
function renderGanttChart(data) {
  const parsedData = parseData(data);
  const container = d3.select('#chart');

  container.selectAll('*').remove(); // Clear previous renderings

  const margin = { top: 20, right: 30, bottom: 40, left: 150 };
  const width = container.node().clientWidth - margin.left - margin.right;
  const height = container.node().clientHeight - margin.top - margin.bottom;

  const svg = container
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleTime()
    .domain([d3.min(parsedData, d => d.start), d3.max(parsedData, d => d.end)])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(parsedData.map(d => d.task))
    .range([0, height])
    .padding(0.1);

  svg.append('g')
    .call(d3.axisLeft(y));

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.selectAll('.bar')
    .data(parsedData)
    .enter()
    .append('rect')
    .attr('x', d => x(d.start))
    .attr('y', d => y(d.task))
    .attr('width', d => x(d.end) - x(d.start))
    .attr('height', y.bandwidth())
    .attr('fill', d => d.color || '#69b3a2');
}

// Parse Looker Studio Data
function parseData(data) {
  return data.tables.DEFAULT.map(row => ({
    task: row.task[0],
    start: new Date(row.start[0]),
    end: new Date(row.end[0]),
    color: row.color ? row.color[0] : null,
  }));
}

// Subscribe to data updates
function drawViz(data) {
  renderGanttChart(data);
}

dscc.subscribeToData(drawViz);