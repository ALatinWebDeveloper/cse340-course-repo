import bcrypt from 'bcrypt';
import { createNewUser, authenticateUser, getAllUsers, addvolunteer, projectsVolunteeredFor, removeVolunteerFromProject } from '../models/users.js';
import { getAllProjects } from '../models/projects.js';

const saltRounds = 10;

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it in the database
        const salt = await bcrypt.genSalt(saltRounds);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user in the database
        const user_id = await createNewUser(name, email, password_hash);

        //Redirect tot he home page after successful registration
        req.flash('success', 'Registration successful! You can now log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error occurred while registering user:', error);
        req.flash('error', 'An error occurred while registering. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {

    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await authenticateUser(email, password);

        if (user) {

            req.session.user = user;
            req.flash('success', 'Login successful! Welcome in, ' + user.name + '.');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard');
        } else {

            req.flash('error', 'Invalid email or password. Please try again.');
            return res.redirect('/login');
        }

    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const showDashboard = async (req, res) => {

    try {

        const userId = req.session.user.user_id;
        const user = req.session.user;
        const projects = await projectsVolunteeredFor(userId);
        const title = 'Dashboard';

        console.log('Volunteered projects for user', userId, ':', projects);

        console.log('User info from session:', user);

        res.render('dashboard', {
            title,
            name: user.name,
            email: user.email,
            projects
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        req.flash('error', 'An error occurred while loading the dashboard. Please try again.');
        res.redirect('/');
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

const displayUserInfo = async (req, res) => {

    const users = await getAllUsers();
    const title = 'User Information';

    res.render('user-info', { title, users: users || [] });
}

const processVolunteerSignup = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;

    try {
        await addvolunteer(userId, projectId);
        req.flash('success', 'You have successfully signed up to volunteer for this project!');
        res.redirect('/project/' + projectId);
    } catch (error) {
        console.error('Error occurred while signing up for project:', error);
        req.flash('error', 'An error occurred while signing up for the project. Please try again.');
        res.redirect('/project/' + projectId);
    }
}

const processVolunteerRemove = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;

    try {
        await removeVolunteerFromProject(userId, projectId);
        req.flash('success', 'You have successfully unsubscribed from this project.');
        res.redirect('/project/' + projectId);
    } catch (error) {
        console.error('Error occurred while unsubscribing from project:', error);
        req.flash('error', 'An error occurred while unsubscribing from the project. Please try again.');
        res.redirect('/project/' + projectId);
    }
}

export {
    showUserRegistrationForm, processUserRegistrationForm,
    showLoginForm, processLoginForm, processLogout, requireLogin,
    requireRole, showDashboard, displayUserInfo, processVolunteerSignup, processVolunteerRemove
};