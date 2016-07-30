import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {StyleSheet, View} from 'react-native'

import colors from 'colors'

import {getItems, setDates, selectPrevMonth, selectNextMonth, toggleDatepicker} from 'reducers'

import Header from '../Header'
import List from '../List'
import DatePicker from '../DatePicker'
import Loader from '../Loader'
import Summary from '../Summary'

const SUMMARY_SIZE_BREAKPOINT_OFFSET = 80

class App extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    datePicker: PropTypes.shape({
      isVisible: PropTypes.bool
    }).isRequired,
    dates: PropTypes.shape({
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
      anchorDate: PropTypes.instanceOf(Date)
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      startDate: PropTypes.string,
      value: PropTypes.number
    })).isRequired,
    setDates: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    toggleDatepicker: PropTypes.func.isRequired
  }

  state = {
    showExpandedSummary: true
  }

  componentDidMount () {
    const {getItems} = this.props
    getItems()
  }

  render () {
    const {dates, datePicker, toggleDatepicker, selectPrevMonth, selectNextMonth} = this.props

    return (
      <View style={styles.container}>

        <DatePicker
          isVisible={datePicker.isVisible}
          onChange={this._handleDateChange}
          onSelectPrevMonth={selectPrevMonth}
          onSelectNextMonth={selectNextMonth}
          style={styles.datePicker}
          {...dates} />

        <Header
          onRightItemPress={toggleDatepicker}
          rightItemImage={datePicker.isVisible ? 'close' : 'filter'}>
          Statistics
        </Header>

        {this._renderSummary()}
        {this._renderItems()}
      </View>
    )
  }

  _renderSummary () {
    const {items, dates} = this.props
    const {showExpandedSummary} = this.state

    const overallValue = items.reduce((memo, item) => {
      const sum = memo + item.value
      return sum
    }, 0)

    return (
      <Summary
        expanded={showExpandedSummary}
        value={overallValue}
        startDate={dates.startDate}
        endDate={dates.endDate} />
    )
  }

  _renderItems () {
    const {items, loading} = this.props

    if (loading) {
      return <Loader />
    } else if (items && items.length) {
      return <List items={items} onScroll={this._handleScroll} />
    }
  }

  _handleDateChange = (dates) => {
    const {setDates, getItems} = this.props
    setDates(dates)
    getItems()
  }

  _handleScroll = ({nativeEvent: {contentOffset}}) => {
    const showExpandedSummary = (contentOffset.y < SUMMARY_SIZE_BREAKPOINT_OFFSET)
    this.state.showExpandedSummary !== showExpandedSummary && this.setState({showExpandedSummary})
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    justifyContent: 'flex-start',
    flex: 1
  },
  datePicker: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    bottom: 0
  }
})

const mapStateToProps = (state, ownProps) => state
const mapDispatchToProps = (dispatch, ownProps) => ({
  getItems: bindActionCreators(getItems, dispatch),
  toggleDatepicker: bindActionCreators(toggleDatepicker, dispatch),
  setDates: bindActionCreators(setDates, dispatch),
  selectPrevMonth: bindActionCreators(selectPrevMonth, dispatch),
  selectNextMonth: bindActionCreators(selectNextMonth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
