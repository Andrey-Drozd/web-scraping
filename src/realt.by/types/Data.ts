export type TParamsPreparedData = {
  id: string
  price: string | null
  href: string | null
  title: string | null
  square: string | null
  rooms: string | null
  floor: string | null
}

export type TPreparedData = {
  id: number
  price: number | null
  href: string | null
  title: string | null
  square: number | null
  rooms: number | null
  floor: number | null
  totalFloors: number | null
}

export type TFileData = {
  id: string
  price: string
  href: string
  title: string
  square: string
  rooms: string
  floor: string
  totalFloors: string
}
