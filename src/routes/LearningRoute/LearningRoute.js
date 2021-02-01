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
      <div>
      <form className='form' onSubmit={(e) => this.submitForm(e, this.context)}>
        {this.state.answer == null && <h2 className='label'>Translate this:</h2>}
        {this.state.answer === 'correct' && (
          <div className='DisplayFeedback'>
            <h2 className='label'>Awesome!</h2>
            <p>
            '<em className='word'>{this.state.translation}</em>',<br/>
            is the translation of 
            '<em className='check'>{this.state.nextWord.nextWord}</em>', <br/>
            and you answered correctly with '<em className='word'>{this.state.guess}</em>'.</p>
              <p>Nice work!</p>
          </div>
        )}

        {this.state.answer === 'incorrect' && (
          <div className='DisplayFeedback'>
            <h2 className='label'>Sorry!</h2>
            <p>
            '<em className='word'>{this.state.translation}</em>',<br/>
            is the translation of 
            '<em className='check'>{this.state.nextWord.nextWord}</em>', <br/>
            and you answered incorrectly with '<em className='word'>{this.state.guess}</em>'.</p>
              <p>Try again!</p>
          </div>
        )}

        <span className='word'>
          {this.state.isClicked === false && this.state.nextWord ?
            this.state.nextWord.nextWord : null}
        </span>

        {this.state.isClicked === false && (<fieldset>
          <label htmlFor='learn-guess-input'
          className='label'>What is the translation of this word? </label>
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

            <p className='label'>You've gotten this translation correct <em className='right'>{this.state.correct}</em> time(s)!</p>
            <p className='label'>You've gotten this translation incorrect <em className='wrong'>{this.state.incorrect}</em> time(s).</p>
            <div className='DisplayScore'>
              <p className='label'>Your total score is: 
              <em className='word'> {this.state.total}</em></p>
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