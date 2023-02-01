import { TFileData, TParamsPreparedData, TPreparedData } from '../types'

export const getPreparedData = (params: TParamsPreparedData): TPreparedData => {
  const {
    id,
    title,
    url,
    date,
    views,
    price,
    city: cityProp,
    metro: metroProp,
    square,
    rooms,
    floor
  } = params

  const preparedFloors = floor && String(floor.replace(/этаж/g, '').trim())
  const preparedFloorsSplit = preparedFloors ? preparedFloors.split('/') : null
  const preparedFloor = preparedFloorsSplit && Number(preparedFloorsSplit[0])
  const preparedFloorsTotal =
    preparedFloorsSplit && Number(preparedFloorsSplit[1])
  const floorTop = preparedFloor ? preparedFloor === preparedFloorsTotal : null
  const city = cityProp ? cityProp.split(',')[0] : ''
  const metro = metroProp.find((metro) => metro !== null)

  return {
    id: Number(id.replace(/\D/g, '')),
    title: title ? String(title.replace(/;/g, '%3B').trim()) : null,
    url: url ? String(url).trim() : null,
    date: date ? String(date.trim()) : null,
    views: views ? Number(views) : null,
    price: price ? Number(price.replace(/\D/g, '')) : null,
    city: city ? String(city.trim()) : null,
    metro: metro ? String(metro.trim()) : null,
    square: square ? Number(square.replace(/м\n2/g, '')) : null,
    rooms: rooms ? Number(rooms.replace(/-комн\./g, '')) : null,
    floor: preparedFloor || null,
    floors: preparedFloorsTotal || null,
    floorTop: floorTop ? '+' : ''
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
