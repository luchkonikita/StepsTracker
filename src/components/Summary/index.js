import React, {Component, PropTypes} from 'react'
import {Animated, StyleSheet, View, Text} from 'react-native'
import {format} from 'date-fns'

import colors from 'colors'

export default class Summary extends Component {
  static propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    value: PropTypes.number.isRequired,
    expanded: PropTypes.bool.isRequired
  }

  state = {
    expanded: new Animated.Value(1)
  }

  componentWillReceiveProps (nextProps) {
    const {expanded} = nextProps
    if (expanded === this.props.expanded) return

    Animated.timing(this.state.expanded, {
      toValue: expanded ? 1 : 0,
      duration: 300}).start()
  }

  render () {
    const {startDate, endDate, value} = this.props

    const containerStyles = {
      height: this.state.expanded.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 60]
      })
    }

    const datesStyles = {
      transform: [{
        scale: this.state.expanded.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1]
        })
      }, {
        translateX: this.state.expanded.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0]
        })
      }]
    }

    const valueStyles = {
      transform: [{
        scale: this.state.expanded.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1]
        })
      }, {
        translateX: this.state.expanded.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0]
        })
      }]
    }

    return (
      <Animated.View style={[styles.container, containerStyles]}>
        <Animated.Text style={[styles.dates, datesStyles]}>
          {format(startDate, 'DD MMM YYYY')} - {format(endDate, 'DD MMM YYYY')}
        </Animated.Text>

        <Animated.Text style={[styles.value, valueStyles]}>
          {(parseInt(value, 10) / 1000).toFixed(1)} km
        </Animated.Text>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.LIGHT_GREY,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  dates: {
    color: colors.MEDIUM_GREY,
    fontSize: 16,
    marginVertical: 5
  },
  value: {
    color: colors.MEDIUM_GREY,
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 5
  }
})
