import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/auth-middleware";

// GET: Mendapatkan suggestions untuk autocomplete
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get("field");
    const query = searchParams.get("query") || "";

    if (!field) {
      return NextResponse.json(
        { success: false, error: "Field parameter is required" },
        { status: 400 }
      );
    }

    let suggestions: string[] = [];

    switch (field) {
      case "recipientEmail":
        const emails = await prisma.certificate.findMany({
          where: {
            recipientEmail: {
              contains: query,
              mode: "insensitive",
            },
          },
          select: { recipientEmail: true },
          distinct: ["recipientEmail"],
          take: 10,
          orderBy: { issueDate: "desc" },
        });
        suggestions = emails.map((e) => e.recipientEmail);
        break;

      case "recipientName":
        const names = await prisma.certificate.findMany({
          where: {
            recipientName: {
              contains: query,
              mode: "insensitive",
            },
          },
          select: { recipientName: true },
          distinct: ["recipientName"],
          take: 10,
          orderBy: { issueDate: "desc" },
        });
        suggestions = names.map((n) => n.recipientName);
        break;

      case "location":
        const locations = await prisma.certificate.findMany({
          where: {
            location: {
              not: null,
              contains: query,
              mode: "insensitive",
            },
          },
          select: { location: true },
          distinct: ["location"],
          take: 10,
          orderBy: { issueDate: "desc" },
        });
        suggestions = locations
          .map((l) => l.location)
          .filter((loc): loc is string => loc !== null);
        break;

      case "containerNumber":
        const containers = await prisma.certificate.findMany({
          where: {
            containerNumber: {
              not: null,
              contains: query,
              mode: "insensitive",
            },
          },
          select: { containerNumber: true },
          distinct: ["containerNumber"],
          take: 10,
          orderBy: { issueDate: "desc" },
        });
        suggestions = containers
          .map((c) => c.containerNumber)
          .filter((cn): cn is string => cn !== null);
        break;

      case "noticeId":
        const notices = await prisma.certificate.findMany({
          where: {
            noticeId: {
              not: null,
              contains: query,
              mode: "insensitive",
            },
          },
          select: { noticeId: true },
          distinct: ["noticeId"],
          take: 10,
          orderBy: { issueDate: "desc" },
        });
        suggestions = notices
          .map((n) => n.noticeId)
          .filter((nid): nid is string => nid !== null);
        break;

      case "woNumber":
        const woNumbers = await prisma.certificate.findMany({
          where: {
            woNumber: {
              not: null,
              contains: query,
              mode: "insensitive",
            },
          },
          select: { woNumber: true },
          distinct: ["woNumber"],
          take: 10,
          orderBy: { issueDate: "desc" },
        });
        suggestions = woNumbers
          .map((w) => w.woNumber)
          .filter((wo): wo is string => wo !== null);
        break;

      case "companyName":
        const companies = await prisma.fumigationTracking.findMany({
          where: {
            companyName: {
              contains: query,
              mode: "insensitive",
            },
          },
          select: { companyName: true },
          distinct: ["companyName"],
          take: 10,
          orderBy: { createdAt: "desc" },
        });
        suggestions = companies.map((c) => c.companyName);
        break;

      case "companyEmail":
        const companyEmails = await prisma.fumigationTracking.findMany({
          where: {
            companyEmail: {
              contains: query,
              mode: "insensitive",
            },
          },
          select: { companyEmail: true },
          distinct: ["companyEmail"],
          take: 10,
          orderBy: { createdAt: "desc" },
        });
        suggestions = companyEmails.map((c) => c.companyEmail);
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid field parameter" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error: any) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch suggestions",
      },
      { status: 500 }
    );
  }
});

