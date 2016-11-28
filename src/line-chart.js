import React, { Component } from 'react';
import d3 from 'd3';
import _ from 'lodash';

class D3LineChart extends Component {
	constructor(props){
		super(props);
		this.state = {
			tooltip: null
		};
	}

	static defaultProps = {
		data: [],
		width: 500,
		height: 250,
		margins: {
			top: 25,
			left: 100,
			right: 50,
			bottom: 25
		},
		currency: 'USD',
		interpolate: 'monotone',
		quarterly: false,
		showFutureArea: true
	}

	showTooltip = (context, data, quarterly) => {
		var posX = d3.mouse(this.refs.lineChart)[0] + this.refs.lineChart.offsetLeft + 50;
		var posY = d3.mouse(this.refs.lineChart)[1] + this.refs.lineChart.offsetTop - 50;

		var date = new Date(data.year);
		var year = date.getFullYear();

		var segment = '';
		if(quarterly)
			segment = 'Q' + ((date.getMonth() + 1) / 3) + ' - ';

		var tooltip =	<div className='line-tooltip' style={{position: 'absolute', left: posX, top: posY, width: 100, textAlign: 'center'}}>
							<p><strong>Time: </strong>{segment + year}</p>
							<p><strong>Amount: </strong>{data.amount.toLocaleString()}</p>
						</div>;

		this.setState({
			tooltip: tooltip
		});
	}

	hideTooltip = () => {
		this.setState({
			tooltip: null
		});
	}

	componentDidMount = () => {
		this.x = d3.time.scale().range([0, this.props.width - this.props.margins.left - this.props.margins.right]);
		this.y = d3.scale.linear().range([this.props.height - this.props.margins.top - this.props.margins.bottom, 0]);

		this.color = d3.scale.category10();

		this.xAxis = d3.svg.axis()
			.scale(this.x)
			.orient('bottom');

		this.yAxis = d3.svg.axis().scale(this.y).orient('left');

		this.line = d3.svg.line()
						.interpolate(this.props.interpolate)
						.x(d => { return this.x(d.year); })
						.y(d => { return this.y(d.amount); });

		this.svg = d3.select(this.refs.lineChart).append('svg:svg')
						.attr('width', this.props.width)
						.attr('height', this.props.height)
						.append('g')
							.attr('transform', 'translate(' + this.props.margins.left + ',' + this.props.margins.top + ')');

		this.svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (this.props.height - this.props.margins.top - this.props.margins.bottom) + ')')
			.call(this.xAxis);

		this.svg.append('g')
				.attr('class', 'y axis')
				.call(this.yAxis)
			.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('y', 6)
				.attr('dy', '.71em')
				.style('text-anchor', 'end')
				.text('Amount in ' + this.props.currency)
				.attr('pointer-events', 'none');

		setTimeout(() => {
			this.forceUpdate();
		}, 100);
	}

	componentDidUpdate = () => {
		this.updateChart();
	}


	shouldComponentUpdate = (nextProps) => {
		return !_.isEqual(nextProps.data, this.props.data) || !_.isEqual(nextProps.data, []);
	}

	updateChart = () => {
		//var chartData = this.props.data.data;
		var numYears = _.uniq(_.map(this.props.data, 'year')).length;
		if(numYears > 20) numYears = numYears / 2;
		this.xAxis.ticks(numYears);
		this.color.domain(_.map(this.props.data, d => { return d.section; }));

		/*
		this.x.domain([
			d3.min(this.props.data, a => { return d3.min(a.data, v => { return v.year; })}),
			d3.max(this.props.data, a => { return d3.max(a.data, v => { return v.year; })})
		]);

		this.y.domain([
			d3.min(this.props.data, a => { return d3.min(a.data, v => { return v.amount; })}) + .01,
			d3.max(this.props.data, a => { return d3.max(a.data, v => { return v.amount; })}) - .01
		]);*/

		this.x.domain(d3.extent(_.map(this.props.data, 'year')));
		this.y.domain([
			d3.min(this.props.data, d => { return d.amount; }) + 0.01,
			d3.max(this.props.data, d => { return d.amount; }) - 0.01
		]);

		// gray area
		if(this.props.showFutureArea){
			let currYear = String((new Date(Date.now())).getFullYear());
			let xValue = this.x(d3.time.format('%Y').parse(currYear));

			let yMax = this.props.height - this.props.margins.top - this.props.margins.bottom;
			let xMax = this.props.width - this.props.margins.left - this.props.margins.right;

			if(d3.selectAll('rect')[0].length === 0){
				this.svg.insert('rect', ':first-child')
						.attr('class', 'future-area')
						.attr('transform', 'translate(' + xValue + ', 0)')
						.attr('width', (xMax - xValue))
						.attr('height', yMax)
						.attr('fill', 'lightgray');
			}
			else {
				this.svg.selectAll('.future-area')
						.transition()
							.attr('transform', 'translate(' + xValue + ', 0)')
							.attr('width', (xMax - xValue))
			}
		}

		// Line Stuff
		let line = this.svg.selectAll('.line')
						.data(this.props.data, () => { return this.props.section; });

		line.enter().append('path')
					.attr('class', 'line')
					.attr('d', this.line(this.props.data))
					.style('stroke', () => { return this.color(this.props.section); });

		this.svg.transition().duration(500).select('.x.axis')
				.call(this.xAxis);
				/*					.selectAll('text')
						.attr("y", 0)
						.attr("x", 9)
						.attr("dy", ".35em")
						.attr("transform", "rotate(90)")
						.style('text-anchor', 'start');*/

		this.svg.transition().duration(500).select('.y.axis')
				.call(this.yAxis);

		line.transition().duration(500)
				.attr('d',this.line(this.props.data));

		line.exit().remove();


		// Circle Stuff
		let circles = this.svg.selectAll('circle')
							.data(this.props.data);

		var that = this;

		circles.enter().append('circle')
							.attr('class', 'line-point')
							.attr('r', 3)
							.style('stroke-width', 1)
							.style('stroke', 'black')
							.style('stroke-opacity', 1.0)
							.attr('cx', d => { return this.x(d.year); })
							.attr('cy', d => { return this.y(d.amount); })
							.on('mouseover', function(e){
								that.showTooltip(this, e, that.props.quarterly);

								d3.select(this).attr('r', 4.5);

								that.svg.append('line').attr('class', 'scatter-bars')
									.attr('x1', () => { return that.x(e.year); })
									.attr('x2', 0)
									.attr('y1', () => { return that.y(e.amount); })
									.attr('y2', () => { return that.y(e.amount); })
									.style('stroke-width', '1px')
									.style('stroke', 'darkgray')
									.attr('pointer-events', 'none');

								that.svg.append('line').attr('class', 'scatter-bars')
									.attr('x1', () => { return that.x(e.year); })
									.attr('x2', () => { return that.x(e.year); })
									.attr('y1', () => { return that.y(e.amount); })
									.attr('y2', () => { return that.props.height - that.props.margins.top - that.props.margins.bottom; })
									.style('stroke-width', '1px')
									.style('stroke', 'darkgray')
									.attr('pointer-events', 'none');

							})
							.on('mouseout', function(){
								that.hideTooltip();

								d3.selectAll('.scatter-bars').remove();

								d3.select(this).attr('r', 3);
							})
							.on('click', function(event) {
								//console.log(event);
								if(that.props.clickHandler)
									that.props.clickHandler(event.year);
							});

		circles.transition().duration(500)
				.attr('cx', d => { return this.x(d.year); })
				.attr('cy', d => { return this.y(d.amount); })

		circles.exit().remove();
	}

	render = () => {
		return(
			<div ref='lineChart'>
				{this.state.tooltip}
			</div>
		);
	}
}
D3LineChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	margins: React.PropTypes.object,
	currency: React.PropTypes.string,
	interpolate: React.PropTypes.string,
	quarterly: React.PropTypes.bool,
	section: React.PropTypes.string,
	showFutureArea: React.PropTypes.bool,
	clickHandler: React.PropTypes.func
};

export default D3LineChart;
