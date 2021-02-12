import React, { Component } from 'react'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'
import UserContext from '../../contexts/UserContext'
import AuthApiService from '../../services/auth-api-service'


class RegistrationRoute extends Component {
    static defaultProps = {
    history: {
      push: () => {},
    },
    
  }

  static contextType = UserContext;

  handleRegistrationSuccess = (username, password) => {
    console.log('handleReg', username, password)
			AuthApiService.postLogin({
      username,
      password,
    })
      .then(res => {
        username.value = ''
        password.value = ''
        this.context.processLogin(res.authToken)
        this.props.history.push('/')
      })
			.catch((res) => {
				this.setState({ error: res.error });
			});
	};

  render() {
    return (
      <section>
        <p>
          Practice learning Spanish with the spaced repetition revision technique.
        </p>
        <h2>Sign up</h2>
        <RegistrationForm
          onRegistrationSuccess={this.handleRegistrationSuccess}
        />
      </section>
    );
  }
}

export default RegistrationRoute