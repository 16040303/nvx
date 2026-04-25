import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

function sanitizePathSegment(value: string): string {
  const sanitized = value.replace(/[^a-zA-Z0-9-_]/g, '')
  return sanitized || 'general'
}

function sanitizeFileName(originalName: string) {
  const parsed = path.parse(originalName)
  const safeBaseName = parsed.name
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'upload'

  const safeExtension = parsed.ext.replace(/[^.a-zA-Z0-9]/g, '').toLowerCase()

  return {
    safeBaseName,
    safeExtension,
  }
}

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const fileEntry = formData.get('file')
    const campaignIdEntry = formData.get('campaignId')

    if (!(fileEntry instanceof File)) {
      return NextResponse.json(
        { error: 'Vui lòng chọn hình ảnh hoặc video để tải lên.' },
        { status: 400 }
      )
    }

    if (fileEntry.size === 0) {
      return NextResponse.json(
        { error: 'Tệp tải lên không hợp lệ.' },
        { status: 400 }
      )
    }

    if (fileEntry.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: 'Dung lượng tệp vượt quá 10MB.' },
        { status: 400 }
      )
    }

    const isSupportedType =
      fileEntry.type.startsWith('image/') || fileEntry.type.startsWith('video/')

    if (!isSupportedType) {
      return NextResponse.json(
        { error: 'Chỉ hỗ trợ tệp hình ảnh hoặc video.' },
        { status: 400 }
      )
    }

    const campaignId = sanitizePathSegment(
      typeof campaignIdEntry === 'string' ? campaignIdEntry : 'general'
    )

    const { safeBaseName, safeExtension } = sanitizeFileName(fileEntry.name)
    const uniqueFileName = `${safeBaseName}-${Date.now()}-${randomUUID().slice(0, 8)}${safeExtension}`

    const outputDirectory = path.join(
      process.cwd(),
      'public',
      'uploads',
      'marketing',
      campaignId
    )

    await mkdir(outputDirectory, { recursive: true })

    const fileBuffer = Buffer.from(await fileEntry.arrayBuffer())
    const outputPath = path.join(outputDirectory, uniqueFileName)

    await writeFile(outputPath, fileBuffer)

    return NextResponse.json({
      fileUrl: `/uploads/marketing/${campaignId}/${uniqueFileName}`,
      fileName: fileEntry.name,
      fileType: fileEntry.type,
      fileSize: fileEntry.size,
    })
  } catch (error) {
    console.error('[marketing-upload] Unexpected error:', error)

    return NextResponse.json(
      { error: 'Không thể tải tệp lên. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}
