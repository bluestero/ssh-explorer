// Explorer.jsx
import '../styling/Breadcrumb.css'
import { handleCrumb } from '../utils/BreadcrumbUtils';

export default function Breadcrumb (props) {

    const parameters = props.parameters;
    const data = parameters.data;

    return (
        <div id = "breadcrumb">
            <span>/</span>
            {data().dir_names.map((name, index) => (
                <>
                <span class = "clickable" onClick = {() => handleCrumb(data().dir_paths[index], parameters)}>{name}</span>
                <span>/</span>
                </>
            ))}
        </div>
    )
}