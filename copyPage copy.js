const download = require('image-downloader')
const axios = require('axios')

const downloadImageFromUrl = async (options = { url: 'url', dest: 'dirPath' }, callback) => {
  try {
    const { filename } = await download.image(options)
    console.log('Saved to', filename)
  } catch (error) {
    console.error(error)
  }
}

const createDir = async (dirPath) => {
  const fs = require('fs')
  const { promisify } = require('util')
  const writeFileAsync = promisify(fs.mkdir)
  if (!fs.existsSync(dirPath)) {
    await writeFileAsync(dirPath)
    console.log('created dir');
    return
  }
  console.log('dir already exist');
  return

}


const selectedDirPhotos = async (dirPath) => {
  const { promises: Fs } = require('fs')
  try {
    await Fs.access(dirPath)
    return true
  } catch {
    return false
  }
}

const fetchStore = async (url) => {
  const { data } = await axios.get(url)
  return data.products
}

const downloadImage = async (url, dest) => {
  return await download.image({ url: url, dest: dest })
}

const getImageName = (string) => {
  return string.substring(string.lastIndexOf("/") + 1, string.lastIndexOf("?"));
}

const fetchStorePics = async (url) => {
  const data = await fetchStore(url)
  for (const item of data) {
    await createDir(`./storeData/images/${item.handle}-id-${item.id}`)
    for (const image of item.images) {
      if (await selectedDirPhotos(`./storeData/images/${item.handle}-id-${item.id}/` + getImageName(image.src))) {
        continue
      }
      const photo = await downloadImage(image.src, `./storeData/images/${item.handle}-id-${item.id}`)
      console.log('succesfuly created' + photo);
    }
  }
  console.log('finish');
}

const defaultFileCover = (pathDir) => {
  const fs = require('fs')

  const dir = pathDir
  const files = fs.readdirSync(dir)

  if (!files[1]) {
    return files[0]
  }
  return files[1]
}

module.exports = {
  getImageName,
  fetchStore,
  fetchStorePics,
  defaultFileCover
}