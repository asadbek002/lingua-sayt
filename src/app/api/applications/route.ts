import { NextRequest, NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validations/applicationSchema";
import { storageService } from "@/lib/services/storageService";
import { sendAllNotifications } from "@/lib/services/notificationService";
import { validateFileType, validateFileSize, validateFileExtension, matchesMagicBytes } from "@/lib/utils/fileValidation";
import { checkRateLimit } from "@/lib/utils/rateLimit";
import { sanitizeFormData } from "@/lib/utils/sanitize";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || "unknown";
  const rateCheck = checkRateLimit(ip);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, message: "Слишком много запросов. Попробуйте позже." },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();

    const rawData = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      preferredMessenger: formData.get("preferredMessenger") as string,
      messengerContact: (formData.get("messengerContact") as string) || undefined,
      serviceType: formData.get("serviceType") as string,
      sourceLanguage: (formData.get("sourceLanguage") as string) || undefined,
      targetLanguage: (formData.get("targetLanguage") as string) || undefined,
      urgency: formData.get("urgency") as string,
      comment: (formData.get("comment") as string) || undefined,
    };

    const validation = applicationSchema.safeParse(rawData);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Ошибка валидации", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizeFormData(validation.data);

    let fileUrl: string | undefined;
    let fileName: string | undefined;
    let fileType: string | undefined;
    let fileSize: number | undefined;
    let fileBuffer: Buffer | undefined;

    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      if (!validateFileType(file.type) || !validateFileExtension(file.name)) {
        return NextResponse.json(
          { success: false, message: "Неподдерживаемый тип файла" },
          { status: 400 }
        );
      }

      if (!validateFileSize(file.size)) {
        return NextResponse.json(
          { success: false, message: "Файл слишком большой. Максимум 15 МБ." },
          { status: 400 }
        );
      }

      fileBuffer = Buffer.from(await file.arrayBuffer());
      if (!matchesMagicBytes(fileBuffer, file.type)) {
        return NextResponse.json(
          { success: false, message: "Содержимое файла не соответствует его типу" },
          { status: 400 }
        );
      }
      const uploadResult = await storageService.uploadFile(fileBuffer, file.name, file.type);

      fileUrl = uploadResult.fileUrl;
      fileName = file.name;
      fileType = file.type;
      fileSize = file.size;
    }

    const application = await prisma.application.create({
      data: {
        ...sanitizedData,
        messengerContact: sanitizedData.messengerContact || null,
        sourceLanguage: sanitizedData.sourceLanguage || null,
        targetLanguage: sanitizedData.targetLanguage || null,
        comment: sanitizedData.comment || null,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileType: fileType || null,
        fileSize: fileSize || null,
        source: "WEBSITE",
      },
    });

    // after() keeps the work alive on serverless runtimes after the response is sent
    after(() =>
      sendAllNotifications(application, fileBuffer).catch((err) => {
        console.error("[API/applications] Notification error:", err);
      })
    );

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: application.id,
    });
  } catch (err) {
    console.error("[API/applications] Error:", err);
    return NextResponse.json(
      { success: false, message: "Произошла ошибка. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
