import React, { Component } from 'react'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'


class RegistrationRoute extends Component {
    static defaultProps = {
    history: {
      push: () => {},
    },
    
  }

  handleRegistrationSuccess = () => {
    const { history } = this.props
    history.push('/')
  }

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