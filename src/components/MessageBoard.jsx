import React, {Component} from 'react'
import CommitCard from './CommitCard'
import axios from 'axios'
import {Container, Grid} from 'semantic-ui-react'

class MessageBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cards: [{
        id: null,
        full_name: null,
        user_name: null,
        created_on: null,
        message: null,
        avatar_image: null,
        likes: null
      }],
      limit: 10
    }
  }

  componentDidMount() {
    this.getCommits()
    window.addEventListener('scroll', this.trackScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.trackScroll)
  }

  getCommits = () => {
    let query = `?limit=${this.state.limit}&offset=0`
    axios.get(`${this.props.url}commits${query}`)
      .then((response) => {
        this.setState({ cards: response.data})
      })
      .catch(console.error)
  }

  loadMore = () => {
    this.setState({limit: this.state.limit + 10})
    this.getCommits()
  }

  voteOnCommit = (e, id, userid) => {
    e.preventDefault()
    let body = { commit_id: id, user_id: userid }
    axios.post(`${this.props.url}likes`, body)
      .then(result => {
        let cardToUpdate = this.state.cards.find(card => {
          return card.id === id;
        })
        let index = this.state.cards.indexOf(cardToUpdate);
        let newCard = {...this.state.cards[index]};
        newCard.likes = result.data[0].count;
        let newCardsState = [...this.state.cards];
        newCardsState[index] = newCard;
        this.setState({cards: newCardsState })
      })
      .catch(console.error)
  }

  trackScroll = () => {
    let d = document.documentElement
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    let scrollTrack = window.scrollY
    if (scrollTrack === height) {
      this.loadMore()
    }
  }

  dateConversion = (dateStr) => {
    let date = new Date(dateStr)
    let toMilSec = date.valueOf()
    let oneDay = 86400000
    let oneWeek = 7
    let oneMonth = 30
    let oneYear = 365
    let now = Date.now()
    let diff = Math.floor((now - toMilSec) / oneDay)
    if (diff < oneWeek) {
      if (diff === 0) return 'Today'
      if (diff === 1) return 'Yesterday'
      else return `${diff} days ago`
    }
    if (diff < oneMonth) {
      if ((7 <= diff) && (diff < 14)) return `1 week ago`
      else return `${Math.floor(diff/oneWeek)} weeks ago`
    }
    if (diff < oneYear) {
      if ((oneMonth <= diff) && (diff < (oneMonth*2))) return `1 month ago`
      else return `${Math.floor(diff/oneMonth)} months ago`
    }
    else {
      if ((oneYear <= diff) && (diff < (oneYear*2))) return `1 year ago`
      else return `${Math.floor(diff/oneYear)} years ago`
    }
  }

  render() {
    let copy = this.state.cards
    copy.map(card => console.log(card))
    return (
        <Container>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <h1>Feed</h1>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <div className="ui container">
                  {
                    this.state.cards.map((card, i) => {
                      return <CommitCard
                        key={i}
                        id={card.id}
                        name={card.full_name}
                        message={card.message}
                        date={this.dateConversion(card.created_on)}
                        avatar={card.avatar_image}
                        userid={this.props.profile.id}
                        voteOnCommit={this.voteOnCommit}
                        likesCount={card.likes}
                      />
                    })
                  }
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
    )
  }
}

export default MessageBoard
