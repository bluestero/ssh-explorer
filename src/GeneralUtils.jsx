// GeneralUtils.jsx


export const getElapsedTime = (start, end) => {

  let formattedTime = "";
  const timeDelta = end - start;
  const seconds = Math.floor(timeDelta / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {formattedTime += `${hours} h `;}
  if (minutes > 0) {formattedTime += `${minutes} m `;}
  if (remainingSeconds > 0) {formattedTime += `${remainingSeconds} s`;}

  return formattedTime;
  };


export const unFreeze = (element, time = 3) => {
  setTimeout(() => {document.getElementById(element).style.pointerEvents = "auto";}, time * 1000);}


export const updateData = async (parameters) => {

  if (parameters.firstLoad()){
    parameters.setFirstLoad(false);
    await fetch("http://localhost:8000/item_tapped?item=/home/akhatib/API");
  }

  const response = await fetch(`http://localhost:8000/get_contents?ascending=${parameters.nameAscending()}`);
  const jsonData = await response.json();
  const arrayLength = jsonData.name.length;

  const sortedData = {
    name: [],
    path: [],
    size: [],
    is_dir: [],
    last_updated: [],
    dir_names: jsonData.dir_names,
    dir_paths: jsonData.dir_paths
  };

  for (let index = 0; index < arrayLength; index++) {
    if (jsonData.is_dir[index]) {
      sortedData.is_dir.push(true);
      sortedData.name.push(jsonData.name[index]);
      sortedData.path.push(jsonData.path[index]);
      sortedData.size.push(jsonData.size[index]);
      sortedData.last_updated.push(jsonData.last_updated[index]);
    }
  }

  for (let index = 0; index < arrayLength; index++) {
    if (!jsonData.is_dir[index]) {
      sortedData.is_dir.push(false);
      sortedData.name.push(jsonData.name[index]);
      sortedData.path.push(jsonData.path[index]);
      sortedData.size.push(jsonData.size[index]);
      sortedData.last_updated.push(jsonData.last_updated[index]);
    }
  }

  parameters.setData(sortedData);
  parameters.setCurrentDir(jsonData.current_dir);
  console.log(parameters.currentDir());
  const main_div = document.getElementById("explorer");
  if (main_div) {main_div.style.pointerEvents = "auto";}
}