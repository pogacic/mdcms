package dirhandler

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"strings"
)

type DirNode struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	ChildIDs     []int  `json:"childIds"`
	PathFromRoot string `json:"pathFromRoot"`
}

var nodes = make(map[int]*DirNode)

func getPathFromRoot(root string, path string, file string) string {
	result := strings.ReplaceAll(path, root, "")
	return result + "/" + file
}

func findParentDirID(path string) int {
	dir := filepath.Dir(path)
	for id, node := range nodes {
		if node.Name == filepath.Base(dir) {
			return id
		}
	}
	return -1
}

func createRootNode(nodes map[int]*DirNode, rootDirF []int) {
	rootNode := &DirNode{
		ID:       0,
		Name:     "/",
		ChildIDs: []int{},
	}
	nodes[0] = rootNode
	for _, id := range rootDirF {
		if id != 0 { // ignore root dir
			if slices.Contains(rootDirF, id) {
				rootNode.ChildIDs = append(rootNode.ChildIDs, id)
			}
		}
	}
}

func GetFlattenedDir(fpath string) ([]byte, error) {
	var currentID int
	var rootDirF []int

	err := filepath.Walk(fpath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		isDir := info.IsDir()
		pathFromRoot := getPathFromRoot(fpath, filepath.Dir(path), info.Name())

		// If file parent dir is root dir (e.g mdcms_content)
		if filepath.Dir(path) == fpath {
			rootDirF = append(rootDirF, currentID)
			node := &DirNode{
				ID:           currentID,
				Name:         info.Name(),
				ChildIDs:     []int{},
				PathFromRoot: pathFromRoot,
			}
			nodes[currentID] = node
			currentID++

			return nil
		}

		// Only allow files ending with .md, allowing images etc to be served and not included
		// TODO: Better file type checking
		if !isDir && !strings.Contains(info.Name(), ".md") {
			return nil
		}

		parentDirID := findParentDirID(path)
		if parentDirID != -1 {
			nodes[parentDirID].ChildIDs = append(nodes[parentDirID].ChildIDs, currentID)
		}
		node := &DirNode{
			ID:           currentID,
			Name:         info.Name(),
			ChildIDs:     []int{},
			PathFromRoot: pathFromRoot,
		}
		nodes[currentID] = node
		currentID++

		return nil
	})

	// Create root node
	createRootNode(nodes, rootDirF)

	result := make(map[int]DirNode)
	for id, node := range nodes {
		result[id] = *node
	}

	// Marshall that json big dawg
	output, err := json.Marshal(result)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		return nil, err
	}

	return output, nil
}
