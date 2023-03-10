export type TAd = {
  id: string
  infoMini: string | null
  infoLarge: string | null
  title: string | null
  url: string | null
  views: string | null
  price: string | null
  city: string | null
  metro: Array<string | null>
}

export type TPreparedAd = {
  id: number
  title: string | null
  url: string | null
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

export type TPreparedAdForCsv = {
  id: string
  title: string
  url: string
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
