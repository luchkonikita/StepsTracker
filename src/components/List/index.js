import React, {Component} from 'react'
import {StyleSheet, ListView} from 'react-native'
import {parse, format} from 'date-fns'
import maxBy from 'lodash/maxBy'
import Item from './Item'

export default class List extends Component {
  state = {
    dataSource: new ListView.DataSource({rowHasChanged: (a, b) => a.startDate !== b.startDate})
  }

  componentDidMount () {
    this._updateDataSource(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this._updateDataSource(nextProps)
  }

  render () {
    const {onScroll} = this.props
    const {dataSource} = this.state

    return (
      <ListView
        style={styles.container}
        initialListSize={50}
        dataSource={dataSource}
        renderRow={this._renderRow}
        onScroll={onScroll}
        enableEmptySections />
    )
  }

  _updateDataSource (props) {
    const dataSource = this.state.dataSource.cloneWithRows(props.items)
    this.setState({dataSource})
  }

  _renderRow = (rowData) => {
    const {items} = this.props
    const maxValue = maxBy(items, 'value').value
    const coefficient = rowData.value / maxValue
    return (
      <Item
        label={format(parse(rowData.startDate), 'DD MMM YYYY')}
        value={(parseInt(rowData.value, 10) / 1000).toFixed(1) + 'km'}
        coefficient={coefficient} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2
  }
})
