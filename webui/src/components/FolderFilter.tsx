import { IDirNode } from "../types/common"

interface IFolderFilterProps {
    paths: IDirNode[]
    navClick: Function
    setCurrentId: Function
}

export function FolderFilter({paths, navClick, setCurrentId}: IFolderFilterProps) {
    const folderFilter = []
    for (const id of paths[0].childIds) {
        if (paths[id]["name"] == "index.md") {
            folderFilter.push(
                <div key={id}>
                    <div onClick={() => {navClick(paths[id]["pathFromRoot"]); setCurrentId(0)}}>📁<button className="pl-1 underline">/</button></div>
                </div>
            )
        }
    }
    // Push other dirs after index.md (home)
    for (const id of paths[0].childIds) {
        if (paths[id]["name"] != "index.md") {
            folderFilter.push(
                <div key={id}>
                    <button onClick={() => {setCurrentId(id)}}>📁<span className="pl-1 underline select">{paths[id]["name"]}</span></button>
                </div>
            )
        }
    }

    return (
        <>
            {folderFilter}
        </>
    )
}