import {
  CREATE_FILE,
  CREATE_FILE_SUCCESS,
  CSV,
  FIRST_ROW,
  REALT_BY,
  RESULTS_PATH,
  SAVE_DATA,
  SAVE_DATA_SUCCESS
} from '../constants'
import { dateServices, logServices } from '../services'
import { TPreparedAd } from '../types'
import { getPreparedAdForCsv, getRowAdForCsv } from './data'
import { writeFirstRow, writeRow } from './writeRow'

export const saveDataToFile = (ads: TPreparedAd[]) => {
  const dateTime = dateServices.getDateTime()

  logServices.send(CREATE_FILE)
  writeFirstRow({
    path: RESULTS_PATH,
    fileName: `${REALT_BY}_${dateTime}.${CSV}`,
    row: FIRST_ROW
  })
  logServices.send(CREATE_FILE_SUCCESS)

  logServices.send(SAVE_DATA)
  ads.forEach((ad) => {
    const preparedAd = getPreparedAdForCsv(ad)
    const row = getRowAdForCsv(preparedAd)

    writeRow({
      path: RESULTS_PATH,
      fileName: `${REALT_BY}_${dateTime}.${CSV}`,
      row
    })
  })
  logServices.send(SAVE_DATA_SUCCESS)
}
