import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text, TouchableHighlight, Dimensions} from 'react-native'
import {format} from 'date-fns'

import colors from 'colors'

export default class Limits extends Component {
  static propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    selected: PropTypes.oneOf(['startDate', 'endDate']),
    onChange: PropTypes.func
  }

  static defaultProps = {
    selected: 'startDate'
  }

  render () {
    const {startDate, endDate, selected, onChange} = this.props

    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.cell} underlayColor={colors.WHITE} onPress={onChange.bind(null, 'startDate')}>
          <View style={[styles.cellInner, (selected === 'startDate' && styles.cellInnerSelected)]}>
            <Text style={styles.cellText}>From: {format(startDate, 'DD MMM YYYY')}</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.cell} underlayColor={colors.WHITE} onPress={onChange.bind(null, 'endDate')}>
          <View style={[styles.cellInner, (selected === 'endDate' && styles.cellInnerSelected)]}>
            <Text style={styles.cellText}>Till: {format(endDate, 'DD MMM YYYY')}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const cellWidth = Dimensions.get('window').width / 2

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 60,
    borderBottomWidth: 1,
    borderColor: colors.LIGHT_GREY,
    backgroundColor: colors.WHITE
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    width: cellWidth
  },
  cellInner: {
    height: 30,
    paddingHorizontal: 15,
    justifyContent: 'space-around',
    backgroundColor: colors.DARK_BLUE,
    borderRadius: 15,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center'
  },
  cellInnerSelected: {
    backgroundColor: colors.BLUE
  },
  cellImage: {
    width: 10,
    height: 10,
    marginRight: 8
  },
  cellText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500'
  }
})
