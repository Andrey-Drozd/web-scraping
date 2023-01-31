import { fsModule } from '../services'

export const checkIsFolderForFiles = (path: string) => {
  fsModule.accessSync(path, () => {
    fsModule.mkdirSync(path)
  })
}
