import React from 'react';
import Form from './Form';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value1: ''
    };
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmit = e => {
    e.preventDefault();
    // STUFF
  };

  render() {
    return (
      <div className="App">
        <Form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="value1">Value 1 - Required</label>
            <input
              type="text"
              id="value1"
              name="value1"
              className="form-control"
              value={this.state.value1}
              onChange={this.onChange}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" onClick={this.onSubmit}>
              Submit
            </button>
          </div>
        </Form>
      </div>
    );
  }
}

export default App;
