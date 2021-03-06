function supportsFileReader() {
  return window.FileReader === undefined ? false : true
}

function getKeys(len) {
  let time = new Date().getTime()
  const randomNumArr = new Uint32Array(len),
    keys = []
  window.crypto.getRandomValues(randomNumArr)

  for (const num of randomNumArr) {
    const key = num.toString(36).substr(2, 5) + time.toString(36)
    keys.push(key)
    time++
  }
  return keys
}

async function handleImages(files) {
  const len = files.length,
    keys = getKeys(len),
    images = []

  // Don't use for...in, will throw err cause it'll loop through 'length' and 'item' properties
  for (const file of files) {
    const currKey = keys.pop()
    images.push({ key: currKey, file: file })
  }
  return images
}

function geoJsonToImages(geoJson) {
  const images = []
  geoJson.features.forEach(feature => {
    const obj = {}
    obj.url = feature.properties.url
    obj.key = feature.properties.key
    obj.location = feature.properties.location
    obj.selected = false
    images.push(obj)
  })

  const urls = images.map(feature => {
    return feature.url
  })

  return { images, urls }
}

export { supportsFileReader, handleImages, geoJsonToImages }
