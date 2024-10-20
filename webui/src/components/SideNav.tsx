import _ from "lodash";
import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { FolderFilter } from "./FolderFilter";
import { MainFileTree } from "./MainFileTree";
import { IDirNode } from "../types/common";

export interface ISideNavProps {
    paths: IDirNode[]
    navClick: Function
}

export function SideNav({paths, navClick}: ISideNavProps) {
    if (typeof paths[0] == "undefined") {
        return (
            <div>Loading...</div>
        )
    }

    const [currentId, setCurrentId] = useState(0)
    const [treeExpand, setTreeExpand] = useState(true)

    const siteName = import.meta.env.VITE_SITE_NAME

    return (
        <div className="w-72 md:w-96">
            <div className="text-lg font-extrabold text-center">
                {siteName}
            </div>

            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
            <SearchBar paths={paths} navClick={navClick} />

            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>

            <div className="text-sm text-gray-500">Folder filter</div>
            <FolderFilter paths={paths} navClick={navClick} setCurrentId={setCurrentId} />

            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>

            <div className="text-sm text-gray-500">
                Main file tree
                <span className="ml-28 md:ml-52 select">
                    {treeExpand && (
                        <button onClick={() => setTreeExpand(false)}>(↑ collapse)</button>
                    )}
                    {!treeExpand && (
                        <button onClick={() => setTreeExpand(true)}>(↓ expand)</button>
                    )}
                </span>
            </div>
            {treeExpand && (
                <MainFileTree paths={paths} navClick={navClick} currentId={currentId} />
            )}
        </div>
    )
}