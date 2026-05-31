import {
    getAllCategories, getCategoriesByProject, getCategoryById, getProjectsByCategory,
    updateCategoryAssignments, createCategory, updateCategory
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Category name must be between 3 and 150 characters')
];

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

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProject(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showCreateCategoryForm = (req, res) => {

    const title = 'Create a New Category';
    res.render('new-category', { title });
};

const showEditCategoryForm = async (req, res, next) => {

    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    const title = 'Edit Category';
    res.render('edit-category', { title, category });
};

const processNewCategoryForm = async (req, res, next) => {
    
    const result = validationResult(req);
    if (!result.isEmpty()) {
        result.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/categories`);
    }

    const { category_name } = req.body;
    const categoryId = await createCategory(category_name);

    req.flash('success', 'Category created successfully!');
    res.redirect(`/category/${categoryId}`);
};

const processEditCategoryForm = async (req, res, next) => {

    const categoryId = req.params.id;
    const { category_name } = req.body;

    // Check for validation errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        result.array().forEach((error) => {
            req.flash('error', error.msg);
        });

    //redirect back to the edit category form
        return res.redirect(`/edit-category/${categoryId}`);
    }

    await updateCategory(categoryId, category_name);

    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
}

// Export any controller functions
    export {
        showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm,
        processAssignCategoriesForm, showCreateCategoryForm, categoryValidation,
        processNewCategoryForm, showEditCategoryForm, processEditCategoryForm
    };