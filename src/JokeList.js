import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { jokes: [] };
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.resetVotes = this.resetVotes.bind(this);
    this.vote = this.vote.bind(this);
  }

  async componentDidMount() {
    await this.getJokes();
  };

  async componentDidUpdate() {
    if (this.state.jokes.length === 0) await this.getJokes();
  }

  /* empty joke list and then call getJokes */

  generateNewJokes() {
    localStorage.clear();
    this.setState({ jokes: [] });
  }

  /* get jokes if there are no jokes */
  async getJokes() {
    let j = JSON.parse(localStorage.getItem("jokes"));
    if (j) {
      this.setState({ jokes: j });
    }
    else {
      j = [...this.state.jokes];
      let seenJokes = new Set();
      try {
        while (j.length < this.props.numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { status, ...jokeObj } = res.data;

          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0 });
          } else {
            console.error("duplicate found!");
          }
        }
        localStorage.setItem("jokes", JSON.stringify(j));
        this.setState({ jokes: j });
      } catch (e) {
        console.log(e);
      }
    }
  };

  resetVotes() {
    const jokesReset = this.state.jokes.map(joke => ({ ...joke, votes: 0 }));
    localStorage.setItem("jokes", JSON.stringify(jokesReset));
    this.setState({ jokes: jokesReset });
  }

  /* change vote for this id by delta (+1 or -1) */

  vote(id, delta) {
    const j = this.state.jokes.map(j => (
      j.id === id ? { ...j, votes: j.votes + delta } : j
    ));
    this.setState({ jokes: j });
  }

  /* render: either loading spinner or list of sorted jokes. */
  
  render() {
    if (this.state.jokes.length) {
      let sortedJokes = [...this.state.jokes]
        .sort((a, b) => b.votes - a.votes);
    
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>
          <button className="JokeList-reset" onClick={this.resetVotes}>
            Reset Votes
          </button>
    
          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      );
    }
    return (
      <div className="JokeList-loader">
        <i className="fas fa-spinner fa-5x" />
      </div>
    ); 
  }

  static defaultProps = { numJokesToGet: 10 } // Learned how to set default props for class component at https://blog.logrocket.com/a-complete-guide-to-default-props-in-react-984ea8e6972d/
}

export default JokeList;
