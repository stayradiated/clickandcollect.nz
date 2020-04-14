import { ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  children: ReactNode,
}

const BoringContainer = (props: Props) => {
  const { children } = props

  return (
    <div className="container">
      <h1>
        <Link href="/" passHref>
          <a>Click & Collect NZ</a>
        </Link>
      </h1>

      <div className="contents">{children}</div>

      <style jsx global>{`
        body {
          background: var(--background);
        }
      `}</style>
      <style jsx>{`
        .container {
          max-width: 40em;
          margin: 0 auto;
          padding 0 1em;
        }
        .contents {
          padding: 1em;
          border-radius: 4px;
          background: #e8e4e6;
          background: var(--card-background);
        }
        h1 a {
          color: var(--headline);
        }
      `}</style>
    </div>
  )
}

export default BoringContainer
