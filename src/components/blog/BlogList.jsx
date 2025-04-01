
import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Edit, Trash2, Eye, ThumbsUp } from "lucide-react"
import BlogView from "./BlogView"
import { Badge } from "../ui/badge"

const BlogList = ({ blogs, loading, onEdit, onDelete, onLike }) => {
  const [selectedBlog, setSelectedBlog] = useState(null)

  const handleView = (blog) => {
    setSelectedBlog(blog)
  }

  const closeView = () => {
    setSelectedBlog(null)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (blogs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No blogs found. Create your first blog!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-0 overflow-auto">
        <table className="min-w-full table-auto w-full border-collapse">
  <thead className="bg-gray-200">
    <tr className="border-b">
      <th className="p-2 border bg-gray-300">Image</th>
      <th className="p-2 border bg-gray-300">Title</th>
      <th className="p-2 border bg-gray-300">Description</th>
      <th className="p-2 border bg-gray-300">Likes</th>
      <th className="p-2 border bg-gray-300">Actions</th>
    </tr>
  </thead>
  <tbody>
    {blogs.map((blog) => (
      <tr key={blog._id} className="border-b">
        <td className="p-2 border">
          {blog.image ? (
            <div className="h-12 w-12 rounded overflow-hidden">
              <img
                src={`http://localhost:3000/${blog.image}`}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
        </td>
        <td className="p-2 border">{blog.title}</td>
        <td className="p-2 border">
          <div className="truncate whitespace-normal break-words">{blog.description}</div>
        </td>
        <td className="p-2 border">
          <Badge variant="secondary">{blog.likes?.length || 0} likes</Badge>
        </td>
        <td className="p-2 border">
          <div className="flex justify-end gap-2">
            <button type="button" variant="outline" className="px-4 py-2 bg-blue-500 text-white rounded" size="sm" onClick={() => handleView(blog)} >
              <Eye className="h-4 w-4" />
            </button>
            <button type="button" variant="outline" className="px-4 py-2 bg-blue-500 text-white rounded" size="sm" onClick={() => onEdit(blog)} >
              <Edit className="h-4 w-4" />
            </button>
            <button type="button" variant="outline" className="px-4 py-2 bg-blue-500 text-white rounded" size="sm" onClick={() => onDelete(blog._id)} >
              <Trash2 className="h-4 w-4" />
            </button>
            <button type="button" variant="outline" className="px-4 py-2 bg-blue-500 text-white rounded" size="sm" onClick={(e) => { e.preventDefault(); onLike(blog._id); }} >
              <ThumbsUp
                className={`h-4 w-4 ${blog.likes?.includes(
                  JSON.parse(localStorage.getItem("user"))._id
                )
                  ? "fill-primary"
                  : ""}`}
              />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </CardContent>
      </Card>

      {selectedBlog && <BlogView blog={selectedBlog} onClose={closeView} />}
    </>
  )
}

export default BlogList

