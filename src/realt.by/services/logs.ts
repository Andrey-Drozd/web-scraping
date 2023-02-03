export const send = (info: string, value?: any) => {
  const preparedValue = value || ''
  console.log(info, preparedValue)
}
