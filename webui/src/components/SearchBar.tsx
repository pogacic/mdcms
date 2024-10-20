import { useState } from "react"
import { IDirNode } from "../types/common"
import _ from "lodash"

interface ISearchBarProps {
    paths: IDirNode[]
    navClick: Function
}

export function SearchBar({paths, navClick}: ISearchBarProps) {
    const [search, setSearch] = useState('')

    function handleSearch(x: any) {
        setSearch(x.target.value)
    }

    const filteredFuzzy: any = _.filter(paths, (item) => {
        if (search != "") {
            return _.includes(item.pathFromRoot.toLowerCase(), search.toLowerCase())
        }
    })

    return (
    <>
        <input value={search} onChange={handleSearch} className="border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" placeholder="> Search"></input>
        {search != "" && (
            <>
                <div className="text-sm text-gray-500 mt-2">Output</div>
                <div className="border rounded p-2 text-sm">
                    {filteredFuzzy.map((item: IDirNode) => (
                        <button key={item.id} onClick={() => {navClick(item.pathFromRoot)}} className="pl-1 underline select">{item.pathFromRoot}</button>
                    ))}
                </div>
            </>
        )}
    </>
    )
}