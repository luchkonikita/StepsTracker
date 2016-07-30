import React, {Component, PropTypes} from 'react'
import {Image, StyleSheet, Animated, TouchableHighlight} from 'react-native'
import colors from 'colors'
import images from 'images'

export default class HeaderButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    image: PropTypes.string
  }

  state = {
    imageScale: new Animated.Value(1)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.image !== nextProps.image) {
      this._animate()
    }
  }

  render () {
    const {image, style} = this.props
    const {imageScale} = this.state

    return (
      <TouchableHighlight
        underlayColor={colors.ORANGE}
        onPress={this._handleOnPress}
        style={[styles.container, style]}>
        <Animated.View style={{transform: [{scale: imageScale}]}} >
          <Image source={images[image]} style={styles.image} />
        </Animated.View>
      </TouchableHighlight>
    )
  }

  _handleOnPress = () => {
    Animated
      .timing(this.state.imageScale, {toValue: 0, duration: 50})
      .start(this.props.onPress)
  }

  _animate () {
    Animated
      .spring(this.state.imageScale, {toValue: 1, duration: 50})
      .start()
  }
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 16,
    width: 16
  }
})
