import { TFileData, TParamsPreparedData, TPreparedData } from '../types'

export const getPreparedData = (params: TParamsPreparedData): TPreparedData => {
  const { id, price, href, title, square, rooms, floor } = params

  const preparedFloors = floor && String(floor.replace(/этаж/g, '').trim())
  const partsPreparedFloor = preparedFloors ? preparedFloors.split('/') : null
  const preparedFloor = partsPreparedFloor && Number(partsPreparedFloor[0])
  const preparedTotalFloors =
    partsPreparedFloor && Number(partsPreparedFloor[1])

  return {
    id: Number(id.replace(/\D/g, '')),
    price: price ? Number(price.replace(/\D/g, '')) : null,
    href: href ? String(href).trim() : null,
    title: title ? String(title.replace(/;/g, '%3B').trim()) : null,
    square: square ? Number(square.replace(/м\n2/g, '')) : null,
    rooms: rooms ? Number(rooms.replace(/-комн\./g, '')) : null,
    floor: preparedFloor || null,
    totalFloors: preparedTotalFloors || null
  }
}

export const getFileData = (data: TPreparedData): TFileData => {
  const { id, price, href, title, square, rooms, floor, totalFloors } = data

  return {
    id: String(id),
    title: title || '',
    price: price ? String(price) : '',
    href: href || '',
    square: square ? String(square) : '',
    rooms: rooms ? String(rooms) : '',
    floor: floor ? String(floor) : '',
    totalFloors: totalFloors ? String(totalFloors) : ''
  }
}

export const getRowData = (data: TFileData): string => {
  const { id, price, href, title, square, rooms, floor, totalFloors } = data

  return `${id};${title};${price};${href};${square};${rooms};${floor};${totalFloors}`
}
