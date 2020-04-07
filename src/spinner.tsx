interface Props {
  backgroundColor?: [number, number, number],
  height?: string,
  width?: string,
}

const Spinner = (props: Props) => {
  const {
    backgroundColor = [255, 255, 255],
    width = '24px',
    height = '24px',
  } = props
  const [r, g, b] = backgroundColor

  return (
    <div className="spinner">
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .spinner {
          border-radius: 50%;
          width: ${width};
          height: ${height};
          border: 0.25rem solid rgba(${r}, ${g}, ${b}, 0.3);
          border-top-color: rgb(${r}, ${g}, ${b});
          animation: spin 1s infinite linear;
        }
      `}</style>
    </div>
  )
}

export default Spinner
