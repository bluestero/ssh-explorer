// Contents.jsx

import '../styling/Contents.css';
import { handleNameClick, handleOpen, handleDownload, handleDelete, handleFolderUp } from '../utils/ContentsUtils';

export default function Contents(props) {

    const parameters = props.parameters;
    const data = parameters.data;

    return (
        <div id = "content-container">
        <div id = "content">
        <div><span class = "clickable" onClick = {() => handleNameClick(parameters)}>Name</span></div>
        <div><span>Size</span></div>
        <div><span>Last Updated</span></div>
        <div><span>Downloads</span></div>
        <div><span>Deletion </span></div>
        </div>

        {parameters.currentDir() == '/home/akhatib' ? null :
        <div id = "content">
        <div><span class = "clickable" onClick = {() => handleFolderUp(parameters)}>📁...</span></div>
        <div><span>...</span></div>
        <div><span>...</span></div>
        <div><span>...</span></div>
        <div><span>...</span></div>
        </div>
        }

        {data().name.map((name, index) => (
        <div id = "content">
        <div><span class = "clickable" key = {index} name = {name} onClick = {() => handleOpen(parameters, data().path[index], data().is_dir[index])}>
        {data().is_dir[index] ? "📁" : "📄"} {name}
        </span></div>

        <div><span>
        {data().size[index]}
        </span></div>

        <div><span>
        {data().last_updated[index]}
        </span></div>

        <div><span class = "clickable" key = {index} onClick={() => handleDownload(parameters, name, data().path[index])}>
        ⬇️ Download
        </span></div>

        <div><span class = "clickable" id = {`delete-${index}`} onClick={() => handleDelete(parameters, name, data().path[index], index)}>
        ❌ Delete
        </span></div>
        </div>
        ))}
        </div>
    );
}