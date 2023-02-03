import { fsServices } from '../services'

export const writeFirstRow = ({
  path,
  fileName,
  row
}: {
  path: string
  fileName: string
  row: string
}) => {
  fsServices.appendFileSync(`${path}${fileName}`, row)
}

export const writeRow = ({
  path,
  fileName,
  row
}: {
  path: string
  fileName: string
  row: string
}) => {
  fsServices.appendFile(`${path}${fileName}`, row)
}
