import { TFileData, TParamsPreparedData, TPreparedData } from '../types'

export const getPreparedData = (params: TParamsPreparedData): TPreparedData => {
  const {
    id: propId,
    info,
    title: propTitle,
    url: propUrl,
    views: propViews,
    price: propPrice,
    city: propCity,
    metro: propMetro,
    square: propSquare,
    rooms: propRooms,
    floors: propFloors
  } = params

  const id = Number(propId.replace(/\D/g, ''))
  const title = propTitle ? String(propTitle.replace(/;/g, '%3B').trim()) : null
  const url = propUrl ? String(propUrl) : null
  const dateRegex = info?.match(/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}/gm)
  const date = dateRegex ? dateRegex[0] : null
  const views = propViews ? Number(propViews) : null
  const price = propPrice ? Number(propPrice.replace(/\D/g, '')) : null
  const cityPrepared = propCity?.split(',')[0]
  const city = cityPrepared ? cityPrepared.trim() : ''
  const metroPrepared = propMetro.find((metro) => metro !== null)
  const metro = metroPrepared ? metroPrepared.trim() : ''
  const square = propSquare
    ? Math.ceil(Number(propSquare.replace(/м\n2/g, '')))
    : null
  const rooms = propRooms ? Number(propRooms.replace(/-комн\./g, '')) : null
  const propFloorsPrepared =
    propFloors && String(propFloors.replace(/этаж/g, '').trim())
  const propFloorsPreparedSplit = propFloorsPrepared
    ? propFloorsPrepared.split('/')
    : null
  const floor = propFloorsPreparedSplit && Number(propFloorsPreparedSplit[0])
  const floors = propFloorsPreparedSplit && Number(propFloorsPreparedSplit[1])
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

export const getFileData = (data: TPreparedData): TFileData => {
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

export const getRowData = (data: TFileData): string => {
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
