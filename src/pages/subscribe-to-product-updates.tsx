import fetch from 'isomorphic-unfetch'
import { useCallback, useState } from 'react'
import Link from 'next/link'

import Spinner from '../spinner'
import { CLOUD_ENDPOINT } from '../constants'
import { QUERY_SUBSCRIBE_TO_PRODUCT_UPDATES } from '../queries'

interface FormState {
  submitted: boolean,
  loading: boolean,
  email: string,
}

const SubscribeToProductUpdatesPage = () => {
  const [{ submitted, loading, email }, setFormStatus] = useState<FormState>({
    submitted: false,
    loading: false,
    email: 'george@czabania.com',
  })

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      const form = event.target
      const formData = new FormData(form)
      const email = formData.get('email') as string

      setFormStatus({ submitted: false, loading: true, email })

      const response = await fetch(CLOUD_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
          query: QUERY_SUBSCRIBE_TO_PRODUCT_UPDATES,
          variables: {
            email,
          },
        }),
        headers: {
          'content-type': 'application/json; charset=utf-8',
        },
      })
      const body = await response.json()

      setFormStatus({ submitted: true, loading: false, email })
    },
    [setFormStatus],
  )

  return (
    <div className="container">
      <h2>
        <Link href="/" passHref>
          <a>Click & Collect NZ</a>
        </Link>
      </h2>
      <h3>
        <span className="subtitle">Upcoming Feature:</span> 🔔 Email
        Notifications
      </h3>

      <p>
        Would you like to receive an email notification when new slots become
        available?
      </p>
      <p>
        <strong>
          This feature is currently being developed and is not yet ready to use.
        </strong>
      </p>
      {submitted === false && (
        <p>
          If you would like to be notified when this feature is available,
          please leave your email address below.
        </p>
      )}
      {submitted === true && (
        <p className="fade-in">
          When this feature is ready to use, I will let you know at{' '}
          <code>{email}</code>.<br />
          Thank you for your support!
        </p>
      )}
      <p>
        Cheers,
        <br />
        George.
      </p>

      {submitted === false && (
        <section>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              required
            />
            <button type="submit" disabled={loading}>
              {loading && (
                <div className="spinner">
                  <Spinner height="20px" width="20px" />
                </div>
              )}
              Let Me Know When Notifications Are Ready
            </button>
          </form>
          <p className="fine-print">
            I will never sell or share your email address with anyone.
          </p>
        </section>
      )}

      <style jsx global>{`
        body {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
      <style jsx>{`
        .container {
          margin 0;
          padding: 1em;
          border-radius: 4px;
          border: 1px solid #eee;
        }
        h2 {
          margin: 0 0 0.3em;
        }
        h3 {
          margin: 0 0 0.3em;
        }
        .subtitle {
          color: #777;
        }
        .form {
        }
        .form input {
          width: 100%;
          box-sizing: border-box;
        }
        .form button {
          width: 100%;
          box-sizing: border-box;
          background-color: #4b7bec;
          color: #fff;
          font-weight: bold;
          position: relative;
          overflow: hidden;
        }
        .form button[disabled] {
          opacity: 1;
        }
        .form button:hover {
          background-color: #3867d6;
        }
        .spinner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #4b7bec;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .fine-print {
          text-align: center;
          color: #999;
          font-size: 0.7em;
        }
        .fade-in {
          animation: fade-in 1s;
        }
        @keyframes fade-in {
          0% { background-color: rgba(255, 250, 101, 0.7);}
          100% { background-color: rgba(255, 250, 101, 0);}
        }
        @media only screen and (min-width: 640px) {
          .form {
            display: flex;
          }
          .form input {
            flex: 1;
            width: auto;
          }
          .form button {
            width: auto;
          }
        }
      `}</style>
    </div>
  )
}

export default SubscribeToProductUpdatesPage
