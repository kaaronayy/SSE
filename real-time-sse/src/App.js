import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getInitialFlightData } from "./DataProvider";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: getInitialFlightData()
    };

    this.columns = [
      {
        Header: "Origin",
        accessor: "origin"
      },
      {
        Header: "Flight",
        accessor: "flight"
      },
      {
        Header: "Arrival",
        accessor: "arrival"
      },
      {
        Header: "State",
        accessor: "state"
      }
    ];

    this.eventSource = new EventSource("events");  
  }


    componentDidMount() {
      this.eventSource.addEventListener("flightStateUpdate", e =>
        this.updateFlightState(JSON.parse(e.data))
      );
      this.eventSource.addEventListener("flightRemoval", e =>
        this.removeFlight(JSON.parse(e.data))
      );
    }

    removeFlight(flightInfo) {
      const newData = this.state.data.filter(
        item => item.flight !== flightInfo.flight
      );

      this.setState(Object.assign({}, { data: newData }));
    }

    
  
    updateFlightState(flightState) {
      let newData = this.state.data.map(item => {
        if (item.flight === flightState.flight) {
          item.state = flightState.state;
        }
        return item;
      });
  
      this.setState(Object.assign({}, { data: newData }));
    }
  
    render() {
    return (
    <div className="App">
      <button onClick={() => this.stopUpdates()}>Stop updates</button>
      <ReactTable
        data={this.state.data}
        columns={this.columns}
      />
    </div>
  );
}

stopUpdates() {
  this.eventSource.close();
}
  }


  export default App;