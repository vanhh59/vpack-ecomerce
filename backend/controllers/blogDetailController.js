import BlogDetail from "../models/blogDetailModel.js"; // Import the BlogDetail model for validation or population
import Blog from "../models/blogModel.js"; // Import the Blog model for validation or population

// Create a new blog detail
export const createBlogDetail = async (req, res) => {
    try {
        const { blogId, title, description, image } = req.body;

        // Check if the referenced blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Create a new BlogDetail entry
        const blogDetail = new BlogDetail({
            blogId,
            title,
            description,
            image,
        });

        // Save to database
        await blogDetail.save();

        res.status(201).json(blogDetail);
    } catch (error) {
        res.status(500).json({ message: "Error creating blog detail", error });
    }
};

// Get all blog details
export const getAllBlogDetails = async (req, res) => {
    try {
        const blogDetails = await BlogDetail.find()
        res.status(200).json(blogDetails);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog details", error });
    }
};

// Get a single blog detail by ID
export const getBlogDetailById = async (req, res) => {
    try {
        const { id } = req.params;
        const blogDetail = await BlogDetail.findById(id);

        if (!blogDetail) {
            return res.status(404).json({ message: "Blog detail not found" });
        }

        res.status(200).json(blogDetail);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog detail", error });
    }
};

// Get a single blog detail by blog ID
export const getBlogDetailByBlogId = async (req, res) => {
    try {
        const { id } = req.params;
        const blogDetail = await BlogDetail.find({ blogId: id });

        if (!blogDetail) {
            return res.status(404).json({ message: "Blog detail not found" });
        }

        res.status(200).json(blogDetail);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog detail", error });
    }
};

// Update a blog detail
export const updateBlogDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const { blogId, title, description, image } = req.body;

        // Check if the new referenced blog exists
        if (blogId) {
            const blog = await Blog.findById(blogId);
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
        }

        const updatedBlogDetail = await BlogDetail.findByIdAndUpdate(
            id,
            { blogId, title, description, image },
            { new: true, runValidators: true }
        );

        if (!updatedBlogDetail) {
            return res.status(404).json({ message: "Blog detail not found" });
        }

        res.status(200).json(updatedBlogDetail);
    } catch (error) {
        res.status(500).json({ message: "Error updating blog detail", error });
    }
};

// Delete a blog detail
export const deleteBlogDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlogDetail = await BlogDetail.findByIdAndDelete(id);

        if (!deletedBlogDetail) {
            return res.status(404).json({ message: "Blog detail not found" });
        }

        res.status(200).json({ message: "Blog detail deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog detail", error });
    }
};
