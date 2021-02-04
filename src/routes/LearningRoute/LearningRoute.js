import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'
import UserContext from '../../contexts/UserContext'
import Token from '../../services/token-service'

class LearningRoute extends Component {
  static contextType = UserContext

  state = {}

  handleNext() {
    this.setState({
      isClicked: false,
      correct: this.state.response.wordCorrectCount,
      incorrect: this.state.response.wordIncorrectCount,
      translation: '',
      answer: null,
      nextWord: {
        nextWord: this.state.response.nextWord,
        totalScore: this.state.response.totalScore,
        wordCorrectCount: this.state.response.wordCorrectCount,
        wordIncorrectCount: this.state.response.wordIncorrectCount
      }
    })
  }

  async componentDidMount() {
    try {
      const response = await fetch(
        `${config.API_ENDPOINT}/language/head`,
        {
          headers:{
            authorization: `bearer ${Token.getAuthToken()}`,
          },
        }
    )
        
    const results = await response.json()
    this.context.setNextWord(results)
    this.setState({nextWord: results})
    this.setState({
      correct: results.wordCorrectCount,
      incorrect: results.wordIncorrectCount,
      total: results.totalScore,
      isClicked: false,
      score: null
    })
    } catch (e) {
      this.setState({ error: e })
    }
  }

  async submitForm(e) {
    e.preventDefault() 
    const guess = e.target.guess.value.toLowerCase().trim()
    e.target.guess.value = ''
    this.setState({guess: guess})
    this.context.setGuess(guess)

    try {
      const results = await fetch(
        `${config.API_ENDPOINT}/language/guess`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `bearer ${Token.getAuthToken()}`
          },
          body: JSON.stringify({guess: guess}),
        }
      )

      const answers = await results.json()
      this.context.setResponse(answers)
      this.setState({
        response: answers,
        total: answers.totalScore,
        isClicked: true,
        translation: answers.answer,
      })
    } catch (e) {
      this.setState({error: e})
    }

    if(this.state.response.isCorrect) {
      this.setState({
        answer: 'correct',
        correct: this.state.correct + 1
      })
    } else {
      this.setState({
        answer: 'incorrect',
        incorrect: this.state.incorrect + 1
      })
    }
  }



  render() {
    return (
      <div style={{ textDecoration: "none", color: "inherit", border: "1px solid black", padding: "5px", marginTop: "5px" }}>
      <form onSubmit={(e) => this.submitForm(e, this.context)}>
        {this.state.answer == null && <h2>Translate this:</h2>}
        {this.state.answer === 'correct' && (
          <div>
            <h2>Awesome!</h2>
            <p>
            '<em>{this.state.translation}</em>',<br/>
            is the translation of 
            '<em>{this.state.nextWord.nextWord}</em>', <br/>
            and you answered correctly with '<em>{this.state.guess}</em>'.</p>
              <p>Nice work!</p>
          </div>
        )}

        {this.state.answer === 'incorrect' && (
          <div>
            <h2>Sorry!</h2>
            <p>
            '<em>{this.state.translation}</em>',<br/>
            is the translation of 
            '<em>{this.state.nextWord.nextWord}</em>', <br/>
            and you answered incorrectly with '<em>{this.state.guess}</em>'.</p>
              <p>Try again!</p>
          </div>
        )}

        <span>
          {this.state.isClicked === false && this.state.nextWord ?
            this.state.nextWord.nextWord : null}
        </span>

        {this.state.isClicked === false && (<fieldset>
          <label htmlFor='learn-guess-input'
        >What is the translation of this word? </label>
          <br/>
          <input
            name='guess'
            id='learn-guess-input'
            type='text'
            required></input>
            {this.state.isClicked === false && (
              <button type='submit'>Submit Answer</button>
            )}
            </fieldset>)}

            <p>Total correct translations of this word <em>{this.state.correct}</em></p>
            <p>Total incorrect translations of this word <em>{this.state.incorrect}</em></p>
            <div>
              <p>Your total score overall is: 
              <em> {this.state.total}</em></p>
            </div>
        </form>
      {!!this.state.answer && (
        <div>
        <button onClick={() => this.handleNext()}>Next Word!</button>
        <br />
        <br />
          <Link
            to='/'>
            Return to Dashboard
          </Link>
        </div>
      )}
      </div>
    );
  }
}

export default LearningRoute