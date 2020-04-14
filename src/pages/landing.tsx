import Link from 'next/link'

import EntypoShoppingCart from 'react-entypo-icons/lib/entypo/ShoppingCart'
import EntypoMail from 'react-entypo-icons/lib/entypo/Mail'
import EntypoBackInTime from 'react-entypo-icons/lib/entypo/BackInTime'
import EntypoShop from 'react-entypo-icons/lib/entypo/Shop'

const LandingPage = () => {
  return (
    <div className="container">
      <header>
        <div className="logo">
          <EntypoShoppingCart />
        </div>
        <h1>Click & Collect</h1>
        <p className="subtitle">Keeping an eye on Supermarket pick up slots</p>
      </header>

      <section className="cta">
        <Link href="/" passHref>
          <a className="button">Open App</a>
        </Link>
      </section>

      <section className="section-grid">
        <div className="section-item">
          <div className="icon">
            <EntypoShop />
          </div>
          <h2>Quick Comparisons</h2>
          <p>
            Compare over 300 supermarkets in New Zealand, and find the best one
            for you.
          </p>
        </div>
        <div className="section-item">
          <div className="icon">
            <EntypoBackInTime />
          </div>
          <h2>24 Hour History</h2>
          <p>
            View the available slots over the last 24 hours to see when new
            slots were added and how quickly they book up
          </p>
        </div>
        <div className="section-item">
          <div className="icon">
            <EntypoMail />
          </div>
          <h2>Email Notifications</h2>
          <p>
            Subscribe to your local supermarkets and get notified as soon as a
            slot is available.
          </p>
        </div>
      </section>

      <footer>
        <p>Made with ♥ in New Zealand</p>
      </footer>

      <style global jsx>{`
        body {
          background: var(--background);
        }
      `}</style>
      <style jsx>{`
        .container {
          height: 100vh;
          max-width: 60em;
          margin: 0 auto;
          padding 0 1em;
          display: flex;
          flex-direction: column;
        }
        header {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 3rem 0;
        }
        .logo {
          color: var(--background);
          font-size: 2rem;
          height: 2em;
          width: 2em;
          border-radius: 50%;
          background: var(--headline);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        h1 {
          color: var(--headline);
          max-width: 100%;
          width: 380px;
          padding: 50px 0 0 0;
          height: 0;
          background: url('/logo.svg') no-repeat center center;
          background-size: contain;
          overflow: hidden;
          margin: 0;
        }
        .subtitle {
          color: var(--paragraph);
          font-style: italic;
          margin: 0;
        }

        .cta {
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .section-grid {
          flex: 1;
        }
        .section-item {
          margin-bottom: 2rem;
        }
        .icon {
          font-size: 3em;
          text-align: center;
          color: var(--paragraph);
        }
        h2 {
          color: var(--headline);
          margin: 0;
          line-height: 2em;
          border-top: 5px solid rgba(255, 255, 255, 0.05);
        }
        p {
          margin: 0;
          color: var(--paragraph);
        }

        .button {
          text-decoration: none;
          border-radius: 4px;
          padding: 1em 3em;
          background: var(--button);
          color: var(--button-text);
          font-weight: bold;
        }

        footer {
          border-top: 5px solid rgba(255, 255, 255, 0.05);
          text-align: center;
          color: var(--paragraph);
          line-height: 3em;
        }

        @media (min-width: 500px) {
          .section-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 1em;
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
