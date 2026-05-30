import db from './db.js'

const getAllProjects = async () => {
  const query = `
        SELECT project_id, organization_id, title, description, location, event_date
      FROM public.projects;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          event_date
        FROM projects
        WHERE organization_id = $1
        ORDER BY event_date;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

async function getUpcomingProjects(number_of_projects) {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.event_date AS date,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM projects p
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE p.event_date >= CURRENT_DATE
    ORDER BY p.event_date ASC
    LIMIT $1
  `;
  const { rows } = await db.query(query, [number_of_projects]);
  return rows;
}

async function getProjectDetails(id) {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.event_date AS date,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM projects p
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0]; // returns the project object or undefined if not found
}

const createProject = async (title, description, location, date, organizationId) => {
  const query = `
      INSERT INTO projects (title, description, location, event_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
}

const updateProject = async (projectId, title, description, location, event_date, organizationId) => {
  const query = `
    UPDATE projects
    SET title = $2, description = $3, location = $4, event_date = $5, organization_id = $6
    WHERE project_id = $1
    RETURNING project_id;
    `;
  const queryParams = [projectId, title, description, location, event_date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated project with ID:', projectId);
  }

  return result.rows[0].project_id;
};

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, updateProject, createProject };