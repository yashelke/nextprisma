import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const body = await req.json();

  const post = await prisma.post.update({
    where: {
      id: Number(id),
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({
    message: "Post deleted successfully",
  });
}

// get a post by id from the database

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // if the id is zero or negative, return a 400 error with a message "Invalid post ID"

  if (Number(id) <= 0) {
    return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  // if the post is not found, return a 404 error with a message "Post not found"

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  // if post is found, return the post as a JSON response

  return NextResponse.json(post);
}
