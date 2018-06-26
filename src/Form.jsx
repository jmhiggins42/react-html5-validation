import React from 'react';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasBeenValidated: false
    };
    this.formEl = React.createRef();
  }

  validate = () => {
    const formEl = this.formEl.current;
    return formEl ? formEl.checkValidity() : false;
  };

  submitHandler = e => {
    e.preventDefault();
    if (this.validate()) {
      this.props.submitHandler();
    }
    this.setState({ hasBeenValidated: true });
  };

  render() {
    return (
      <form ref={this.formEl} {...this.props} onSubmit={this.submitHandler} noValidate>
        {this.props.children}
      </form>
    );
  }
}

export default Form;
