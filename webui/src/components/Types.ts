export interface IDirNode {
    id: number
    name: string
    childIds: number[]
    isDir: boolean
    pathFromRoot: string
}

export interface IMainViewerProps {
    content: string
}

export interface ISideNavProps {
    paths: IDirNode[]
    navClick: Function
}

export interface INavItemProps {
    current: IDirNode
}