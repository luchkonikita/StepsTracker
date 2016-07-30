/**
 * @providesModule reducers
 */

import {combineReducers, compose} from 'redux'
import {NativeModules} from 'react-native'
import {startOfMonth, endOfMonth, startOfDay, endOfDay, addMonths, subMonths, parse, isAfter} from 'date-fns'

// actions
const SET_LOADING = 'SET_LOADING'
const UNSET_LOADING = 'UNSET_LOADING'
const REQUEST_ITEMS = 'REQUEST_ITEMS'
const SET_ITEMS = 'SET_ITEMS'
const SET_DATES = 'SET_DATES'
const SELECT_PREV_MONTH = 'SELECT_PREV_MONTH'
const SELECT_NEXT_MONTH = 'SELECT_NEXT_MONTH'
const TOGGLE_DATEPICKER = 'TOGGLE_DATEPICKER'
const SHOW_ERROR = 'SHOW_ERROR'

// reducers
function loading (state = false, action) {
  switch (action.type) {
    case SET_LOADING:
      return true
    case UNSET_LOADING:
      return false
    default:
      return state
  }
}

function items (state = [], action) {
  switch (action.type) {
    case SET_ITEMS:
      return action.items.sort((a, b) => isAfter(parse(a.startDate), parse(b.startDate)) ? 1 : -1)
    default:
      return state
  }
}

function dates (state = {
  anchorDate: new Date(),
  startDate: compose(startOfDay, startOfMonth)(new Date()),
  endDate: compose(endOfDay, endOfMonth)(new Date())
}, action) {
  switch (action.type) {
    case SET_DATES:
      return Object.assign({}, state, {
        startDate: startOfDay(action.dates.startDate),
        endDate: endOfDay(action.dates.endDate)
      })
    case SELECT_PREV_MONTH:
      return Object.assign({}, state, {
        anchorDate: subMonths(state.anchorDate, 1)
      })
    case SELECT_NEXT_MONTH:
      return Object.assign({}, state, {
        anchorDate: addMonths(state.anchorDate, 1)
      })
    default:
      return state
  }
}

function datePicker (state = {isVisible: false}, action) {
  switch (action.type) {
    case TOGGLE_DATEPICKER:
      return {isVisible: !state.isVisible}
    default:
      return state
  }
}

// action creators
function setLoading () {
  return {type: SET_LOADING}
}

function unsetLoading () {
  return {type: UNSET_LOADING}
}

function requestItems () {
  return {type: REQUEST_ITEMS}
}

export function getItems () {
  return (dispatch, getState) => {
    dispatch(setLoading())
    dispatch(requestItems())
    const {dates: {startDate, endDate}} = getState()
    NativeModules.HealthKitManager.fetchStatistics(startDate.toISOString(), endDate.toISOString(), (err, items) => {
      if (err) {
        dispatch(unsetLoading())
        dispatch(showError())
      } else {
        dispatch(unsetLoading())
        dispatch(setItems(items))
      }
    })
  }
}

export function setItems (items) {
  return {type: SET_ITEMS, items}
}

export function showError () {
  return {type: SHOW_ERROR}
}

export function setDates (dates) {
  return {type: SET_DATES, dates}
}

export function selectNextMonth () {
  return {type: SELECT_NEXT_MONTH}
}

export function selectPrevMonth () {
  return {type: SELECT_PREV_MONTH}
}

export function toggleDatepicker () {
  return {type: TOGGLE_DATEPICKER}
}

export default combineReducers({
  loading,
  items,
  dates,
  datePicker
})
