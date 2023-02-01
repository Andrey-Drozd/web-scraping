export type TParamsPreparedData = {
  id: string
  title: string | null
  href: string | null
  date: string | null
  views: string | null
  price: string | null
  city: string | null
  metro: Array<string | null>
  square: string | null
  rooms: string | null
  floor: string | null
}

export type TPreparedData = {
  id: number
  title: string | null
  href: string | null
  date: string | null
  views: number | null
  price: number | null
  city: string | null
  metro: string | null
  square: number | null
  rooms: number | null
  floor: number | null
  floors: number | null
  floorTop: string | null
}

export type TFileData = {
  id: string
  title: string
  href: string
  date: string
  views: number
  price: string
  city: string
  metro: string
  square: string
  rooms: string
  floor: string
  floors: string
  floorTop: string
}
