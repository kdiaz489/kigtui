import React, { Component } from 'react';
import './App.css';
import Sidenav from './Components/Sidenav.js';
import Chart from  './Components/revChart.js';
import firebase from 'firebase';
import {Config} from './Config.js';

class App extends Component {
  constructor(){
    super();
    this.app = firebase.initializeApp(Config);
    this.database = this.app.database().ref();

    // Try this!
    //this.database = this.app.database().ref().child('kigtinterface');

    this.state={
      evseState: [],
      evseCost: [],
      evsePower: []
    };
  }

  diff_minutes(start, end){
    var diff = (end-start)/1000;
    //diff = diff / 60;
    //return Math.abs(Math.round(diff));
    return diff;
  }


  componentWillMount(){
    //isolates the individial state properties
    const val = this.state.evseState;
    const val2 = this.state.evseCost;
    const val3 = this.state.evsePower;
    var ts1;
    var ts2;
    var startTime;
    var endTime;



    this.database.on('value', snap =>{

      //takes snapshot of entire database
      var dataset = snap.val();

      //gets keys (charger id's) from every object and makes array of them
      var keys = Object.keys(dataset);


      for( var i = 0; i < keys.length-2; i++){

          if(keys[i] === '123456789'){

            var id = keys[i];
            var chargeStation = dataset[id];
            var state = parseInt(chargeStation['EVSE State'], 10);

            //These are the variables we will be using to product the Y axis
            /// Y axis is KW used per hour for that charge
            var current = parseInt(chargeStation['EVSE Current Level'], 10);
            console.log('current = ' + current);
            //test to write to firebase
            this.database.child('123456789/EVSE Current Level').set('12');
            current = 12;



            var voltage = parseInt(chargeStation['EVSE Voltage'], 10);
            //test to write to firebase
            this.database.child('123456789/EVSE Voltage').set('20');

            var time = 7200;
            //test to write to firebase
            this.database.child('123456789/Test').set(time);

            var cost = parseInt(chargeStation['EVSE Charge Cost'],10);
            console.log('cost = ' + cost);

            var power = (current * voltage) / 1000;
            var kwhr = ((power) / (time/3600)) ;
            var costprice = power * cost;


            // If state changes to 3, then create start start time stamp
            if(state === 3){
              ts1 = new Date();
              var startTime = ts1.toTimeString();
              console.log('This state is 3 ');
              //PUSH TIME STAMP TO FIREBASE
              this.database.child('123456789/SERVER Time Start EVSE').set(ts1.getTime());
              console.log('This is the start time for state ' + state + ' time:' + ts1.getTime());
            }

            // If state changes to 2, then creates end time stamp condition
            else if (state === 2) {

              ts2 = new Date();
              var endTime = ts2.toTimeString();
              //PUSH TIME STAMP TO FIREBASE
              this.database.child('123456789/SERVER Time End EVSE').set(ts2.getTime());
              console.log('This is the end time for state ' + state + ' time:' + ts2.getTime());
              //var timeDiff = this.diff_minutes(ts2-ts1);
              //console.log('This state is 2 ' + timeDiff);
            }

            // If state changes to 1, then creates end time stamp condition
            else if (state === 1) {
              // Creates regular time stamp
              ts2 = new Date();
              // End time stamp condition
              var endTime = ts2.toTimeString();
              //PUSH TIME STAMP TO FIREBASE
              //test to write to firebase
              this.database.child('123456789/SERVER Time End EVSE').set(ts2.getTime());
              console.log('This is the end time for state ' + state + ' time:'+ ts2.getTime());

              var timeDiff = this.diff_minutes(ts2-ts1);
              console.log('The difference from state 1 and 3 is ' + timeDiff);
            }

            // Any other state this message prints out
            else{
              console.log('This state is different');
            }

            console.log('power = ' + power);
            console.log('costprice = ' + costprice);
            console.log('kwhr axis = ' + kwhr);

            val.push(kwhr);
            val2.push(cost);
            val3.push(power);

            console.log("evsestate val" + val2);
            this.setState({

              evseState: val,
              evseCost: val2,
              evsePower: val3
            });


          }
      }

    });
  }

  render() {

    return (

      <div className="wrapper">
        <Sidenav />



        <div id="content">


          <Chart title = "Utility Usage" value = {this.state.evseState} />
          <Chart title = "Charging Utilization Cost" value = {this.state.evseCost}/>
          <Chart title = "Power Flow" value = {this.state.evsePower}/>

        </div>
      </div>

    );
  }
}

export default App;
