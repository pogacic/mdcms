import _ from "lodash";
import { useState } from "react";
import { IDirNode, INavItemProps, ISideNavProps } from "./Types";

export function SideNav({paths, navClick}: ISideNavProps) {
    if (typeof paths[0] == "undefined") {
        return (
            <>
                <div>Loading...</div>
                <div>If you can see this for more than 2 seconds then something has exploded, sorry 💥</div>
            </>
        )
    }

    const [currentId, setCurrentId] = useState(0)
    const [search, setSearch] = useState('')
    const [treeExpand, setTreeExpand] = useState(true)

    const siteName = import.meta.env.VITE_SITE_NAME

    function handleSearch(x: any) {
        setSearch(x.target.value)
    }

    const filteredFuzzy: any = _.filter(paths, (item) => {
        if (search != "") {
            return _.includes(item.pathFromRoot.toLowerCase(), search.toLowerCase())
        }
    })

    // Only get root dir directories for filtering
    const rootDirOnly = []
    for (const id of paths[0].childIds) {
        if (paths[id]["name"] == "index.md") {
            rootDirOnly.push(
                <div key={id}>
                    <div onClick={() => {navClick(paths[id]["pathFromRoot"]); setCurrentId(0)}}>📁<button className="pl-1 underline">/</button></div>
                </div>
            )
        }
    }
    // Push other dirs after index.md (home)
    for (const id of paths[0].childIds) {
        if (paths[id]["name"] != "index.md") {
            rootDirOnly.push(
                <div key={id}>
                    <button onClick={() => {setCurrentId(id)}}>📁<span className="pl-1 underline select">{paths[id]["name"]}</span></button>
                </div>
            )
        }
    }

    const NavItem = ({ current }: INavItemProps) => {
        return (
          <ul className="list-disc select">
            {current.isDir && current.childIds.length > 0 && (
                <li className="pl-4 text-pretty">
                    📁 {current.name}
                    {current.childIds.map((childId: number) => (
                        <NavItem key={childId} current={paths[childId]} />
                    ))}
                </li>
            )}
            {!current.isDir && (
                <li className="pl-4">
                    📄
                    <button onClick={() => {navClick(paths[current.id]["pathFromRoot"])}} className="pl-1 underline">{current.name}</button>
                    {current.childIds.map((childId: number) => (
                        <NavItem key={childId} current={paths[childId]} />
                    ))}
                </li>
            )}
          </ul>
        );
      };

    return (
        <div className="w-96">
            <div className="text-lg font-extrabold text-center">
                {siteName}
            </div>

            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
            <input value={search} onChange={handleSearch} className="border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" placeholder="> Search"></input>

            {search != "" && (
                <>
                    <div className="text-sm text-gray-500 mt-2">Output</div>
                    <div className="border rounded p-2 text-sm">
                        {filteredFuzzy.map((item: IDirNode) => (
                            <button onClick={() => {navClick(item.pathFromRoot)}} className="pl-1 underline select">{item.pathFromRoot}</button>
                        ))}
                    </div>
                </>
            )}

            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
            <div className="text-sm text-gray-500">Folder filter</div>
            {rootDirOnly}

            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
            <div className="text-sm text-gray-500">
                Main file tree
                <span className="ml-52 select">
                    {treeExpand && (
                        <button onClick={() => setTreeExpand(false)}>(↑ collapse)</button>
                    )}
                    {!treeExpand && (
                        <button onClick={() => setTreeExpand(true)}>(↓ expand)</button>
                    )}
                </span>
            </div>
            {treeExpand && (
                <li>
                    <NavItem current={paths[currentId]} />
                </li>
            )}
        </div>
    )
}