import os
import sys
import shutil
from typing import List
from datetime import datetime
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File
from starlette.background import BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, Response
sys.path.insert(0, os.path.dirname(os.path.realpath(__file__)))
import utils
from mediadb_database import Database

app = FastAPI()

# Enable CORS to allow requests from your SolidJS app
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000", "http://localhost:3001"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

# Define a Pydantic model to validate the file upload
class FileUpload(BaseModel):
    file: UploadFile


@app.get("/get_contents", response_class = JSONResponse)
async def get_contents(ascending: bool):

    directory = os.getcwd()
    splits = utils.split_path(directory)
    content = os.listdir(directory)
    content = sorted(content, key = lambda x: x.lower())

    if not ascending:
        content.reverse()

    items = {
        'size' : [],
        'name' : [],
        'path' : [],
        'is_dir' : [],
        'last_updated' : [],
        'current_dir' : directory,
        'dir_names' : splits[0],
        'dir_paths' : splits[1]
    }

    for item in content:
        path = os.path.join(directory, item)
        items['name'].append(item)
        items['path'].append(path)
        items['size'].append(utils.get_size(path))
        items['is_dir'].append(os.path.isdir(path))
        items['last_updated'].append(utils.gettime(path))

    return items


@app.get("/up_dir", response_class = JSONResponse)
async def folder_up(current_dir):
    parent_directory = os.path.dirname(current_dir)
    try:
        os.chdir(parent_directory)
        return {"success": True}
    except Exception as e:
        return {"success": False, "error" : e}


@app.get("/item_tapped")
async def tap_item(item: str):

    # -If directory, changing the directory and returning-#
    if os.path.isdir(item):
        os.chdir(item)
        return

    with open(item, 'rb') as file:
        content = file.read()

    content_disposition = f'attachment; filename = "{item}"'

    # return FileResponse(item, filename = os.path.basename(item), content_disposition_type = "inline")
    return Response(content = content, headers = {"Content-Disposition": content_disposition})


@app.get("/new_folder")
async def new_folder(current_dir: str, folder_name: str):

    #-Creating the by joining current_dir with folder_name-#
    folder_path = os.path.join(current_dir, folder_name)

    #-If path already exists, returning an error-#
    if os.path.exists(folder_path):
        return JSONResponse({'success' : False})

    #-Else returning success true-#
    else:
        os.mkdir(folder_path)
        return JSONResponse({'success' : True})


@app.get("/download")
async def download(path: str, background_tasks: BackgroundTasks):

    #-Checking if it is a directory or not-#
    if os.path.isdir(path):

        #-Archiving it and changing path to the zip file-#
        shutil.make_archive(os.path.basename(path), 'zip', path)
        path = f"{path}.zip"

        #-Adding a background task-#
        background_tasks.add_task(os.remove, path)

    #-If file size more than 50mb, returning failure-#
    if os.path.getsize(path) / (1024 * 1024) > 50:

        #-Adding a background task-#
        background_tasks.add_task(os.remove, path)

        #-Returning a json to show it failed-#
        return JSONResponse({'success' : False})

    #-Returning the content-#
    return FileResponse(path, filename = os.path.basename(path))


@app.get("/delete")
async def delete(path: str):

    #-Removing whole tree if directory-#
    if os.path.isdir(path):
        shutil.rmtree(path)

    #-Else removing the file-#
    else:
        os.remove(path)


@app.post("/upload")
async def upload_and_download_files(files: List[UploadFile] = File(...)):

    #-Iterating the files-#
    for file in files:

        #Opening a file in write byte mode-#
        with open(file.filename, "wb") as f:

            #-Writing the contents down-#
            f.write(file.file.read())

    #-Returning success as True if no errors-#
    return {"success": True}

@app.post("/upload_folder")
async def upload_folder(files: List[UploadFile] = File(...)):

    #-Getting the folder name-#
    print(os.path.sep)
    for file in files:
        folder_name = file.filename.split(os.path.sep)[0]
        break

    #-Storing all the unique directories in a set-#
    directories = {os.path.dirname(file.filename) for file in files if not os.path.exists(os.path.dirname(file.filename))}

    #-Iterating the directories set and creating all those directories-#
    for directory in directories: os.makedirs(directory, exist_ok = True)

    #-Iterating and writing all the files-#
    for file in files:
        with open(file.filename, "wb") as f:
            f.write(file.file.read())

    #-Returning success as True if no errors-#
    return {"success": True, "folder_name" : folder_name}