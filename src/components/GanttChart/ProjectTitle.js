import React, { useEffect, useState } from 'react';
import ProjectHeader from './ProjectHeader';
import './ProjectTitle.css';
import {buildPath} from '../buildPath';


const ProjectTitle = ({ projectId, founderId }) => {
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const response = await fetch(buildPath(`api/getProjectDetails/${projectId}`));
        const project = await response.json();

        if (!response.ok) {
          throw new Error(project.error || 'Failed to fetch project');
        }

        setProjectName(project.nameProject);
      } catch (error) {
        console.error('Error fetching project name:', error);
      }
    };

    fetchProjectName();
  }, [projectId, founderId]);

  return (
    <div>
      {/* Pass projectName, setProjectName, and projectId to ProjectHeader */}
      <ProjectHeader projectName={projectName} setProjectName={setProjectName} projectId={projectId} founderId={founderId} />
    </div>
  );
};

export default ProjectTitle;
