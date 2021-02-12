import React, { Component } from 'react'
import LoginForm from '../../components/LoginForm/LoginForm'
import UserContext from '../../contexts/UserContext'

class LoginRoute extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  static contextType = UserContext;

  render() {
    return (
      <section>
        <h2>Login</h2>
        <p>If you wish, please use the following account for demo purposes:</p>
        <p>Username: admin</p>
        <p>Password: pass</p>
        <LoginForm onLoginSuccess={() => this.context.handleLoginSuccess(this.props.history, this.props.location)} />
      </section>
    );
  }
}

export default LoginRoute
