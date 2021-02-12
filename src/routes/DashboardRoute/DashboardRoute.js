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
      <div key={word.id} style={{ textDecoration: "none", color: "inherit", border: "1px solid black", padding: "5px", margin: "5px" }}>
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
            <h2> {this.context.language} </h2>
            <p>Current Score: {this.context.total_score}</p>    
            <h3><a href="/learn" style={{ textDecoration: "none", color: "inherit", border: "1px solid black", padding: "5px" }}>Practice</a></h3>
            <hr
                style={{
                  width: "75%",
                  border: " 1px solid black",
                  backgroundColor: "black",
                }}
              />
            <h2>Words to Learn</h2>        
            <div>
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
