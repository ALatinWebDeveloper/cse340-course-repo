import db from './db.js'

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
      FROM public.categories;
    `;

    const result = await db.query(query);

    return result.rows;
}

// src/models/categories.js
const pool = db;

async function getCategoryById(categoryId) {
  const { rows } = await pool.query(
    'SELECT * FROM categories WHERE category_id = $1',
    [categoryId]
  );
  return rows[0];   // returns the category object or undefined
}

async function getCategoriesByProject(projectId) {
  const query = `
    SELECT c.category_id, c.name
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name
  `;
  const { rows } = await pool.query(query, [projectId]);
  return rows;
}

async function getProjectsByCategory(categoryId) {
  const query = `
    SELECT p.project_id, p.title, p.description, p.event_date AS date,
           p.location, p.organization_id, o.name AS organization_name
    FROM projects p
    JOIN organization o ON p.organization_id = o.organization_id
    JOIN project_categories pc ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.event_date ASC
  `;
  const { rows } = await pool.query(query, [categoryId]);
  return rows;
}

export { getAllCategories, getCategoryById, getCategoriesByProject, getProjectsByCategory };