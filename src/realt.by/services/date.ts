import dayjs from 'dayjs'

export const getDateTime = (): string => {
  const localeDate = dayjs().format()
  const localeDateSplit = localeDate.split('T')
  const date = localeDateSplit[0] as string
  const time = localeDateSplit[1]
    ?.replace(/\+(.*)/gm, '')
    ?.replace(/:/gm, '-') as string

  return `${date}_${time}`
}
