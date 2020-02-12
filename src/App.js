import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import { Grid, Avatar, Typography, Input } from "@material-ui/core";
import _ from 'lodash';

import './App.css';


class App extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      orders: [],
      matchedWorkers: [],
      workers: [],
      isLatestFirst: true
    }

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleToggleChange = this.handleToggleChange.bind(this);
  }

  //Initialize the props
  componentDidMount() {
    axios.get("API address").then(res => {
      let orders = res.data.orders;
        orders.map((order => {
        axios.get('API address').then(res => {
        let worker_list = this.state.workers;
        if(!worker_list.some(worker => worker.id === res.data.worker.id)) {
          worker_list.push(res.data.worker);
          this.setState({ workers: worker_list, matchedWorkers: worker_list})
        }
      })
      }));
      this.setState({ orders });
    });

  }

  //Handlerto filter the wanted users
  handleFilterChange = (e) => {
    if(e.target.value !== "") {
      let matchedWorkers = _.filter(this.state.workers, function(worker) {return worker.name.toLowerCase().includes(e.target.value.toLowerCase())});
      this.setState({matchedWorkers: matchedWorkers});
    }
    else {
      this.setState({matchedWorkers: this.state.workers});
    }
  }

  //Handler to toggle to sort by latest or earliest
  handleToggleChange = (e) => {
    let isLatest = this.state.isLatestFirst;
    this.setState({isLatestFirst: !isLatest});
  }

  render() {
    let orders_list = this.state.orders;
    let workers = this.state.matchedWorkers;
    let isLatestFirst = this.state.isLatestFirst;
    return (
      <div>
        <Input fullWidth id="name-input" type="text" placeholder={"Filter by worker name.."} onChange={this.handleFilterChange} />
        <br/>
        <br/>
        <div className="toggle-switch">
        <input
          type="checkbox"
          className="toggle-switch-checkbox"
          name="deadline-input"
          id="deadline-input"
          onClick={this.handleToggleChange}
        />
        <label className="toggle-switch-label" htmlFor="deadline-input">
          <span className="toggle-switch-inner" />
          <span className="toggle-switch-switch" />
        </label>
      </div>
      <div >
        <ul className="order-block">
          {/* workers is undefined when the page was initialized, prevent error happened */}
        {workers != undefined && workers.length ? _.orderBy(orders_list, 'deadline', [isLatestFirst ? "desc" : "asc"]).map((order) => {
          let workerObj = {}
          workerObj = workers.find(({id}) => id === order.workerId);
          if(workerObj !== undefined) {
          return (  
        <li key={order.id}>       
           <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
            <Avatar>{order.name.charAt(0)}</Avatar>
          </Grid>
          <Grid item xs zeroMinWidth>
            <Typography noWrap>{`Worker order: ${order.id}`}</Typography>
            <Typography noWrap>{`Name: ${order.name}`}</Typography>
            <Typography noWrap={false}>{`Desciprtion: ${order.description}`}</Typography>
            <Typography noWrap>{`Order Deadline: ${order.deadline}`}</Typography>
            <br/>
            <Typography noWrap>{`Assigned Worker: ${workerObj.name}`}</Typography>
            <Typography noWrap>{`Email: ${workerObj.email}`}</Typography>
            <Typography noWrap>{`Company Name: ${workerObj.companyName}`}</Typography>
            <img src={workerObj.image}></img>
          </Grid>
           </Grid></li>)} else return;
           }) : ""}
        </ul>
      </div>
      </div>
      
    )
  };
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
