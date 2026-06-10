import db from './db.js'
import bcrypt from 'bcrypt';

const createNewUser = async (name, email, password_hash, role_id) => {

    const default_role = 'user';
    const query = `INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3,
    (SELECT role_id FROM roles WHERE role_name = $4)) RETURNING user_id`;

    const queryParams = [name, email, password_hash, default_role];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('New user created with ID:', result.rows[0].user_id);
    }
    return result.rows[0].user_id;
}

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {

    const user = await findUserByEmail(email);

    if (!user) {
        return null; // User not found
    }

    const isMatch = await verifyPassword(password, user.password_hash);

    if (!isMatch) {
        return null; // Incorrect password
    }

    return user; // Authentication successful
};

const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name;
    `;

    const result = await db.query(query);

    return result.rows;
};

const addvolunteer = async (userId, projectId) => {
    const query = `
    INSERT INTO project_volunteers (user_id, project_id)
    VALUES ($1, $2)
    RETURNING user_id;
  `;
    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to sign up for project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('User signed up for project:', userId, projectId);
    }

    return result.rows[0].user_id;
};

const isVolunteerForProject = async (userId, projectId) => {
    const query = `
        SELECT user_id
        FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2
    `;
    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0; // Returns true if user is a volunteer for the project
};

const projectsVolunteeredFor = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.event_date
        FROM project_volunteers pv
        Join projects p ON pv.project_id = p.project_id
        WHERE pv.user_id = $1
        ORDER BY p.event_date ASC
    `;

    const queryParams = [userId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

const removeVolunteerFromProject = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2
    `;
    const queryParams = [userId, projectId];
    await db.query(query, queryParams);
};

export {
    createNewUser, findUserByEmail, verifyPassword, authenticateUser,
    getAllUsers, addvolunteer, isVolunteerForProject, projectsVolunteeredFor, removeVolunteerFromProject
};