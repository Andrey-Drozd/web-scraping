import fs from 'fs'

import { CREATE_FOLDER_SUCCESS, FOLDER_NOT_EXIST } from '../constants'
import { logServices } from './index'

export const mkdirSync = (path: string, callback?: () => void) => {
  try {
    fs.mkdirSync(path, fs.constants.R_OK)

    logServices.send(CREATE_FOLDER_SUCCESS)

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
    logServices.send(FOLDER_NOT_EXIST)

    if (callback) callback()
  }
}
