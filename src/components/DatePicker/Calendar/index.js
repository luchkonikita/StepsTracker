import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text, Dimensions, TouchableHighlight} from 'react-native'
import {startOfDay, startOfMonth, startOfWeek, addDays, isSameMonth, isToday, isSameDay, isBefore, isAfter} from 'date-fns'

import colors from 'colors'

export default class Calendar extends Component {
  static propTypes = {
    anchorDate: PropTypes.instanceOf(Date).isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    onSelect: PropTypes.func.isRequired
  }

  render () {
    return (
      <View style={styles.container}>
        {this._weeks.map(this._renderWeek)}
      </View>
    )
  }

  _renderWeek = (week, i) => {
    const stylesForLast = (i === 5 && styles.weekLast)

    return (
      <View style={[styles.week, stylesForLast]} key={i}>
        {week.map(this._renderDay)}
      </View>
    )
  }

  _renderDay = (day, i) => {
    const {startDate, endDate, anchorDate} = this.props

    const isBetweenDates = isAfter(day, startDate) && isBefore(day, endDate)
    const isEdgeDate = isSameDay(day, startDate) || isSameDay(day, endDate)

    const stylesForLast = (i === 6 && styles.dayLast)
    const stylesForSelected = (isBetweenDates || isEdgeDate) && styles.daySelected
    const stylesForToday = isToday(day) && styles.dayToday
    const stylesForDisabled = (!isSameMonth(day, anchorDate) && styles.dayDisabled)

    return (
      <TouchableHighlight
        underlayColor={colors.WHITE}
        onPress={this.props.onSelect.bind(this, day)}
        style={[styles.day, stylesForLast, stylesForSelected]}
        key={i}>
        <Text style={[styles.dayText, stylesForToday, stylesForDisabled]}>
          {day.getDate()}
        </Text>
      </TouchableHighlight>
    )
  }

  get _weeks () {
    const {anchorDate} = this.props
    let current = startOfDay(startOfWeek(startOfMonth(anchorDate), {weekStartsOn: 1}))
    const weeks = []

    while (weeks.length < 6) {
      const week = []
      while (week.length < 7) {
        week.push(current)
        current = addDays(current, 1)
      }
      weeks.push(week)
    }

    return weeks
  }
}

const cellWidth = (Dimensions.get('window').width - 1) / 7

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE
  },
  week: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: colors.LIGHT_GREY,
    borderTopWidth: 1
  },
  weekLast: {
    borderBottomWidth: 1
  },
  day: {
    backgroundColor: 'transparent',
    width: cellWidth,
    height: 50,
    justifyContent: 'center',
    borderRightColor: colors.LIGHT_GREY,
    borderRightWidth: 1
  },
  dayToday: {
    fontWeight: '800'
  },
  daySelected: {
    backgroundColor: colors.EXTRA_LIGHT_ORANGE
  },
  dayDisabled: {
    color: colors.LIGHT_GREY
  },
  dayLast: {
    borderRightWidth: 0
  },
  dayText: {
    color: colors.MEDIUM_GREY,
    textAlign: 'center'
  }
})
