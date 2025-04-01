"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import BlogList from "../blog/BlogList"
import AddBlogForm from "../blog/AddBlogForm"
import Modal from "../ui/Modal";
import ConfirmModal from "../ui/ConfirmModal";
import { LogOut, Plus, User } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editBlog, setEditBlog] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, blogId: null });

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      navigate("/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchBlogs()
  }, [navigate])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:3000/api/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBlogs(response.data)
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleAddBlog = async (blogData) => {
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("title", blogData.title)
      formData.append("description", blogData.description)
      if (blogData.image) {
        formData.append("blogImage", blogData.image)
      }

      await axios.post("http://localhost:3000/api/blogs", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      fetchBlogs()
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding blog:", error)
    }
  }

  const handleUpdateBlog = async (blogData) => {
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("title", blogData.title)
      formData.append("description", blogData.description)
      if (blogData.image && typeof blogData.image !== "string") {
        formData.append("blogImage", blogData.image)
      }

      await axios.put(`http://localhost:3000/api/blogs/${editBlog._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      fetchBlogs()
      setEditBlog(null)
      setShowAddForm(false)
    } catch (error) {
      console.error("Error updating blog:", error)
    }
  }

  const handleConfirmDelete = (blogId) => {
    setConfirmModal({ isOpen: true, blogId });
  };

  const handleDeleteBlog = async () => {
    try {
      const { blogId } = confirmModal;
      if (!blogId) return;

      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchBlogs();
      setConfirmModal({ isOpen: false, blogId: null }); // Close modal after deletion
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleEditClick = (blog) => {
    setEditBlog(blog)
    setShowAddForm(true)
  }

  const handleLikeBlog = async (blogId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `http://localhost:3000/api/blogs/${blogId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      fetchBlogs()
    } catch (error) {
      console.error("Error liking blog:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-600">BlogSpace</h1>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  {user.profileImage ? (
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-indigo-500">
                      <img
                        src={user.profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                  <span className="font-medium text-gray-700">{user.email}</span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >

                <LogOut className="h-4 w-4" />Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => {
              setEditBlog(null)
              setShowAddForm(!showAddForm)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            {showAddForm ? "Cancel" : "Add New Blog"}
          </button>
        </div>

        <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
          <AddBlogForm
            onSubmit={editBlog ? handleUpdateBlog : handleAddBlog}
            initialData={editBlog}
            isEditing={!!editBlog}
          />
        </Modal>


        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, blogId: null })}
          onConfirm={handleDeleteBlog}
          message="Are you sure you want to delete this blog?"
        />
        <BlogList
          blogs={blogs}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleConfirmDelete}
          onLike={handleLikeBlog}
        />
      </main>
    </div>
  )
}

export default Dashboard

