'use strict';

const e = React.createElement;

class Record_Button extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <button onClick={this.start}>Record</button>
        <button onClick={this.stop}>Stop Recording</button>
      </div>
    )
  }

  start = () => {
    
  }
}

const domCont = document.getElementById('record_button')
ReactDOM.render(e(Record_Button), domCont)