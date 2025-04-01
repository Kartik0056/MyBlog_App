
import { useState, useEffect } from "react"
import axios from "axios"

const BlogView = ({ blog, onClose }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const PORT_For_VERCEL = "https://my-blog-app-backend-tau.vercel.app";
  const PORT_For_API = PORT_For_VERCEL || "http://localhost:3000";
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
    fetchComments()
  }, [blog._id])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get(`${PORT_For_API}/api/blogs/${blog._id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setComments(response.data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${PORT_For_API}/api/blogs/${blog._id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setNewComment("")
      fetchComments()
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${PORT_For_API}/api/blogs/${blog._id}/comments/${commentId}/replies`,
        { content: replyText },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setReplyText("")
      setReplyTo(null)
      fetchComments()
    } catch (error) {
      console.error("Error adding reply:", error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`${PORT_For_API}/api/blogs/${blog._id}/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        fetchComments()
      } catch (error) {
        console.error("Error deleting comment:", error)
      }
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${PORT_For_API}/api/blogs/${blog._id}/comments/${commentId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      fetchComments()
    } catch (error) {
      console.error("Error liking comment:", error)
    }
  }

  const handleLikeBlog = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${PORT_For_API}/api/blogs/${blog._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      // Update blog likes in parent component
      blog.likes = blog.likes || []
      if (blog.likes.includes(currentUser._id)) {
        blog.likes = blog.likes.filter((id) => id !== currentUser._id)
      } else {
        blog.likes.push(currentUser._id)
      }
    } catch (error) {
      console.error("Error liking blog:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 overflow-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Title: {blog.title}</h2>

          <div className="space-y-6">
            {blog.image && (
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Posted by {blog.user?.email || "Anonymous"} on {new Date(blog.createdAt).toLocaleDateString()}
              </p>

              <button
                onClick={handleLikeBlog}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full ${blog.likes?.includes(currentUser?._id)
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{blog.likes?.length || 0} likes</span>
              </button>
            </div>

            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-gray-700"><span className="text-bold-400">Discription:</span> {blog.description}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>

              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>

              {loading ? (
                <div className="flex justify-center py-8">
                  <svg
                    className="animate-spin h-8 w-8 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      currentUser={currentUser}
                      onReply={() => setReplyTo(comment._id)}
                      onDelete={handleDeleteComment}
                      onLike={handleLikeComment}
                      isReplying={replyTo === comment._id}
                      replyText={replyText}
                      setReplyText={setReplyText}
                      handleReplySubmit={() => handleReplySubmit(comment._id)}
                      cancelReply={() => setReplyTo(null)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p className="mt-2 text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CommentItem = ({
  comment,
  currentUser,
  onReply,
  onDelete,
  onLike,
  isReplying,
  replyText,
  setReplyText,
  handleReplySubmit,
  cancelReply,
}) => {
  const isOwner = currentUser?._id === comment.user?._id

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          {comment.user?.profileImage ? (
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                src={comment.user.profileImage || "/placeholder.svg"}
                alt={comment.user.email}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <span>{comment.user?.email?.charAt(0).toUpperCase() || "A"}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">{comment.user?.email || "Anonymous"}</p>
            <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
          <p className="mt-1 text-sm text-gray-700">{comment.content}</p>

          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={() => onLike(comment._id)}
              className={`flex items-center text-xs ${comment.likes?.includes(currentUser?._id) ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {comment.likes?.length || 0}
            </button>

            <button onClick={onReply} className="flex items-center text-xs text-gray-500 hover:text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Reply
            </button>

            {isOwner && (
              <button
                onClick={() => onDelete(comment._id)}
                className="flex items-center text-xs text-gray-500 hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-3 space-y-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleReplySubmit}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reply
                </button>
                <button
                  onClick={cancelReply}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    {reply.user?.profileImage ? (
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <img
                          src={reply.user.profileImage || "/placeholder.svg"}
                          alt={reply.user.email}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        <span>{reply.user?.email?.charAt(0).toUpperCase() || "A"}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{reply.user?.email || "Anonymous"}</p>
                      <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{reply.content}</p>

                    <div className="mt-2 flex items-center space-x-4">
                      <button
                        onClick={() => onLike(reply._id)}
                        className={`flex items-center text-xs ${reply.likes?.includes(currentUser?._id) ? "text-red-500" : "text-gray-500 hover:text-red-500"
                          }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {reply.likes?.length || 0}
                      </button>

                      {currentUser?._id === reply.user?._id && (
                        <button
                          onClick={() => onDelete(reply._id)}
                          className="flex items-center text-xs text-gray-500 hover:text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogView

