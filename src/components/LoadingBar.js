import { CircularProgress } from "@material-ui/core"

const LoadingBar = ({ className, color }) => {
  return (
    <div className={className && className}>
      <CircularProgress
        size={35}
        color={color ? color : "secondary"}
      />
    </div>
  )
}

export default LoadingBar
