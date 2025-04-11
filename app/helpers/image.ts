declare const window: Window & { ImageResize: any }

const image = {
  dataURLToBlob: async (dataUrl: string) => {
    const result = await fetch(dataUrl)
    return result.blob()
  },
  // https://www.npmjs.com/package/image-resize
  resizeImage: async ({
    file,
    width,
    format,
    quality,
    reSample,
  }: {
    file: File,
    width?: number,
    format?: string,
    quality?: number,
    reSample?: boolean,
  }) => {
    if (typeof window.ImageResize === 'undefined') return file

    const o = new window.ImageResize({
      format,
      width,
      quality,
      reSample,
    })

    try {
      const dataUrl = await o.play(file)
      return new File([await image.dataURLToBlob(dataUrl)], file.name, { type: 'image/jpeg' })
    } catch (e) {
      return file
    }
  },
  onPasteClipboardImage: async (pasteEvent: ClipboardEvent, resolve: (value: any) => void) => {
    const items = (pasteEvent.clipboardData || {}).items
    const img = (items || [])[0]
    if (!img.type.includes('image')) return

    const file = img.getAsFile() as File
    const reader = new FileReader()
    reader.onload = onloadEvent => resolve({
      file, // 원본 파일
      src: (onloadEvent.target || {}).result // base64
    })

    const target = file.size > 1048576 ? await image.resizeImage({ file, width: 1920 }) : file
    reader.readAsDataURL(target)
  },
}

export default image