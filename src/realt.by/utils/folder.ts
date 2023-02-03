import { fsServices } from '../services'

export const checkIsFolderForFiles = (path: string) => {
  fsServices.accessSync(path, () => {
    fsServices.mkdirSync(path)
  })
}
