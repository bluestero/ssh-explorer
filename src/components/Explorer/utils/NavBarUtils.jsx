// NavBarUtils.jsx

import toast from "solid-toast";
import { getElapsedTime, unFreeze, updateData } from "../../../GeneralUtils";

export const handleHomepage = async (parameters) => {

  document.getElementById("explorer").style.pointerEvents = "none";

  await fetch("http://localhost:8000/item_tapped?item=/home/akhatib/API");
  await updateData(parameters);

  toast.success(`Back to HomePage.`)
  }


export const handleRefresh = async (parameters) => {

  document.getElementById("explorer").style.pointerEvents = "none";

  await updateData(parameters);
  toast.success('Explorer Refreshed.');
}


export const handleNewFolder = async (parameters) => {

  const startTime = new Date();
  document.getElementById("explorer").style.pointerEvents = "none";

  const userInput = prompt('Enter name for the new folder :');
  const regexPattern = /^[a-zA-Z0-9\s()_,.-]{1,100}$/;  
  
  if (userInput !== null){
    if (!regexPattern.test(userInput)) {
      toast.error('Folder not created.\nFolder name should be: 1-100 characters.\nAlphanumeric. Allowed Characters: ( ) _ , . -');
      unFreeze('explorer', 0);  
      return;
    }

    const response = await fetch(`http://localhost:8000/new_folder?current_dir=${parameters.currentDir()}&folder_name=${userInput}`);
    const jsonResponse = await response.json();

    if (!jsonResponse.success) {
      throw new Error(`Folder not created.\nFolder ${userInput} already exists.`);
    }
    
    await updateData(parameters);

    const timeTaken = getElapsedTime(startTime, new Date());
    toast.success(`Created folder '${userInput}' (${timeTaken}).`);
  }
}


export const handleUploadFiles = async (parameters) => {

  const failedFiles = [];
  const passedFiles = [];
  const startTime = new Date();
  const formData = new FormData();
  const maxFileSizeLimit = 50 * 1024 * 1024;
  const files = document.getElementById('uploadFiles').files;
  document.getElementById("explorer").style.pointerEvents = "none";
  
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxFileSizeLimit) {failedFiles.push(files[i].name)}
    else {
      formData.append('files', files[i]);
      passedFiles.push(files[i].name);
    }
  }

  if (!passedFiles.length) {throw new Error('Failed to upload files. Can be due to file size.');}

  await fetch('http://localhost:8000/upload', {method: 'POST', body: formData,});

  updateData(parameters);
  document.getElementById('uploadFiles').value = '';
  const timeTaken = getElapsedTime(startTime, new Date());

  if (failedFiles.length) {toast.error(`Files failed to upload due to 50MB size limit are as follows:\n${failedFiles.map(item => `- "${item}"`).join('\n')}`);}
  toast.success(`Uploaded Files (${timeTaken}):\n${passedFiles.map(item => `- "${item}"`).join('\n')}`);
}


export const handleUploadFolder = async (parameters) => {

  const startTime = new Date();
  const failedFiles = [];
  const passedFiles = [];
  const formData = new FormData();
  const maxFileSizeLimit = 50 * 1024 * 1024;
  const folder = document.getElementById('uploadFolder');

  for (const file of folder.files){
    if (file.size > maxFileSizeLimit){failedFiles.push(file.name)}
    else {
      formData.append('files', file);
      passedFiles.push(file.name);
    }
  }

  if (!passedFiles.length) {throw new Error('Failed to upload files. Can be due to file size.');}

  const response = await fetch('http://localhost:8000/upload_folder', {method: 'POST', body: formData});
  const jsonReponse = await response.json();

  updateData(parameters);
  document.getElementById('uploadFolder').value = '';
  if (failedFiles.length) {toast.error(`Files failed to upload due to 50MB size limit are as follows:\n${failedFiles.map(item => `- "${item}"`).join('\n')}`);}

  const timeTaken = getElapsedTime(startTime, new Date());
  toast.success(`Uploaded folder '${jsonReponse.folder_name}'.\nAlong its contents (${timeTaken}).`);
}