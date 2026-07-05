"use client";

import React, { use, useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchId, setSearchId] = useState("");

  // ===========================
  // GET ALL POSTS
  // ===========================
  async function fetchPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();

    setPosts(data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  // ===========================
  // CREATE POST
  // ===========================
  async function addPost() {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    setTitle("");
    setContent("");

    fetchPosts();
  }

  // ===========================
  // GET SINGLE POST
  // ===========================
  async function getPost(id: number) {
    const res = await fetch(`/api/posts/${id}`);
    const post: Post = await res.json();

    setTitle(post.title);
    setContent(post.content ?? "");

    setSelectedId(post.id);
    setEditMode(true);
  }

  // ===========================
  // UPDATE POST
  // ===========================
  async function updatePost() {
    if (selectedId === null) return;

    await fetch(`/api/posts/${selectedId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    setTitle("");
    setContent("");
    setSelectedId(null);
    setEditMode(false);

    fetchPosts();
  }

  // ===========================
  // DELETE POST
  // ===========================
  async function deletePost(id: number) {
    const confirmDelete = confirm("Delete this post?");

    if (!confirmDelete) return;

    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (selectedId === id) {
      setTitle("");
      setContent("");
      setSelectedId(null);
      setEditMode(false);
    }

    fetchPosts();
  }

  // ===========================
  // CANCEL EDITING
  // ===========================
  function cancelEdit() {
    setTitle("");
    setContent("");
    setSelectedId(null);
    setEditMode(false);
  }

  // to get a post by id
  async function searchPost() {
  try {
    if (!searchId) return;

    if (Number(searchId) <= 0) {
      alert("Invalid post ID");
      return;
    }

    const res = await fetch(`/api/posts/${searchId}`);

    if (!res.ok) {
      alert("Post not found");
      return;
    }

    const post = await res.json();

    setPosts([post]);
  } finally {
    setSearchId("");
  }
}

  // to view all posts again after searching
  async function showAllPosts() {
    fetchPosts();
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Prisma 7 Blog</h1>

      <div className="border rounded-lg p-6 shadow">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <textarea
          placeholder="Enter content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded w-full mb-4 h-32"
        />

        <div className="flex gap-3">
          <button
            onClick={editMode ? updatePost : addPost}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editMode ? "Update Post" : "Add Post"}
          </button>

          {editMode && (
            <button
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-6 mt-5">
        <input
          type="number"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border p-2 rounded w-40"
        />

        <button
          onClick={searchPost}
          className="bg-green-600 text-white px-4 rounded"
        >
          Search
        </button>

        <button
          onClick={showAllPosts}
          className="bg-gray-600 text-white px-4 rounded"
        >
          Show All
        </button>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4">All Posts</h2>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4 mb-4 shadow">
            <h3 className="text-xl font-bold">{post.title}</h3>

            <p className="my-3">{post.content}</p>

            <p className="text-sm text-gray-500 mb-4">
              {new Date(post.createdAt).toLocaleString()}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => getPost(post.id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deletePost(post.id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
