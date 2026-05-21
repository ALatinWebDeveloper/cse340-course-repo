// Import any needed model functions
import { getAllProjects, getProjectDetails, getUpcomingProjects, getProjectsByOrganizationId } from '../models/projects.js';

// Constant for the number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Updated home/projects page controller – now shows only upcoming projects
async function showProjectsPage(req, res) {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects
        });
    } catch (error) {
        console.error('Error fetching upcoming projects:', error);
        res.status(500).send('Server Error');
    }
}

// New controller for a single project’s details
async function showProjectDetailsPage(req, res) {
    try {
        const projectId = req.params.id;               // Extract ID from URL
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        res.render('project', {                        // Renders views/project.ejs
            title: project.title,
            project
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Server Error');
    }
}

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };