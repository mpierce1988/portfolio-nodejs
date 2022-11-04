const $ = (elementId) => {
    return document.getElementById(elementId);
}

// Save form values to variables
const id = document.getElementById('projectId').value;
const projectName = $('projectName').value;
const projectDescription = $('projectDescription').value;
const linkToProjectImage = $('linkToProjectImage').value;
const features = document.querySelectorAll('[id^="feature"]');
const linkToProject = $('linkToProject').value;

/**
 * Creates an Object representing the Project from the form fields
 * @returns 
 */
const getProjectObject = () => {
    let featureArray = [];

    features.forEach(feature => {
        featureArray.push(feature.value);
    })

    return {
        id,
        projectName,
        projectDescription,
        linkToProjectImage,
        featureArray,
        linkToProject
    }
}

const requestPatch = () => {
    let project = getProjectObject();

    console.log(project);

    fetch(`http://localhost:5000/admin/edit/${project.id}`, {
        method: "PATCH",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(project)
    });
}

try {
    let saveButton = $("save");
    saveButton.addEventListener('click', requestPatch);
} catch (error) {
    
}