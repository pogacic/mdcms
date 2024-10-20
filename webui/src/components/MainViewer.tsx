import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

import '../assets/highlight.css'
import { IMainViewerProps } from './Types'

export function MainViewer({content}: IMainViewerProps) {
    return (
        <article className="prose lg:prose-xl text-pretty">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{content}</Markdown>
        </article>
    )
}