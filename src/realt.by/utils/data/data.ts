import { TAd, TPreparedAd, TPreparedAdForCsv } from '../../types'
import {
  clearFloorRegex,
  clearRoomsRegex,
  clearSquareRegex,
  getDateRegex,
  getFloorRegex,
  getNumbersRegex,
  getRoomsRegex,
  getSquareRegex,
  getTitleRegex
} from './regex'

export const getPreparedAd = (params: TAd): TPreparedAd => {
  const {
    id: propId,
    infoMini,
    infoLarge,
    title: propTitle,
    url: propUrl,
    views: propViews,
    price: propPrice,
    city: propCity,
    metro: propMetro
  } = params

  const id = Number(propId.replace(getNumbersRegex, ''))
  const title = propTitle
    ? String(propTitle.replace(getTitleRegex, '%3B').trim())
    : null
  const url = propUrl ? String(propUrl) : null
  const dateR = infoMini?.match(getDateRegex)
  const date = dateR ? dateR[0] : null
  const views = propViews ? Number(propViews) : null
  const price = propPrice
    ? Number(propPrice.replace(getNumbersRegex, ''))
    : null
  const cityPrepared = propCity?.split(',')[0]
  const city = cityPrepared ? cityPrepared.trim() : ''
  const metroPrepared = propMetro.find((metro) => metro !== null)
  const metro = metroPrepared ? metroPrepared.trim() : ''
  const squareR = infoLarge?.match(getSquareRegex)?.[0]
  const square = squareR
    ? Math.ceil(Number(squareR.replace(clearSquareRegex, '')))
    : null
  const roomsR = infoLarge?.match(getRoomsRegex)?.[0]
  const rooms = roomsR ? Number(roomsR.replace(clearRoomsRegex, '')) : null
  const floorR = infoLarge?.match(getFloorRegex)?.[0]
  const floorPrepared = floorR?.replace(clearFloorRegex, '')
  const floorPreparedSplit = floorPrepared?.split('/')
  const floor = floorPreparedSplit ? Number(floorPreparedSplit[0]) : null
  const floors = floorPreparedSplit ? Number(floorPreparedSplit[1]) : null
  const floorTopPrepared = floor ? floor === floors : null
  const floorTop = floorTopPrepared ? '+' : ''

  return {
    id,
    title,
    url,
    date,
    views,
    price,
    city,
    metro,
    square,
    rooms,
    floor,
    floors,
    floorTop
  }
}

export const getPreparedAdForCsv = (data: TPreparedAd): TPreparedAdForCsv => {
  const {
    id,
    title,
    url,
    date,
    views,
    price,
    city,
    metro,
    square,
    rooms,
    floor,
    floors,
    floorTop
  } = data

  return {
    id: String(id),
    title: title || '',
    url: url || '',
    date: date || '',
    views: views || 0,
    price: price ? String(price) : '',
    city: city ? String(city) : '',
    metro: metro ? String(metro) : '',
    square: square ? String(square) : '',
    rooms: rooms ? String(rooms) : '',
    floor: floor ? String(floor) : '',
    floors: floors ? String(floors) : '',
    floorTop: floorTop ? String(floorTop) : ''
  }
}

export const getRowAdForCsv = (data: TPreparedAdForCsv): string => {
  const {
    id,
    title,
    url,
    date,
    views,
    price,
    city,
    metro,
    square,
    rooms,
    floor,
    floors,
    floorTop
  } = data

  return `${id};${title};${url};${date};${views};${price};${city};${metro};${square};${rooms};${floor};${floors};${floorTop}`
}
