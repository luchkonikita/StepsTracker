import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Animated} from 'react-native'
import {addMonths, subMonths, format} from 'date-fns'
import colors from 'colors'

import Limits from './Limits'
import Months from './Months'
import Calendar from './Calendar'

const OFFSET_TO_SHOW = 0
const OFFSET_TO_HIDE = 1000

export default class DatePicker extends Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    anchorDate: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectPrevMonth: PropTypes.func.isRequired,
    onSelectNextMonth: PropTypes.func.isRequired
  }

  state = {
    limitToSelect: 'startDate',
    offset: new Animated.Value(OFFSET_TO_HIDE)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isVisible === this.props.isVisible) return
    const animationSetting = nextProps.isVisible ? {toValue: OFFSET_TO_SHOW, friction: 8} : {toValue: OFFSET_TO_HIDE}
    Animated
      .spring(this.state.offset, animationSetting)
      .start()
  }

  render () {
    const {startDate, endDate, anchorDate, onSelectPrevMonth, onSelectNextMonth, style} = this.props

    return (
      <Animated.View style={[styles.container, style, {transform: [{translateY: this.state.offset}]}]}>
        <View style={styles.overlay} />
        <Limits
          selected={this.state.limitToSelect}
          onChange={(limitToSelect) => this.setState({limitToSelect})}
          {...{startDate, endDate}} />
        <Months
          selected={format(anchorDate, 'MMMM')}
          {...{onSelectPrevMonth, onSelectNextMonth}} />
        <Calendar
          onSelect={this._handleDateSelect}
          {...{startDate, endDate, anchorDate}} />
      </Animated.View>
    )
  }

  _handleMonthChange = (direction) => {
    const fn = direction === 'next' ? addMonths : subMonths
    const anchorDate = fn(this.props.anchorDate)
    this.props.onMonthSelect({anchorDate})
  }

  _handleDateSelect = (selectedDate) => {
    const {startDate, endDate, onChange} = this.props
    const data = Object.assign({}, {startDate, endDate}, {
      [this.state.limitToSelect]: selectedDate
    })
    onChange(data)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    zIndex: 5
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.WHITE,
    opacity: 0.75
  }
})
