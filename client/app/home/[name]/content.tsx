import React from 'react'
import YouTubeEmbed from "@/app/components/YouTubeEmbed"

type Props = {
    video?: string;
    content: string;
}

const createStyleTag = () => {
    return `
        .content-container h1 {
            font-size: 20px;
            font-weight: bold;
            margin: 1.5rem 0 1rem;
            color: #333;
        }
        .content-container h2 {
            font-size: 18px;
            font-weight: bold;
            margin: 1.25rem 0 0.75rem;
            color: #444;
        }
        .content-container h3 {
            font-size: 16px;
            font-weight: bold;
            margin: 1rem 0 0.5rem;
            color: #555;
        }
        .content-container p {
            margin: 0.75rem 0;
            line-height: 1.6;
        }
        .content-container ul {
            margin-left: 2rem;
            margin-bottom: 1rem;
        }
        .content-container ol {
            margin-left: 2rem;
            margin-bottom: 1rem;
        }
        .content-container li {
            margin-bottom: 0.5rem;
        }
        .content-container a {
            color: #2563eb;
            text-decoration: underline;
        }
        .content-container img {
            max-width: 100%;
            height: auto;
            border-radius: 0.375rem;
            margin: 1rem 0;
        }
        .content-container blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            font-style: italic;
            margin: 1rem 0;
        }
        .content-container code {
            background-color: #f1f5f9;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-family: monospace;
        }
        .content-container pre {
            background-color: #f1f5f9;
            padding: 1rem;
            border-radius: 0.375rem;
            overflow-x: auto;
            margin: 1rem 0;
        }
        .content-container table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        .content-container th {
            border: 1px solid #e5e7eb;
            padding: 0.5rem;
            text-align: left;
        }
        .content-container td {
            border: 1px solid #e5e7eb;
            padding: 0.5rem;
            text-align: left;
        }
    `;
};

const Content = ({video, content}: Props) => {
    return (
        <div className="rounded-md bg-white shadow-md p-6 w-full">
            {video && <YouTubeEmbed videoUrl={video} />}
            <style dangerouslySetInnerHTML={{ __html: createStyleTag() }} />
            <div 
                className="content-container"
                dangerouslySetInnerHTML={{ __html: content }}
            ></div>
        </div>
    )
}

export default Content;