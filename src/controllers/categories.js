// Import any needed model functions
import { getAllCategories, getCategoriesByProject, getCategoryById, getProjectsByCategory } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

async function showCategoryDetailsPage(req, res, next) {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);   // now 'next' is defined
        }

        // Get all projects that belong to this category
        const projects = await getProjectsByCategory(categoryId);

        res.render('category', {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        const err = new Error('Error loading category details');
        err.status = 500;
        return next(err);   // now 'next' is defined
    }
}

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };