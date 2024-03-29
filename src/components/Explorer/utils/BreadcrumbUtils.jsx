// ContentsUtils.jsx
import { updateData } from "../../../GeneralUtils";

export const handleCrumb = async (path, parameters) => {

    document.getElementById("explorer").style.pointerEvents = "none";
    await fetch(`http://localhost:8000/item_tapped?item=${path}`);
    await updateData(parameters);
};