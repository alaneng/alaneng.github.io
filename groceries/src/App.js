import React, { Component } from "react"
import { connect } from "react-redux"
import { Card, Table, Icon, Tab } from "semantic-ui-react"
import _ from "lodash"
import moment from "moment"
import classnames from "classnames"

import GroceryInput from "./components/grocery-input"
import {
  fetchGroceryList,
  onEnterGroceryItem,
  addNewItem,
  addNewExpirationDate,
  addNewItemType,
  toggleShowCallouts,
  toggleEditMode,
  deleteGroceryItem,
} from "./actions"
import "./App.css"

class App extends Component {
  state = {
    dropdownOpen: false,
  }

  componentWillMount() {
    this.props.fetchGroceryList()
  }

  render() {
    const {
      groceryList,
      inputGroceryItem,
      inputGroceryExpirationDate,
      inputGroceryItemType,
      addNewItem,
      addNewExpirationDate,
      addNewItemType,
      onEnterGroceryItem,
      toggleShowCallouts,
      toggleEditMode,
      isShowingCallout,
      isEditMode,
      deleteGroceryItem,
    } = this.props

    const groceryCards = _.keys(groceryList).map(itemType => {
      let groceryItems = groceryList[itemType]

      let flattenedGroceryItems = _.map(
        groceryItems,
        (item, firebaseItemKey) => {
          return { ...item, firebaseItemKey }
        }
      )

      flattenedGroceryItems = _.sortBy(flattenedGroceryItems, "expirationDate")

      const groceryListItems = flattenedGroceryItems.map(item => {
        const groceryKey = `${item.expirationDate}_${item.item}`
        const momentExpirationDate = moment(item.expirationDate)
        const momentToday = moment().format("YYYY-MM-DD")
        const daysBetween = momentExpirationDate.diff(momentToday, "days")

        let cellClassnames
        if (isShowingCallout) {
          cellClassnames = classnames({
            "expired-already": daysBetween < 0,
            "expiring-soon": daysBetween >= 0 && daysBetween <= 31,
          })
        }

        return (
          <Table.Row key={groceryKey} className={cellClassnames}>
            <Table.Cell>
              {item.item}
            </Table.Cell>
            <Table.Cell>
              {moment(item.expirationDate).format("M/D/YY") === "Invalid date"
                ? <span style={{ opacity: "0.2" }}>none</span>
                : moment(item.expirationDate).format("M/D/YY")}
            </Table.Cell>
            {isEditMode &&
              <Table.Cell>
                <span className="delete-item-btn">
                  <Icon
                    name="delete"
                    onClick={() =>
                      deleteGroceryItem(itemType, item.firebaseItemKey)}
                  />
                </span>
              </Table.Cell>}
          </Table.Row>
        )
      })

      return (
        <Card key={itemType} className="grocery-card">
          <Card.Content
            style={{
              maxHeight: "45px",
              minHeight: "45px",
            }}
          >
            <Card.Header>
              {itemType}
            </Card.Header>
          </Card.Content>
          <Card.Content>
            <Table basic="very" textAlign="center" celled selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <span style={{ opacity: "0.2" }}>item</span>
                  </Table.HeaderCell>
                  <Table.HeaderCell sorted="ascending">
                    <span style={{ opacity: "0.2" }}>expiration date</span>
                  </Table.HeaderCell>
                  {isEditMode &&
                    <Table.HeaderCell sorted="ascending">
                      <span style={{ opacity: "0.2" }}>
                        <Icon name="setting" />
                      </span>
                    </Table.HeaderCell>}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {groceryListItems}
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>
      )
    })

    const addNewItemIsDisabled =
      !this.props.inputGroceryItem || !this.props.inputGroceryItemType

    const inventoryTab = (
      <div className="grocery-container">
        <div className="grocery-cards">
          {groceryCards}
        </div>
      </div>
    )

    const panes = [
      {
        menuItem: "inventory",
        render: () =>
          <Tab.Pane>
            {inventoryTab}
          </Tab.Pane>,
      },
      {
        menuItem: "shopping list",
        render: () =>
          <Tab.Pane>
            <p>new shopping list!</p>
          </Tab.Pane>,
      },
    ]

    return (
      <div style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: "48px", padding: "20px" }}>Groceries!</h3>
        <div className="app-content">
          <div className="grocery-input">
            <GroceryInput
              inputGroceryItem={inputGroceryItem}
              inputGroceryExpirationDate={inputGroceryExpirationDate}
              inputGroceryItemType={inputGroceryItemType}
              addNewItem={addNewItem}
              addNewExpirationDate={addNewExpirationDate}
              addNewItemType={addNewItemType}
              onEnterGroceryItem={onEnterGroceryItem}
              addNewItemIsDisabled={addNewItemIsDisabled}
              toggleShowCallouts={toggleShowCallouts}
              toggleEditMode={toggleEditMode}
            />
          </div>
          <Tab panes={panes} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    inputGroceryItem: state.inputGroceryItem,
    inputGroceryExpirationDate: state.inputGroceryExpirationDate,
    inputGroceryItemType: state.inputGroceryItemType,
    groceryList: state.groceryList,
    isShowingCallout: state.isShowingCallout,
    isEditMode: state.isEditMode,
  }
}

export default connect(mapStateToProps, {
  fetchGroceryList,
  onEnterGroceryItem,
  addNewItem,
  addNewExpirationDate,
  addNewItemType,
  toggleShowCallouts,
  toggleEditMode,
  deleteGroceryItem,
})(App)
