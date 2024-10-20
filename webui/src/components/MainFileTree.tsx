import { IDirNode } from "../types/common"

interface IMainFileTree {
    paths: IDirNode[]
    navClick: Function
    currentId: number
}

interface IMainFileTreeItem {
    current: IDirNode
}

export function MainFileTree({paths, navClick, currentId}: IMainFileTree) {
    const TreeItem = ({ current }: IMainFileTreeItem) => {
        return (
          <ul className="list-disc select">
            {current.childIds.length > 0 && (
                <li className="pl-4 text-pretty">
                    📁 {current.name}
                    {current.childIds.map((childId: number) => (
                        <TreeItem key={childId} current={paths[childId]} />
                    ))}
                </li>
            )}
            {current.childIds.length <= 0 && (
                <li className="pl-4">
                    📄
                    <button onClick={() => {navClick(paths[current.id]["pathFromRoot"])}} className="pl-1 underline">{current.name}</button>
                    {current.childIds.map((childId: number) => (
                        <TreeItem key={childId} current={paths[childId]} />
                    ))}
                </li>
            )}
          </ul>
        );
      };

    return (
        <li>
            <TreeItem current={paths[currentId]} />
        </li>
      )
}