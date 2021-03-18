import React from "react";
import "./Joke.css";

class Joke extends React.Component {
  constructor(props) {
    super(props);
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
    this.lockOrUnlock = this.lockOrUnlock.bind(this);
  }

  lockOrUnlock() {
    this.props.toggleLock(this.props.id);
  }

  upVote() {
    this.props.vote(this.props.id, +1);
  }
  downVote() {
    this.props.vote(this.props.id, -1);
  }

  render() {
    return (
      <div className="Joke">
        <div className="Joke-votearea">
          <button onClick={this.upVote}>
            <i className="fas fa-thumbs-up" />
          </button>
  
          <button onClick={this.downVote}>
            <i className="fas fa-thumbs-down" />
          </button>
  
          {this.props.votes}
        </div>
  
        <div className="Joke-text">{this.props.text}</div>

        {
          this.props.locked ?
            <button onClick={this.lockOrUnlock}>
              <i className="fas fa-lock" />
            </button> :
            <button onClick={this.lockOrUnlock}>
              <i className="fas fa-lock-open" />
            </button>
        }
      </div>
    );
  }
}

export default Joke;
