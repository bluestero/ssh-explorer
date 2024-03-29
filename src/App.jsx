// App.jsx
import './App.css'
import banner from './assets/banner.png'
import { createSignal } from "solid-js";
import { unFreeze } from './GeneralUtils';
import { toast, Toaster } from 'solid-toast';
import Explorer from './components/Explorer/Explorer';


const [currentDir, setCurrentDir] = createSignal("");
const [firstLoad, setFirstLoad] = createSignal(true);
const [nameAscending, setNameAscending] = createSignal(true);
const [data, setData] = createSignal({ name: [], is_dir: [], path: [], size: [], last_updated: [], dir_names: [], dir_paths: []});

const parameters = {
  data,
  setData,
  firstLoad,
  setFirstLoad,
  currentDir,
  setCurrentDir,
  nameAscending,
  setNameAscending,
};


function App() {
  
  window.addEventListener("error", (event) => {
    let source = '';
    unFreeze('explorer', 0);
    if (event.error.stack) {source = `\nSource: ${event.error.stack.match(/\/(\w+\.jsx)/)[1]}.`;}
    toast.error(`${event.message}${source}`);
  });

  window.addEventListener("unhandledrejection", (event) => {
    let source = '';
    unFreeze('explorer', 0);
    if (event.reason.stack) {source = `\nSource: ${event.reason.stack.match(/\/(\w+\.jsx)/)[1]}.`;}
    toast.error(`${event.reason}${source}`);
  });

  return (
  <div class = "main">
  <Toaster gutter = {8}/>
    <img id = "banner" src = {banner} alt = "Error Loading banner.png" />
    <Explorer parameters = {parameters}/>
  </div>
  );
}

export default App;