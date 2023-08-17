export function fileToFormData(file: File): FormData {
    const fromData = new FormData()
    fromData.append('file', file)
    return fromData
}