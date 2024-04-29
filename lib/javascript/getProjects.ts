export async function getProjects() {
    const baseURL = 'time-tracker.replit.app'; // replace with your server's base URL
    const url = new URL('/api/project/list', baseURL);

    const response = await fetch(url, {
        method: 'GET',
    })

    const responseJSON = await response.json();

    let projectHTML: any = []

    for (let i = 0; i < responseJSON.length; i++) {
        const project = responseJSON[i];
        const projectElement = document.createElement("li");
        projectElement.innerHTML = project.slug;
        projectHTML.push(projectElement);
    }

    const projectList: any = document.getElementById("projectList");

    while (projectList.firstChild) {
        projectList.removeChild(projectList.firstChild);
    }
    
    for (let i = 0; i < projectHTML.length; i++) {
        projectList.append(projectHTML[i]);
    }
}