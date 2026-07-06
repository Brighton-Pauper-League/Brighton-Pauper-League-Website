import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {HelpCircleIcon} from '@sanity/icons'
import guide from '../docs/admin-guide.md?raw'

// Renders the canonical admin guide (docs/admin-guide.md) as a Studio tool, so
// admins have in-app documentation. Styled with inline styles that read on both
// the light and dark Studio themes (colours inherit; borders use currentColor).

const border = '1px solid rgba(128,128,128,0.3)'

export function AdminGuideTool() {
  return (
    <div
      style={{
        padding: '2rem 1.5rem 4rem',
        maxWidth: 820,
        margin: '0 auto',
        lineHeight: 1.6,
        fontSize: '0.95rem',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 style={{fontSize: '1.75rem', margin: '0 0 1rem'}} {...props} />,
          h2: (props) => (
            <h2
              style={{
                fontSize: '1.3rem',
                margin: '2rem 0 0.75rem',
                paddingBottom: '0.35rem',
                borderBottom: border,
              }}
              {...props}
            />
          ),
          h3: (props) => <h3 style={{fontSize: '1.05rem', margin: '1.5rem 0 0.5rem'}} {...props} />,
          p: (props) => <p style={{margin: '0.75rem 0'}} {...props} />,
          ul: (props) => <ul style={{margin: '0.5rem 0', paddingLeft: '1.4rem'}} {...props} />,
          ol: (props) => <ol style={{margin: '0.5rem 0', paddingLeft: '1.4rem'}} {...props} />,
          li: (props) => <li style={{margin: '0.3rem 0'}} {...props} />,
          a: (props) => (
            <a style={{color: '#3b82f6'}} target="_blank" rel="noreferrer" {...props} />
          ),
          code: (props) => (
            <code
              style={{
                fontFamily: 'monospace',
                fontSize: '0.85em',
                background: 'rgba(128,128,128,0.18)',
                padding: '0.1rem 0.35rem',
                borderRadius: '3px',
              }}
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              style={{
                margin: '1rem 0',
                padding: '0.5rem 1rem',
                borderLeft: '3px solid rgba(128,128,128,0.5)',
                opacity: 0.85,
              }}
              {...props}
            />
          ),
          table: (props) => (
            <div style={{overflowX: 'auto'}}>
              <table style={{borderCollapse: 'collapse', width: '100%', margin: '1rem 0'}} {...props} />
            </div>
          ),
          th: (props) => (
            <th style={{border, padding: '0.4rem 0.6rem', textAlign: 'left', background: 'rgba(128,128,128,0.12)'}} {...props} />
          ),
          td: (props) => <td style={{border, padding: '0.4rem 0.6rem'}} {...props} />,
          hr: (props) => <hr style={{border: 'none', borderTop: border, margin: '2rem 0'}} {...props} />,
        }}
      >
        {guide}
      </ReactMarkdown>
    </div>
  )
}

export const adminGuideTool = {
  name: 'admin-guide',
  title: 'Guide',
  icon: HelpCircleIcon,
  component: AdminGuideTool,
}
