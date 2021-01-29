import React, { Component } from "react";
import config from "../../config";
import Token from "../../services/token-service";
import UserContext from "../../contexts/UserContext";


class DashboardRoute extends Component {
  static contextType = UserContext;

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language`, {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${Token.getAuthToken()}`,
      },
    }).then((res) =>
      !res.ok
        ? res.json().then((e) => Promise.reject(e))
        : res.json().then((data) => {
            this.context.setLanguage(data.language.name);
            this.context.setWords(data.words);
            this.context.setTotalScore(data.language.total_score);
          })
    );
  }

  renderWords() {
    return this.context.words.map((word, i) => (
      <div key={word.id}>
        <h4>{word.original}</h4> 
        <span>Correct: {word.correct_count} </span>
        <br/>
        <span>Incorrect: {word.incorrect_count} </span>
      </div>
    ))
  }

  render() {
    return (
      <div>
        {this.context.words === null ? (
          <p> Sorry, no words available! </p>
        ) : (
          <div>
            <h3> {this.context.language} </h3>
            <p>Current Score: {this.context.total_score}</p>    
            <a href="/learn" className='practice'>Practice</a>
            <h2>Words to Learn</h2>        
            <div className='center'>
              <ul
              style={{
              listStyleType: "none",
              textDecoration: "none",
              color: "inherit",
              paddingLeft: "0",
            }}>
                <li>{this.renderWords()}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default DashboardRoute
