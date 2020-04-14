import { useCallback, useState } from 'react'

import Spinner from '../spinner'
import graphQLClient, {
  MUTATION_SUBSCRIBE_TO_PRODUCT_UPDATES,
} from '../graphql'
import BoringContainer from '../boring-container'

interface FormState {
  submitted: boolean,
  loading: boolean,
  email: string,
}

const SubscribeToProductUpdatesPage = () => {
  const [{ submitted, loading, email }, setFormStatus] = useState<FormState>({
    submitted: false,
    loading: false,
    email: null,
  })

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      const form = event.target
      const formData = new FormData(form)
      const email = formData.get('email') as string

      setFormStatus({ submitted: false, loading: true, email })

      await graphQLClient.request(MUTATION_SUBSCRIBE_TO_PRODUCT_UPDATES, {
        email,
      })

      setFormStatus({ submitted: true, loading: false, email })
    },
    [setFormStatus],
  )

  return (
    <BoringContainer>
      <h2>🔔 Email Notifications are coming soon!</h2>

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
          <span className="email">{email}</span>.<br />
          Thank you for your support!
        </p>
      )}

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
                  <Spinner
                    height="20px"
                    width="20px"
                    backgroundColor={[35, 41, 70]}
                  />
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

      <style jsx>{`
        h2 {
          margin: 0 0 0.3em;
          color: var(--card-heading);
        }
        .subtitle {
          color: var(--paragraph);
        }
        p {
          color: var(--card-paragraph);
        }
        .form {
          display: grid;
          grid-template-columns: auto;
          grid-gap: 1em;
        }
        .form input:focus {
          outline: none;
        }
        .form button {
          cursor: pointer;
          border: none;
          border-radius: 4px;
          box-sizing: border-box;
          background-color: var(--button);
          color: var(--button-text);
          font-weight: bold;
          position: relative;
          overflow: hidden;
          padding: 1em 1em;
        }
        .form button[disabled] {
          opacity: 1;
        }
        .form button:hover {
          opacity: 0.9;
        }
        .spinner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--button);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .fine-print {
          text-align: center;
          color: #999;
          font-size: 0.7em;
        }
        .email {
          background-color: rgba(255, 250, 101, 0.3);
        }
        .fade-in {
          animation: fade-in 1s;
        }
        @keyframes fade-in {
          0% {
            background-color: rgba(255, 250, 101, 0.7);
          }
          100% {
            background-color: rgba(255, 250, 101, 0);
          }
        }
        @media only screen and (min-width: 640px) {
          .form {
            grid-template-columns: 1fr auto;
          }
        }
      `}</style>
    </BoringContainer>
  )
}

export default SubscribeToProductUpdatesPage
