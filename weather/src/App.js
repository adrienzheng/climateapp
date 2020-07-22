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

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLocation: null,
      deleteConfirmOpen: false,
      favorites: [
        {city: "Ithaca", state: "NY", zip: 14850},
        {city: "New York", state: "NY", zip: 10001},
        {city: "San Jose", state: "CA", zip: 95123},
      ],
      favoritesVisible: false,
      message: {visible: false, content: null}
    }
  }

  setLocation = location => {
    this.setState({currentLocation: location})
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
      favoritesVisible: false,
      message: {visible: true, content: `You have removed "${deleted.city}, ${deleted.state} ${deleted.zip}" from you favorites.` }
    })
    setTimeout(() => this.setState({showFavorites: true}), 0)
  }

  render() {
    const {
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
              this.setState({message: {visible: false, content: null}})
            }}
            positive
          > 
            <Icon name="check" />
            <Message.Header>
              Success!
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
            <Modal.Header>My Favorite Locations</Modal.Header>
            <Modal.Content>
              {
                favorites.length > 0 ? (
                  <Table basic = "very">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>City</Table.HeaderCell>
                    <Table.HeaderCell>State</Table.HeaderCell>
                    <Table.HeaderCell>Zip Code</Table.HeaderCell>
                    <Table.HeaderCell collapsing>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    favorites.map(({city, state, zip}, index) => <Table.Row key={index}>
                      <Table.Cell>{city}</Table.Cell>
                      <Table.Cell>{state}</Table.Cell>
                      <Table.Cell>{zip}</Table.Cell>
                      <Table.Cell collapsing>
                        <Link to = {`/location/${zip}`}>
                          <Button
                            icon
                            labelPosition="right"
                            onClick={() => this.setState({
                              currentLocation: {city: city, state: state, zip: zip},
                              favoritesVisible: false,
                            })}
                            positive
                          >
                            Check Weather
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
                          <Icon name="delete"></Icon>
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
              render={() => <Search showFavorites = {this.showFavorites} setLocation = {location => this.setLocation(location)}/>}
            />
            <Route
              exact
              path="/location/:zip"
              render={() => <Home showFavorites = {this.showFavorites}/>}
            />
          </Switch>
        </Router>
       
      </div>
    )
  }
}

export default App
