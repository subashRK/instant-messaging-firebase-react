import { makeStyles, Typography } from "@material-ui/core"

const useStyles = makeStyles({
  notFoundText: {
    fontSize: "2rem",
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})

const NotFound = () => {
  const classes = useStyles()

  return (
    <Typography variant="h2" className={classes.notFoundText}>
      Page Not Found! (404)
    </Typography>
  )
}

export default NotFound
