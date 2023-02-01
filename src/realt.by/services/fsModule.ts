import fs from 'fs'

import { LOG_SERVER } from '../constants'

export const mkdirSync = (path: string, callback?: () => void) => {
  try {
    fs.mkdirSync(path, fs.constants.R_OK)

    console.log(`${LOG_SERVER}Папка по пути: ${path} создана`)

    if (callback) callback()
  } catch (err) {
    throw new Error()
  }
}

export const appendFile = (
  path: string,
  row: string,
  callback?: () => void
) => {
  fs.appendFile(path, `${row}\n`, { encoding: 'utf-8' }, (err) => {
    if (err) throw err
  })
  if (callback) callback()
}

export const appendFileSync = (
  path: string,
  row: string,
  callback?: () => void
) => {
  try {
    fs.appendFileSync(path, `${row}\n`, { encoding: 'utf-8' })

    if (callback) callback()
  } catch (err) {
    throw new Error()
  }
}

export const accessSync = (path: string, callback?: () => void) => {
  try {
    fs.accessSync(path, fs.constants.R_OK)
  } catch (err) {
    console.log(`${LOG_SERVER}Папка по пути: ${path} не существует`)

    if (callback) callback()
  }
}
