import { useEffect, useState } from "react"
import { SideNav } from "./components/SideNav"
import { MainViewer } from "./components/MainViewer"
import { IDirNode } from "./types/common"


function App() {
  const [paths, setPaths] = useState<IDirNode[]>([])
  const [mdData, setMdData] = useState("")
  const [urlPath, setUrlPath] = useState("/index.md")

  const apiUrl = import.meta.env.VITE_API_URL

  // On page load, check location.pathname and trigger md load
  useEffect(() => {
    if (location.pathname != "/") {
      setUrlPath(location.pathname)
    }
    document.title = import.meta.env.VITE_SITE_NAME
  }, [])

  function handleNavChange(path: string) {
    window.history.pushState("", "", path)
    setUrlPath(path)
  }

  // Pull .md from static endpoint /public from API
  useEffect(() => {
    fetch(apiUrl + "/public" + urlPath)
    .then((res) => {
      return res.text()
    })
    .then((data) => {
      // Dirty check to not spew out <pre> tags for valid dirs
      if (data.includes("doctype")) {
        setMdData("404 page not found")
        return
      }
      setMdData(data)
    })
  }, [urlPath])

  // Get file dir structure from API
  useEffect(() => {
    fetch(apiUrl + "/get-paths")
    .then((res) => {
        return res.json()
    })
    .then((data) => {
        setPaths(data)
    })
  }, [])

  return (
    <>
      <div className="container mx-auto p-8">
        <div className="flex flex-col md:grid md:grid-rows-3 md:grid-flow-col md:gap-4">
          <div className="md:row-span-3">
            <SideNav paths={paths} navClick={handleNavChange} />
          </div>
          <div className="md:row-span-2 h-2">
            <hr className="mt-4 pb-3 md:invisible md:p-0 md:m-0"></hr>
            <MainViewer content={mdData} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
