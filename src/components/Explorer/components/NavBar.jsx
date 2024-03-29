// NavBar.jsx
import '../styling/NavBar.css'
import { handleHomepage, handleRefresh, handleNewFolder, handleUploadFiles, handleUploadFolder } from '../utils/NavBarUtils';

export default function NavBar(props) {

    const parameters = props.parameters;

    return (
    <div id = "navigation-bar">
        <label textContent = "🏠 Home" onClick = {() => handleHomepage(parameters)} />
        <label textContent = "🔄 Refresh" onClick = {() => handleRefresh(parameters)} />
        <label textContent = "📂 New Folder" onClick = {() => handleNewFolder(parameters)} />
        <label for = "uploadFiles" textContent = "📄 Upload Files"/>
        <input type = "file" id = "uploadFiles" onChange = {() => handleUploadFiles(parameters)} multiple/>
        <label for = "uploadFolder" textContent = "🗃️ Upload Folder"/>
        <input type = "file" id = "uploadFolder" onChange = {() => handleUploadFolder(parameters)} webkitdirectory/>
    </div>
    );
}