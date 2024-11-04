import fs from 'fs'
export async function loadingIcon(url: string) {
  const iconResult: {
    code: number
    result: string[]
  } = await fetch(url + '/api/menu/getIcons', {
    method: 'POST'
  }).then((res) => res.json() as any)
  if (iconResult.code === 0) {
    const icons = iconResult.result
    fs.open('src/components/icon.ts', 'w', (err, fd) => {
      if (err) {
        console.error(err)
      }
      fs.write(fd, '// @unocss-include\nexport const icons = ' + JSON.stringify(icons), (err) => {
        if (err) {
          console.error(err)
        }
        fs.close(fd, (err) => {
          if (err) {
            console.error(err)
          }
        })
      })
    })
  }
}
