// Import necessary modules
import { join } from "path";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import sharp from "sharp";
import dayjs from "dayjs";

export async function POST(request) {
  console.log("🚀  request:::", request);
  try {
    // 获取 formData
    const formData = await request.formData();
    const file = formData.get("file");
    const format = formData.get("format");
    const quality = formData.get("quality");

    // console.log('🚀 file:::', file);

    // 空值判断
    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    // Read file into buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    // console.log('🚀  buffer:::', buffer)

    // Define upload directory based on date
    const relativeUploadDir = `/uploads/${dayjs().format("YY-MM-DD")}`;
    const uploadDir = join(process.cwd(), "public", relativeUploadDir);

    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Define file path and name
    const fileName = `${dayjs().format("YYMMDD_HHmmss")}_${file.name}`;
    const filePath = join(uploadDir, fileName);

    // Compress the image using sharp
    const compressedBuffer = await sharp(buffer)
      // .resize(800)
      .toFormat(format)
      .jpeg({ quality: Number(quality) || 70 })
      .toBuffer();

    // Get the size of the compressed image
    const fileSizeInBytes = compressedBuffer.length;

    // Write the compressed image to the file system
    await writeFile(filePath, compressedBuffer);

    // Return the response with the URL and size of the compressed image
    return NextResponse.json(
      {
        url: `${relativeUploadDir}/${fileName}`,
        size: `${(fileSizeInBytes / 1024).toFixed(2)} KB`, // Convert size to KB and format it
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing the file:", error);
    return NextResponse.json(
      { error: "Failed to process the file." },
      { status: 500 }
    );
  }
}
