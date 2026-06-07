import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showProjectsPage, showProjectDetailsPage, processNewProjectForm,
    showNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm
} from './controllers/projects.js';

import {
    showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm,
    showEditCategoryForm, showCreateCategoryForm, processNewCategoryForm, categoryValidation, processEditCategoryForm
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

import {
    showOrganizationsPage, showOrganizationDetailsPage, processNewOrganizationForm,
    organizationValidation, showEditOrganizationForm, processEditOrganizationForm, showNewOrganizationForm, updateOrganization
} from './controllers/organizations.js';

import {
    showUserRegistrationForm, processUserRegistrationForm, showLoginForm,
    processLoginForm, processLogout, showDashboard, requireRole, requireLogin, displayUserInfo
} from './controllers/users.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/organization/:id', requireRole('admin'), showEditOrganizationForm);

// error-handling routes
router.get('/test-error', testErrorPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);
// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);

// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);
// Route to handle new project form submission
router.post('/new-project', requireRole('admin'), processNewProjectForm, projectValidation);

// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

//Routes to handle edit project form
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), processEditProjectForm);

// Route to handle new category form submission
router.get('/new-category', requireRole('admin'), showCreateCategoryForm);
router.post('/new-category', requireRole('admin'), processNewCategoryForm, categoryValidation);

// Route to handle edit category form
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), processEditCategoryForm, categoryValidation);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// User information route
router.get('/user-info', requireRole('admin'), displayUserInfo);

export default router;