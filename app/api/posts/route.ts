import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// export async function GET(){

//     const posts = await prisma.post.findMany();

//     return NextResponse.json(posts);
// }

// export async function POST() {

//     const post = await prisma.post.create({
//         data:{
//             title: "My first post",
//             content: "Learning Prisma with Next.js is awesome!"
//         }
//     })
//     return NextResponse.json(post);
// }

// API route to handle GET and POST requests for posts

export async function GET() {
  // get all posts from the database in descending order by date created

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(posts);
}

// a POST api route to create a new post in the database

export async function POST(request: Request) {
  const body = await request.json();

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return NextResponse.json(post);
}
