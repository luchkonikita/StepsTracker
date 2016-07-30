import React, {Component, PropTypes} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import HeaderButton from './HeaderButton'
import colors from 'colors'

export default class Header extends Component {
  static propTypes = {
    onRightItemPress: PropTypes.func.isRequired,
    rightItemImage: PropTypes.string
  }

  render () {
    const {children} = this.props

    return (
      <View style={styles.container}>
        <Text style={styles.text}>{children}</Text>
        {this._renderRightButton()}
      </View>
    )
  }

  _renderRightButton () {
    const {rightItemImage, onRightItemPress} = this.props

    if (!rightItemImage || !onRightItemPress) return
    return (
      <HeaderButton
        style={styles.rightButton}
        onPress={onRightItemPress}
        image={rightItemImage} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: colors.ORANGE,
    height: 80,
    justifyContent: 'center',
    paddingTop: 30,
    zIndex: 100
  },
  text: {
    color: colors.WHITE,
    fontFamily: 'Avenir',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center'
  },
  rightButton: {
    position: 'absolute',
    bottom: 0,
    right: 0
  }
})
