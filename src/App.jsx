import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        value1: '',
        value2: '',
        tags: [],
        people: [],
        pass: '',
        confirmPass: ''
      }
    };

    this.formEl = React.createRef();
  }

  onChange = (e, arrayName, index, propName) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState(prevState => {
      let formData;
      let newArray;

      if (arrayName && index) {
        newArray = prevState.formData[arrayName].map(
          (el, i) => (i !== index ? el : propName ? { ...el, [propName]: value } : value)
        );
        formData = { ...prevState.formData, [arrayName]: newArray };
      } else {
        formData = { ...prevState.formData, [name]: value };
      }

      return { formData };
    }, this.validateForm);
  };

  submitHandler = e => {
    e.preventDefault();

    if (this.formEl.current.checkValidity()) {
      // Success handling can go here
      alert('Valid submit');
    }

    this.validateForm();
    this.setState({ hasBeenValidated: true });
  };

  validateForm = () => {
    this.customValidation();
    this.setErrorMessages();
  };

  customValidation = () => {
    const formEl = this.formEl.current;
    let passwordValue;

    if (formEl) {
      const formLen = formEl.length;

      for (let i = 0; i < formLen; i++) {
        const elem = formEl[i];

        // Custom Message Example
        if (elem.name === 'password') {
          elem.setCustomValidity(
            elem.validity.patternMismatch
              ? 'Password must be at least 6 characters long and contain one number'
              : ''
          );

          passwordValue = elem.value;
        }

        // Custom Rule Example: confirmPass value must match pass value
        if (elem.name === 'confirmPass') {
          elem.setCustomValidity(
            elem.value !== passwordValue
              ? 'Passwords must match'
              : elem.validity.patternMismatch
                ? 'Password must be at least 6 characters long and contain one number'
                : ''
          );
        }
      }
    }
  };

  setErrorMessages = () => {
    const errorMessages = {};
    const formEl = this.formEl.current;

    if (formEl) {
      const formLen = formEl.length;

      for (let i = 0; i < formLen; i++) {
        const input = formEl[i];

        // NOTE: Validation only works if input tags have name attributes
        // NOTE: for arrays inputs, names take the form of [arrayName]-[propName]-[index]
        // Stores inpupt's validation message in errorMessages object
        if (input.name) {
          const [mainName, propName, index] = input.name.split('-');
          if (propName) {
            if (
              !errorMessages[mainName] ||
              errorMessages[mainName].length < parseInt(index, 10) + 1
            ) {
              const obj = { [propName]: input.validationMessage };
              errorMessages[mainName] = errorMessages[mainName]
                ? errorMessages[mainName].concat(obj)
                : [obj];
            } else {
              errorMessages[mainName][index][propName] = input.validationMessage;
            }
          } else {
            errorMessages[mainName] = input.validationMessage;
          }
        }
      }

      // save new errorMessage object in state
      this.setState({ errorMessages });
    }
  };

  getErrorMsg = inputName => {
    const [mainName, index, propName] = inputName.split('-');
    const { errorMessages } = this.state;

    return index
      ? propName
        ? errorMessages[mainName][index][propName]
        : errorMessages[mainName][index]
      : errorMessages[mainName];
  };

  renderClassNames = inputName => {
    const isInvalid = !!this.getErrorMsg(inputName);
    const { hasBeenValidated } = this.state;
    const validClasses = 'form-control is-valid';
    const invalidClasses = 'form-control is-invalid';

    return hasBeenValidated ? (isInvalid ? invalidClasses : validClasses) : 'form-control';
  };

  renderErrorMsgs = inputName => {
    const errorMsg = this.getErrorMsg(inputName);
    const { hasBeenValidated } = this.state;

    return hasBeenValidated && errorMsg ? <div className="invalid-feedback">{errorMsg}</div> : null;
  };

  onNewTag = () =>
    this.setState(prevState => {
      const tags = prevState.formData.tags.concat('');
      const formData = { ...prevState.formData, tags };
      return { formData };
    });

  onNewPerson = () =>
    this.setState(prevState => {
      const people = prevState.formData.people.concat({
        firstName: '',
        lastName: ''
      });
      const formData = { ...prevState.formData, people };
      return { formData };
    });

  render() {
    const { formData, hasBeenValidated } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <form
              className={hasBeenValidated ? 'was-validated' : ''}
              onSubmit={this.onSubmit}
              noValidate
            >
              <div className="form-group">
                <label htmlFor="value1">Value 1 - Required</label>
                <input
                  type="text"
                  id="value1"
                  name="value1"
                  className={this.renderClassNames('value1')}
                  value={formData.value1}
                  onChange={this.onChange}
                  required
                />
                {this.renderErrorMsgs('value1')}
              </div>
              <div className="form-group">
                <label htmlFor="value2">Value 2 - Pattern and Max Length </label>
                <input
                  type="text"
                  id="value2"
                  name="value2"
                  className={this.renderClassNames('value2')}
                  value={formData.value2}
                  onChange={this.onChange}
                  pattern="[A-Z]\w+"
                  maxLength="5"
                />
                {this.renderErrorMsgs('value2')}
              </div>
              <section>{/* tags here */}</section>
              <section>{/* people here */}</section>
              <div className="form-group">
                <label htmlFor="pass">Password</label>
                <input
                  type="password"
                  id="pass"
                  name="pass"
                  className={this.renderClassNames('pass')}
                  value={formData.pass}
                  onChange={this.onChange}
                  required
                  pattern="^(?=.*[0-9]).{6,}$"
                />
                {this.renderErrorMsgs('pass')}
              </div>
              <div className="form-group">
                <label htmlFor="confirmPass">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPass"
                  name="confirmPass"
                  className={this.renderClassNames('confirmPass')}
                  value={formData.confirmPass}
                  onChange={this.onChange}
                  required
                  pattern="^(?=.*[0-9]).{6,}$"
                />
                {this.renderErrorMsgs('confirmPass')}
              </div>
              <div className="form-group">
                <button type="submit" onClick={this.onSubmit}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
