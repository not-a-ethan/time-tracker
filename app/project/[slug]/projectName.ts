import { useState, useEffect } from 'react';
import React from 'react';

export default function GetProjectName(props: any) {
    const [projectName, setProjectName] = useState('');
    const id = props.id;

    useEffect(() => {
        const fetchProjectName = async () => {
            const currentDomain = window.location.hostname;
            const url = `/api/project/get?type=id&id=${id}`;

            const response = await fetch(url, {
                method: 'GET'
            });

            const json = await response.json();
            setProjectName(json[0]["project_name"]);
        };

        fetchProjectName();
    }, [id]);

    return (
        React.createElement('span', { id: 'projectName' },
            projectName
        )
    );
}