import { fsModule } from '../services'

export const writeFirstRow = ({
  path,
  fileName,
  row
}: {
  path: string
  fileName: string
  row: string
}) => {
  fsModule.appendFileSync(`${path}${fileName}`, row)
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
  fsModule.appendFile(`${path}${fileName}`, row)
}
