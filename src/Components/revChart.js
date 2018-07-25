import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import './revChart.css';


class revChart extends Component{

	constructor(props){
		super(props);
		this.state={
			chartData:{
				labels: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
				datasets:[

				{

					label:'Data',
					data:[
						6123,
						4562,
						6543,
						9876

					],
					backgroundColor:[
						'rgba(77, 182, 92,0.8)',
						'rgba(77, 182, 92,0.8)',
						'rgba(77, 182, 92,0.8)',
						'rgba(77, 182, 92,0.8)'



					]

					}
				]
			}
		}
	}

	render(){


		return(
			<div>

				<h4 className="chartTitle">{this.props.title + ' ______'}</h4>
				<div className="chart">

					<Bar
					data ={this.state.chartData}

					options={{
						legend:{
							display: false
						},

						maintainAspectRation: false
					}}
					/>
				</div>
			</div>



			);
	}
}

export default revChart;
