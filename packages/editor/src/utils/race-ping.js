// const CDNS = ['https://unpkg.com/', 'https://www.jsdelivr.com/npm/']
const race = CDNS => {
  const promises = []
  for (const serverUrl of CDNS) {
    const doLoad = async serverUrl => {
      try {
        return fetch(serverUrl + 'ridge-editor@1.2.0/package.json', { credentials: 'omit' })
      } catch (e) {
        //
      }
    }
    promises.push(doLoad(serverUrl))
  }

  return new Promise((resolve, reject) => {
    Promise.race(promises).then((resolved) => {
      console.log('resolved', resolved.url)

      resolve(CDNS.find(u => resolved.url.startsWith(u)))
    })
  })
}

export default race
