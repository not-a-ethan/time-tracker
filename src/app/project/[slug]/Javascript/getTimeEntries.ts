export default async function TimeEntries(id: number) {
    let timeEntries;

    const url = `/api/time/get?type=project&project_id=${id}`;

    const response = await fetch(url, {
        method: 'GET',
        cache: 'force-cache',
        next: {
            revalidate: 300,
            tags: [`${id}-timeEntries`]
        }
    });

    let json = await response.json();

    if (response.status === 500) {
        return null;
    }

    json = json.reverse();
    timeEntries = json;
    
    return timeEntries;
}