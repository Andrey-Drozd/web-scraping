export const getNumbersRegex = /\D/g

export const getTitleRegex = /;/g

export const getDateRegex = /[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}/gm

export const getSquareRegex = /([0-9]{1,3}\.[0-9]{1,3}.м)|[0-9]{1,3}.м/gm
export const clearSquareRegex = /м/g

export const getRoomsRegex = /[0-9]{1}-комн\./gm
export const clearRoomsRegex = /-комн\./g

export const getFloorRegex = /[0-9]{1,2}\/[0-9]{1,2}.этаж/gm
export const clearFloorRegex = /этаж/g
