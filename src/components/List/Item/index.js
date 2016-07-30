import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text, Animated} from 'react-native'

import colors from 'colors'

export default class ListItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    coefficient: PropTypes.number.isRequired
  }

  state = {
    progress: new Animated.Value(0),
    progressWidth: 0
  }

  render () {
    const {label, value} = this.props

    return (
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>

        <Animated.View style={[styles.progress, {
          width: this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.state.progressWidth]
          }),
          backgroundColor: this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.LIGHT_GREY, colors.BLUE]
          })
        }]} />
        <View onLayout={this._setProgressWidth} style={styles.measurer} />
      </View>
    )
  }

  _setProgressWidth = ({nativeEvent: {layout: {width}}}) => {
    if (this.state.progressShown) return
    const {coefficient} = this.props
    this.setState({progressWidth: width * coefficient})

    Animated
      .spring(this.state.progress, {toValue: coefficient})
      .start(() => this.setState({progressShown: true}))
  }
}

const styles = StyleSheet.create({
  row: {
    borderBottomColor: colors.LIGHT_GREY,
    borderBottomWidth: 1,
    minHeight: 60,
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  rowText: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    flex: 1
  },
  label: {
    color: colors.MEDIUM_GREY,
    flex: 1,
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: '500'
  },
  value: {
    color: colors.MEDIUM_GREY,
    fontFamily: 'Avenir',
    fontWeight: '800'
  },
  progress: {
    height: 14,
    borderRadius: 7,
    marginTop: 10,
    width: 0
  },
  measurer: {
    height: 1,
    opacity: 0
  }
})
