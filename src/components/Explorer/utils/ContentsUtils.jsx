// ContentsUtils.jsx
import toast from "solid-toast";
import { saveAs } from "file-saver";
import { unFreeze, updateData, getElapsedTime } from "../../../GeneralUtils";


export const handleNameClick = async (parameters) => {
    parameters.setNameAscending(!parameters.nameAscending());
    await updateData(parameters);
}


export const handleOpen = async (parameters, path, is_dir) => {

    document.getElementById("explorer").style.pointerEvents = "none";

    if (is_dir) {
        await fetch(`http://localhost:8000/item_tapped?item=${path}`);
        updateData(parameters);
    }
    else {
        window.open(`http://localhost:8000/item_tapped?item=${path}`, "_blank");
        unFreeze('explorer', 1);
    }
}


export const handleDownload = async (parameters, name, path) => {

    const startTime = new Date();
    document.getElementById("explorer").style.pointerEvents = "none";
    const response = await fetch(`http://localhost:8000/download?path=${path}`);

    if (response.headers.get('Content-Type') === 'application/json'){
        const jsonData = await response.json();
        if (jsonData.success === false) {throw new Error(`Failed to download ${name} as it exceeds 50mb.`);}
    }

    const blob = await response.blob();
    saveAs(blob, name);
    await updateData(parameters);
    const timeTaken = getElapsedTime(startTime, new Date());
    toast.success(`Downloaded ${name} (${timeTaken}).`)
}


export const handleDelete = async (parameters, name, path, index) => {

    const startTime = new Date();
    const delete_span = document.getElementById(`delete-${index}`);
    delete_span.innerText = "⌛️ Deleting";
    document.getElementById("explorer").style.pointerEvents = "none";

    await fetch(`http://localhost:8000/delete?path=${path}`);
    await updateData(parameters);

    const timeTaken = getElapsedTime(startTime, new Date());
    toast.success(`Deleted ${name} (${timeTaken}).`);
    if (delete_span){delete_span.text = "❌ Delete";}
}


export const handleFolderUp = async (parameters) => {

    document.getElementById("explorer").style.pointerEvents = "none";
    await fetch(`http://localhost:8000/up_dir?current_dir=${parameters.currentDir()}`);
    await updateData(parameters);
};