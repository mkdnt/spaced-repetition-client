import React, { Component } from 'react'
import config from '../../config'
import UserContext from '../../contexts/UserContext'
import Token from '../../services/token-service'
import './LearningRoute.css'

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
            <h2 className='label'>That's the right answer!</h2>
            <p className='label'>We were looking for 
            '<em className='word'>{this.state.translation}</em>',<br/>
            for the translation of 
            '<em className='check'>{this.state.nextWord.nextWord}</em>', <br/>
            and you said '<em className='word'>{this.state.guess}</em>'.</p>
              <p>Sweet!</p>
          </div>
        )}

        {this.state.answer === 'incorrect' && (
          <div className='DisplayFeedback'>
            <h2 className='label'>Sorry, that's the wrong answer!</h2>
            <p className='label'>We were looking for 
            '<em className='word'>{this.state.translation}</em>',<br/>
            for the translation of 
            '<em className='check'>{this.state.nextWord.nextWord}</em>', <br/>
            and you said '<em className='word'>{this.state.guess}</em>'.</p>
              <p>Try again!</p>
          </div>
        )}

        <span className='word'>
          {this.state.isClicked === false && this.state.nextWord ?
            this.state.nextWord.nextWord : null}
        </span>

        {this.state.isClicked === false && (<fieldset>
          <label htmlFor='learn-guess-input'
          className='label'>What does this translate to? </label>
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

            <p className='label'>You have translated this correctly <em className='right'>{this.state.correct}</em> time(s)!</p>
            <p className='label'>You have translated this incorrectly <em className='wrong'>{this.state.incorrect}</em> time(s).</p>
            <div className='DisplayScore'>
              <p className='label'>Your total score is: 
              <em className='word'> {this.state.total}</em></p>
            </div>
        </form>
      {!!this.state.answer && (
        <button onClick={() => this.handleNext()}>Gimme Another!</button>
      )}
      </div>
    );
  }
}

export default LearningRoute