// Explorer.jsx
import './styling/Explorer.css';
import NavBar from './components/NavBar';
import Contents from './components/Contents';
import Breadcrumb from './components/Breadcrumb';
import { updateData } from '../../GeneralUtils';


export default function Explorer (props) {

    const parameters = props.parameters;
    updateData(parameters);

    return (
        <div id = "explorer">
            <NavBar parameters = {parameters}/>
            <Breadcrumb parameters = {parameters}/>
            <Contents parameters = {parameters}/>
        </div>
    );
}