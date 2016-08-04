import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import BarChart from './BarChart';
import _ from 'lodash';
import drawBar from './d3/drawBar';
import Tracker from './Tracker';
import Players from './Players';
import './App.css';

const tileDim = 150;

const styles = {
  header: {
    margin: 120
  },
  gridList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  gridTile: {
    width: tileDim,
    height: tileDim,
    margin: 14,
    background: '#f4f4f4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20
  },
  undoButton: {
    width: tileDim,
    height: tileDim
  },
  body: {
    display: 'flex',
    flex: 1
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'rollTally': {
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0,
        '8': 0,
        '9': 0,
        '10': 0,
        '11': 0,
        '12': 0
      },
      'rollHistory': [],
      'currentRoll': '',
      'currentPlayername': '',
      'players': ['zig','zag'],
      gameStarted: false
    }
  };

  componentDidMount() {
    drawBar.createCanvas();
  };

  selectRoll(roll) {
    let {rollTally} = this.state;
    rollTally[roll] += 1

    this.setState({
      currentRoll: roll,
      rollTally: rollTally,
      rollHistory: this.state.rollHistory.concat([roll])
    })
  };

  undoLastRoll() {
    if (this.state.rollHistory.length) {
      let {rollTally} = this.state;
      let lastRoll = this.state.rollHistory.slice(-1)[0];
      rollTally[lastRoll] -= 1;

      this.setState({
        rollTally: rollTally,
        rollHistory: this.state.rollHistory.slice(0, -1)
      });
    }
  };

  handleInputPlayer(e) {
    if (e.keyCode === 13) {
      this.setState({
        players: this.state.players.concat(this.state.currentPlayername),
        currentPlayername: ''
      });
    }
  };

  handleEnterPlayerName(e) {
    this.setState({
      currentPlayername: e.target.value
    });
  };

  handleStartGame() {
    this.setState({
      gameStarted: true
    });
  };

  render() {
    const { rollTally } = this.state;

    // player stuff




    // tracker stuff
    const gridTiles = _.range(2, 13).map(roll => {
      return <RaisedButton style={styles.gridTile} key={roll} onClick={() => this.selectRoll(roll)}>
               {roll}
             </RaisedButton>
    });

    const intro = this.state.rollHistory.length ? <BarChart rollTally={rollTally} /> : <h1></h1>;
    const undoDisabled = this.state.rollHistory.length ? false : true;
    const justRolled = this.state.rollHistory.length ?  `${this.state.rollHistory.slice(-1)} was just rolled ` : <p>No rolls yet</p>
    const pluralOrNot = this.state.rollHistory.length > 1 ? 'rolls': 'roll'
    const rollsSoFar = this.state.rollHistory.length ? <h2>There have been <strong>{this.state.rollHistory.length}</strong> {pluralOrNot} so far</h2> : <span></span>

    const app = this.state.gameStarted
                  ? <Tracker {...{intro}} rollHistory={this.state.rollHistory} {...{rollTally}} {...{styles}} {...{justRolled}} {...{rollsSoFar}} {...{gridTiles}} undoLastRoll={() => this.undoLastRoll()} {...{undoDisabled}} />
                  : <Players players={this.state.players} currentPlayername={this.state.currentPlayername} handleStartGame={this.handleStartGame.bind(this)} handleEnterPlayerName={this.handleEnterPlayerName.bind(this)} handleInputPlayer={this.handleInputPlayer.bind(this)} />

    return (
      <div className="App">
        <h1 style={styles.header}>Settlers of Catan Tracker</h1>
        {app}
        <div className='barchart'>
         {intro}
        </div>
      </div>
    );
  }
}

export default App;

// const rollTally = _.range(2, 13).map(x =>
//   <li key={x}>{x}: {this.state.rollTally[x]}</li>
// )