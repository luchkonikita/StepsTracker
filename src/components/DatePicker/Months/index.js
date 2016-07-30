import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text, Image, TouchableHighlight} from 'react-native'
import colors from 'colors'
import images from 'images'

export default class Months extends Component {
  static propTypes = {
    selected: PropTypes.string.isRequired,
    onSelectPrevMonth: PropTypes.func.isRequired,
    onSelectNextMonth: PropTypes.func.isRequired
  }

  render () {
    const {selected, onSelectPrevMonth, onSelectNextMonth} = this.props

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={onSelectPrevMonth}>
          <Image source={images.chevronLeft} style={styles.chevronImage} />
        </TouchableHighlight>

        <Text style={styles.text}>
          {selected}
        </Text>

        <TouchableHighlight onPress={onSelectNextMonth}>
          <Image source={images.chevronRight} style={styles.chevronImage} />
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 60,
    backgroundColor: colors.WHITE
  },
  text: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.MEDIUM_GREY
  },
  chevronImage: {
    width: 20,
    height: 20,
    margin: 15
  }
})
