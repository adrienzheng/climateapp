import React from 'react'
import logo from './logo.svg'
import Home from './pages/Home'
import Search from './pages/Search'

import "./styles/main.scss"
import 'semantic-ui-css/semantic.min.css'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom"

import {
  Button,
  Confirm,
  Icon,
  Message,
  Modal,
  Table,
} from "semantic-ui-react"

import store from 'store'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: null,
      deleteConfirmOpen: false,
      favorites: [],
      favoritesVisible: false,
      message: {visible: false, content: null, positive: false, warning: false, header: null, icon: null}
    }

    this.messageTimer = null
  }

  componentDidMount() {
    this.syncFavorites("download")
  }

  setCurrent = (city, state, zip, id, date) => {
    this.setState({
      current: {city: city, state: state, zip: zip, id: id, date: date},
      favoritesVisible: false
    })
  }

  showFavorites = () => {
    this.setState({favoritesVisible: true})
  }

  handleDelete = index => {
    let favorites = this.state.favorites
    let deleted = favorites[index]
    favorites.splice(index, 1)
    this.setState({
      deleteConfirmOpen: false,
      favorites: favorites,
      favoritesVisible: false
    })
    this.setMessage(
      `You have removed "${deleted.city}, ${deleted.state} ${deleted.zip}" from your favorites.`,
      true,
      false,
      "Success!",
      "check"
    )
    this.syncFavorites("upload")
  }

  handleAdd = (city, state, zip, station, date) => {
    let favorites = this.state.favorites
    favorites.push({city: city, state: state, zip: zip, station: station, date: date})
    this.setState({
      favorites: favorites
    })
    this.setMessage(
      `You have added "${city}, ${state} ${zip}" to your favorites`,
      true,
      false,
      "Success!",
      "check"
    )
    this.syncFavorites("upload")
  }

  syncFavorites = mode => {
    if  (mode==="upload") {
      let favorites = this.state.favorites
      store.set("favorites", favorites)
    } else {
      let favorites = store.get("favorites")
      if (favorites && favorites.length > 0) {
        this.setState({favorites: favorites})
      }
    }
  }

  setMessage = (content, positive, warning, header, icon) => {
    clearTimeout(this.messageTimer)
    this.setState({message: {
      visible: true,
      content: content,
      positive: positive,
      warning: warning,
      header: header,
      icon: icon
    }})
    this.messageTimer = setTimeout(() => {
      this.closeMessage()
    }, 3000)
  }
  
  closeMessage = () => {
    this.setState({message: {
      visible: false,
      content: null,
      positive: false,
      warning: false,
      header: null,
      icon: null
    }})
  }

  render() {
    const {
      current,
      deleteConfirmOpen,
      favorites,
      favoritesVisible,
      message,
    } = this.state

    return (
      <div className="App">
        <Router>
          <Message
            hidden = {!message.visible}
            icon
            onDismiss = {() => {
              this.setState({message: {visible: false, content: null, positive: false, warning: false, header: null, icon: null}})
            }}
            positive = {message.positive}
            warning = {message.warning}
          > 
            <Icon name={message.icon} />
            <Message.Header>
              {message.header}
            </Message.Header>
            <Message.Content>
              {message.content}
            </Message.Content>
          </Message>
          <Modal
            closeIcon
            dimmer="blurring"
            onClose={() => this.setState({favoritesVisible: false})}
            open={favoritesVisible}
          >
            <Modal.Header>My Favorite</Modal.Header>
            <Modal.Content>
              {
                favorites.length > 0 ? (
                  <Table basic = "very">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>City</Table.HeaderCell>
                    <Table.HeaderCell>State</Table.HeaderCell>
                    <Table.HeaderCell>Zip Code</Table.HeaderCell>
                    <Table.HeaderCell>Station</Table.HeaderCell>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell collapsing>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    favorites.map(({city, state, zip, station, date}, index) => <Table.Row key={index}>
                      <Table.Cell>{city}</Table.Cell>
                      <Table.Cell>{state}</Table.Cell>
                      <Table.Cell>{zip}</Table.Cell>
                      <Table.Cell>{station.name}</Table.Cell>
                      <Table.Cell>{date}</Table.Cell>
                      <Table.Cell collapsing>
                        <Link to = {`/location/${zip}`}>
                          <Button
                            icon
                            labelPosition="right"
                            onClick={() => this.setCurrent(city, state, zip, station.id, date)}
                            positive
                          >
                            Check Climate
                            <Icon name="search" />
                          </Button>
                        </Link>
                        <Button
                          negative 
                          icon 
                          labelPosition="right"
                          onClick = {() => this.setState({deleteConfirmOpen: true})}
                        >
                          Delete
                          <Icon name="delete" />
                        </Button>
                        <Confirm
                          open = {deleteConfirmOpen}
                          content = {`Are you sure to delete ${city}, ${state} ${zip} from your favoirtes?`}
                          onConfirm = {() => this.handleDelete(index)}
                          onCancel = {() => this.setState({deleteConfirmOpen: false})}
                          confirmButton = "Yes, delete it."
                          cancelButton = "Never mind."
                          size = "mini"
                        />
                      </Table.Cell>
                    </Table.Row>)
                  }
                </Table.Body>
              </Table>
                ) : (
                  <>
                    <p>
                      There is nothing here :(
                      <br/>
                      Add the current location to you favorite by clicking on the <Icon name="star"/> icon on the top left corner.
                    </p> 
                  </>    
                )
              }
            </Modal.Content>
          </Modal>
          <Switch>
            <Route 
              exact
              path="/"
              render={() => <Search showFavorites = {this.showFavorites}/>}
            />
            <Route
              exact
              path="/location/:zip"
              render={() => <Home
                showFavorites = {this.showFavorites}
                addFavorite = {this.handleAdd}
                removeFavorite = {this.handleDelete}
                favorites={favorites}
                current = {current}
                setCurrent = {this.setCurrent}
                showMessage = {this.setMessage}
              />}
            />
          </Switch>
        </Router>
       
      </div>
    )
  }
}

export default App
