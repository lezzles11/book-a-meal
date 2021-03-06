import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from '../../components/Forms/Form.module.css';
import FormWrapper from '../../components/Forms/FormWrapper/FormWrapper';
import FormHeadText from '../../components/Forms/FormHeadText/FormHeadText';
import Loading from '../../components/UI/Loading/Loading';
import Input from '../../components/Forms/Input/Input';
import { updateObject, checkValidity } from '../../shared/utility';
import { signIn, setAuthRedirect } from '../../redux/action';

class UserLogin extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          name: 'email',
          placeholder: 'Your Email'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          name: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 7
        },
        valid: false,
        touched: false
      }
    },
    formIsValid: false
  };

  handleUserLogin = e => {
    e.preventDefault();
    const formData = {};
    for (let formElementId in this.state.controls) {
      formData[formElementId] = this.state.controls[formElementId].value;
    }
    this.props
      .onUserSignIn(formData)
      .then(() => this.props.history.push('/menu'))
      .catch(error => console.log(error));
  };

  inputChangeHandler = (e, inputId) => {
    const formElement = updateObject(this.state.controls[inputId], {
      value: e.target.value,
      valid: checkValidity(e.target.value, this.state.controls[inputId].validation),
      touched: true
    });

    const form = updateObject(this.state.controls, {
      [inputId]: formElement
    });

    let formIsValid = true;
    for (let inputId in form) {
      formIsValid = form[inputId].valid && formIsValid;
    }

    this.setState({ controls: form, formIsValid });
  };

  render() {
    const formElements = Object.keys(this.state.controls).map(key => {
      return {
        id: key,
        config: this.state.controls[key]
      };
    });
    return this.props.loading ? (
      <Loading />
    ) : (
      <FormWrapper>
        <form
          action="#"
          method="post"
          className={classes.Page_form}
          id="loginForm"
          onSubmit={this.handleUserLogin}
        >
          <FormHeadText user="user" type="login" />
          {formElements.map(formElement => (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              invalid={!formElement.config.valid}
              touched={formElement.config.touched}
              shouldValidate={formElement.config.validation}
              changed={e => this.inputChangeHandler(e, formElement.id)}
            />
          ))}
          <button type="submit">Login</button>
          <p className={classes.Page_link}>
            No Account? <Link to="/register">Register</Link>
          </p>
          <p className={classes.Page_link}>
            Back to Home? <Link to="/">Click Here</Link>
          </p>
        </form>
      </FormWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    userAuthenticated: state.auth.isAuthenticated,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUserSignIn: data => dispatch(signIn(data)),
    onSetAuthRedirect: path => dispatch(setAuthRedirect(path))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserLogin));
