import React , {useState} from 'react';
import SimpleCheckboxSection from './SimpleCheckboxSection.js';
import ProjectStepsSection from './ProjectStepsSection.js';

function ProjectDetails (props) {
    return (
        <div className="col s12">
            <div className="nav-wrapper">
                <div className="row blue">
                    <div className="col s12">
                        <h5 className="center-align white-text header">{props.projectDraft.title}</h5>
                    </div>
                </div>
            </div>
            <div className="row">
                <ProjectEditingForm projectDraft={props.projectDraft} updateProjectDraft={props.updateProjectDraft} saveProjectChanges={props.saveProjectChanges}
                            handleMainAppView={props.handleMainAppView}/>
            </div>
        </div>
    )
}

function ProjectEditingForm (props) {

    const [notesValue, setNotesValue] = useState("");
/*
    useEffect(() => {
        setTitleValue(props.projectDraft.title);
    },[props.projectDraft.title]);
*/
    function handleChange(event) {
        switch (event.target.id) {
            case "notes_textarea":
                setNotesValue(event.target.value);
                break;
            default:
        }

    }
    function saveProject() {
        const projectToChange = props.projectDraft;
        console.log(projectToChange);
        props.updateProjectDraft(projectToChange);
        props.saveProjectChanges();
    }


    return (
        <div className="container">
        <div className="row">
            <div className="col s12">
                <div className="row">
                    <div className="input-field col s12">
                        <textarea id="notes_textarea" className="materialize-textarea"  value={notesValue} onChange={handleChange}/>
                        <label htmlFor="notes_textarea">Project Notes</label>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="row">
                    <SimpleCheckboxSection projectDraft={props.projectDraft} updateProjectDraft={props.updateProjectDraft} listType="tools"/>
                    <SimpleCheckboxSection projectDraft={props.projectDraft} updateProjectDraft={props.updateProjectDraft} listType="materials"/>
                </div>
                <div className="divider"></div>
                <ProjectStepsSection projectDraft={props.projectDraft} updateProjectDraft={props.updateProjectDraft}/>
                <div className="divider"></div>
                <div className="row">
                {props.projectDraft.video_urls.length > 0
                    &&
                    <div className="video-container">
                        <iframe title="video1" src={props.projectDraft.video_urls[0]} frameBorder="0" allowFullScreen></iframe>
                    </div>
                }
                </div>
                <div className="row center-align">
                    <button className="btn waves-effect waves-light blue" type="button" name="action" onClick={saveProject}>Save</button>
                    <button className="btn waves-effect waves-light blue" type="button" name="action" onClick={()=> props.handleMainAppView('SearchResults')}>Add From Other Sites</button>
                </div>
            </div>
        </div>
        </div>
    )
}

export default ProjectDetails;
/*
const [titleValue, setTitleValue] = useState("");
projectToChange.title = titleValue;
<div className="row">
    <div className="input-field col s12">
        <input id="title_input" type="text" className="validate" value={titleValue} onChange={handleChange} placeholder=""/>
        <label className="active" htmlFor="title_input">Project Title</label>
    </div>
</div>
<div className="divider"></div>
 */
