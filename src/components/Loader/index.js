import React, {Component} from 'react'
import {StyleSheet, View, ActivityIndicator, Text} from 'react-native'
import colors from 'colors'

export default class Loader extends Component {
  render () {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text style={styles.text}>Keep calm, data is loading...</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center'
  },
  text: {
    color: colors.MEDIUM_GREY,
    marginTop: 20
  }
})
