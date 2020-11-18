'use strict';

const e = React.createElement;

class Record_Button extends React.Component {

  constructor(props) {
    super(props)
    this.state = { liked: false }
  }

  render() {

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Record'
    )
  }
}

const domCont = document.getElementById('record_button')
ReactDOM.render(e(Record_Button), domCont)