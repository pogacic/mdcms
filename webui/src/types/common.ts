export interface IDirNode {
    id: number
    name: string
    childIds: number[]
    isDir: boolean
    pathFromRoot: string
}